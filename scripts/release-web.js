const child_process = require("child_process");
const fs = require("fs");

const cwd = process.cwd();

const appPath = cwd;
if (!fs.existsSync(appPath + "/AppDefinition.js")) {
    console.error("Can't find AppDefinition.js in current working directory.");
    process.exit(-1);
}


const dir = __dirname + "/..";

exec(dir + "/node_modules/rollup/bin/rollup -c " + dir + "/rollup.config.js", {cwd: cwd}).then(() => {
    return exec(dir + "/node_modules/rollup/bin/rollup -c rollup.ux.config.js", {cwd: dir});
}).then(() => {
    return copyUxFiles();
}).then(() => {
    return copySkeleton();
}).then(() => {
    return copyLightning();
}).then(() => {
    return copyAppFiles();
}).then(() => {
    return exec("node ./node_modules/@babel/cli/bin/babel.js --presets=@babel/preset-env " + cwd + "/dist/release/js/src -d " + cwd + "/dist/release/js/src.es5", {cwd: dir});
}).catch(err => {
    console.error(err);
    process.exit(-1)
}).then(() => {
    console.log('Release successfully created! You can find it in dist/release');
});

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

function copyAppFiles() {
    if (fs.existsSync("./static")) {
        return exec("cp -r ./static ./dist/release/", {cwd: cwd});
    } else {
        return Promise.resolve();
    }
}

function copyUxFiles() {
    return exec("cp -r " + cwd + "/static ./dist/release/", {cwd: dir});
}

function copyLightning() {
    return exec("cp ./node_modules/wpe-lightning/dist/lightning-web.js " + cwd + "/dist/release/js/src/", {cwd: dir});
}

function copySkeleton() {
    return exec("mkdir -p ./dist/release").then(() => {
        return exec("cp -r " + dir + "/dist/release ./dist/", {cwd: cwd});
    });
}