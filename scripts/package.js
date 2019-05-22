const child_process = require("child_process");
const rollup = require('rollup');
const fs = require("fs");
const babel = require("@babel/core");
const babelPresetEnv = require("@babel/preset-env");

const info = {};
let logging = true;

function release(preventLogging){
    if(preventLogging){
        logging = false;
    }
    return new Promise((resolve, reject)=>{
        getName()
            .then(() => ensureDir())
            .then(() => copyMetadata())
            .then(() => copyAppFiles())
            .then(() => copyAppSrc())
            .then(() => bundleApp())
            .then(() => babelify())
            .then(() => pack())
            .then(()=>{
                info.absolutePath = process.cwd() + "/dist/" + info.mpkg;
                log('MPK file created! ' + process.cwd() + "/" + info.mpkg);
                log('(Notice that mpkg files are actually tgz files)');
                resolve(info);
            })
            .catch(err => {
                return reject(err);
                process.exit(-1);
            });
    })

}

function getName() {
    return new Promise((resolve, reject) => {
        fs.readFile("./metadata.json", function(err, res) {
            if (err) {
                return reject(new Error("Metadata.json file can't be read: run this from a directory containing a metadata file."));
            }

            const contents = res.toString();
            info.data = JSON.parse(contents);

            if (!info.data.identifier) {
                return reject(new Error("Can't find identifier in metadata.json file"));
            }

            if(!info.data.version){
                return reject(new Error("Can't find version in metadata.json file"));
            }

            if(!info.data.name){
                return reject(new Error("No name provided for your app"));
            }

            return resolve();
        });
    });
}

function ensureDir() {
    info.dest = info.identifier + ".mpkg";
    return exec("rm -rf ./dist/" + info.dest).then(() => exec("mkdir -p ./dist/" + info.dest));
}

function copyMetadata() {
    return exec("cp -r ./metadata.json ./dist/" + info.dest);
}

function copyAppFiles() {
    if (fs.existsSync("./static")) {
        return exec("cp -r ./static ./dist/" + info.dest);
    } else {
        return Promise.resolve();
    }
}

function copyAppSrc() {
    if (fs.existsSync("./src")) {
        return exec("cp -r ./src ./dist/" + info.dest);
    } else {
        return Promise.resolve();
    }
}

function bundleApp() {
    return rollup.rollup({input: "./src/App.js"}).then(bundle => {
        info.qualifier = "APP_" + info.identifier.replace(/\./g, "_");
        return bundle.generate({format: 'iife', name: info.qualifier}).then(content => {
            info.bundled = content.code;

            info.bundleLocation = "./dist/" + info.dest + "/appBundle.js";
            fs.writeFileSync(info.bundleLocation, info.bundled);
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

            info.bundleLocation = "./dist/" + info.dest + "/appBundle.es5.js";
            fs.writeFileSync(info.bundleLocation, info.babelified);

            resolve();
        });
    });
}

function pack() {
    info.mpkg = info.identifier + ".mpkg.tgz";
    return exec("tar -czf ../" + info.mpkg + " *", {cwd: "./dist/" + info.dest});
}

function exec(command, opts) {
    return new Promise((resolve, reject) => {
        log("EXECUTE: " + command);
        child_process.exec(command, opts, function(err, stdout, stderr) {
            if (err) {
                return reject(err);
            }
            log(stdout);
            console.warn(stderr);
            resolve(stdout);
        });
    });
}

const log = (message) => {
    if(logging){
        console.log(message);
    }
}

module.exports.release = release;