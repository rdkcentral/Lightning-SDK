const child_process = require("child_process");
const rollup = require('rollup');
const fs = require("fs");
const babel = require("@babel/core");
const babelPresetEnv = require("@babel/preset-env");

const info = {};
getName()
    .then(() => ensureDir())
    .then(() => copyAppFiles())
    .then(() => bundle())
    .then(() => babelify())
    .then(() => pack())
    .then(() => console.log('MPK file created! ' + process.cwd() + info.mpkg))
    .then(() => console.log('(Notice that mpkg files are actually tgz files)'))
    .catch(err => {
        console.error(err);
        process.exit(-1)
    });

function getName() {
    return new Promise((resolve, reject) => {
        fs.readFile("./AppDefinition.js", function(err, res) {
            if (err) {
                return reject(new Error("AppDefinition.js file can't be read: run this from a directory containing an AppDefinition.js file."));
            }

            const contents = res.toString();
            const match = contents.match(/static\s+get\s+identifier\(\)\s+\{\s+return\s+['"]([^'"]+)['"]/);
            if (!match) {
                return reject(new Error("Can't find identifier in AppDefinition file"));
            }

            const name = match[1];

            info.name = name;
            return resolve(name);
        });
    });
}

function ensureDir() {
    info.dest = info.name + ".mpkg";
    return exec("rm -rf ./dist/" + info.dest).then(() => exec("mkdir -p ./dist/" + info.dest));
}

function copyAppFiles() {
    if (fs.existsSync("./static")) {
        return exec("cp -r ./static ./dist/" + info.dest);
    } else {
        return Promise.resolve();
    }
}

function bundle() {
    return rollup.rollup({input: "./AppDefinition.js"}).then(bundle => {
        info.qualifier = "APP_" + info.name.replace(/\./g, "_");
        return bundle.generate({format: 'iife', name: info.qualifier}).then(content => {
            info.bundled = content.code;
        });
    });
}

function babelify() {
    return new Promise((resolve, reject) => {
        babel.transform(info.bundled, {presets: [babelPresetEnv]}, function(err, result) {
            if (err) {
                return reject(err);
            }

            info.babelified = result.code;
            resolve();
        });
    });
}

function pack() {
    info.bundleLocation = "./dist/" + info.dest + "/appBundle.js";
    fs.writeFileSync(info.bundleLocation, info.bundled);

    info.bundleLocation = "./dist/" + info.dest + "/appBundle.es5.js";
    fs.writeFileSync(info.bundleLocation, info.babelified);

    info.mpkg = info.name + ".mpkg.tgz";
    return exec("tar -czf ../" + info.mpkg + " *", {cwd: "./dist/" + info.dest});
}

function exec(command, opts) {
    return new Promise((resolve, reject) => {
        console.log("EXECUTE: " + command);
        child_process.exec(command, opts, function(err, stdout, stderr) {
            if (err) {
                return reject(err);
            }

            console.log(stdout);
            console.warn(stderr);
            resolve(stdout);
        });
    });
}