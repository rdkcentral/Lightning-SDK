const child_process = require("child_process");
const rollup = require('rollup');
const fs = require("fs");
const babel = require("@babel/core");
const babelPresetEnv = require("@babel/preset-env");

const dir = __dirname + "/..";

const LNG_PATH = require.resolve('wpe-lightning/dist/lightning.min.js');

const info = {};
getName()
    .then(() => ensureDir())
    .then(() => copySkeleton())
    .then(() => ensureSrcDirs())
    .then(() => copyLightning())
    .then(() => copyMetadata())
    .then(() => copyUxFiles())
    .then(() => copyAppFiles())
    .then(() => bundleUx())
    .then(() => bundleApp())
    .then(() => babelify())
    .then(() => console.log('Web release created! ' + process.cwd() + "/dist/" + info.dest))
    .then(() => console.log('(Use a static web server to host it)'))
    .catch(err => {
        console.error(err);
        process.exit(-1)
    });

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

            info.identifier = info.data.identifier;

            return resolve();
        });
    });
}


function ensureDir() {
    info.dest = "web";
    return exec("rm -rf ./dist/" + info.dest).then(() => exec("mkdir -p ./dist"));
}

function copySkeleton() {
    return exec("cp -r " + dir + "/dist/web ./dist/");
}

function copyMetadata() {
    return exec("cp -r ./metadata.json ./dist/" + info.dest);
}

function copyUxFiles() {
    return exec("cp -r " + dir + "/static-ux ./dist/" + info.dest);
}

function copyLightning() {
    return exec("cp -r " + LNG_PATH + " ./dist/" + info.dest + "/js/src/");
}

function copyAppFiles() {
    if (fs.existsSync("./static")) {
        return exec("cp -r ./static ./dist/" + info.dest);
    } else {
        return Promise.resolve();
    }
}

function bundleApp() {
    console.log("Generate rollup bundle for app (src/App.js)");
    return rollup.rollup({input: "./src/App.js"}).then(bundle => {
        return bundle.generate({format: 'iife', name: "appBundle"}).then(content => {
            const location = "./dist/" + info.dest + "/js/src/appBundle.js";
            fs.writeFileSync(location, content.code);
        });
    });
}

function bundleUx() {
    console.log("Generate rollup bundle for ux");
    return rollup.rollup({input: dir + "/js/src/ux.js"}).then(bundle => {
        return bundle.generate({format: 'iife', name: "ux"}).then(content => {
            const location = "./dist/" + info.dest + "/js/src/ux.js";
            fs.writeFileSync(location, content.code);
        });
    });
}

function ensureSrcDirs() {
    return Promise.all([
        exec("mkdir -p ./dist/" + info.dest + "/js/src"),
        exec("mkdir -p ./dist/" + info.dest + "/js/src.es5")
    ]);
}

function babelify() {
    return Promise.all([
        babelifyFile("./dist/" + info.dest + "/js/src/appBundle.js", "./dist/" + info.dest + "/js/src.es5/appBundle.js"),
        babelifyFile("./dist/" + info.dest + "/js/src/lightning.min.js", "./dist/" + info.dest + "/js/src.es5/lightning.min.js"),
        babelifyFile("./dist/" + info.dest + "/js/src/ux.js", "./dist/" + info.dest + "/js/src.es5/ux.js")
    ])
}
function babelifyFile(inputFile, outputFile) {
    console.log("babelify " + inputFile);
    return new Promise((resolve, reject) => {
        babel.transformFile(inputFile, {presets: [babelPresetEnv]}, function(err, result) {
            if (err) {
                return reject(err);
            }

            fs.writeFileSync(outputFile, result.code);

            resolve();
        });
    });
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
