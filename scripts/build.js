// quick setup just for testing .. this should be made more robust!!

import fs from 'fs'
import path from 'path'
import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const baseDir = process.env.npm_config_baseDir

const inputOptions = {
    input: path.join(baseDir, 'src/index.js'),
    plugins: [resolve({ browser: true }), commonjs(), babel()],
}

let outputOptions = {
    format: 'iife',
    name: 'APP_',
    file: path.join(baseDir, '/dist/appBundle.js'),
}

const getName = function() {
    return new Promise((resolve, reject) => {
        fs.readFile(baseDir + "/metadata.json", function(err, res) {
            if (err) {
                console.error(err)
                return reject(new Error("Metadata.json file can't be read: run this from a directory containing a metadata file."));
            }

            const contents = res.toString();
            const data = JSON.parse(contents);

            if (!data.identifier) {
                return reject(new Error("Can't find identifier in metadata.json file"));
            }

            if(!data.version){
                return reject(new Error("Can't find version in metadata.json file"));
            }

            if(!data.name){
                return reject(new Error("No name provided for your app"));
            }

            return resolve(data);
        });
    });
}

getName().then( (data) => {
    outputOptions.name = "APP_" + data.identifier.replace(/[^0-9a-zA-Z_$]/g, "_");
    rollup(inputOptions)
        .then(bundle => {
        return bundle
            .generate(outputOptions)
            .then(() => {
                bundle
                    .write(outputOptions)
                    .then(console.log('App bundle written to ' + outputOptions.file))
                    .catch(console.error)
            })
            .catch(console.error)
        })
        .catch(console.error)
})


fs.copyFile(
    path.join(process.cwd(),
    process.cwd().indexOf('/node_modules/') > -1 ? '..' : 'node_modules',
    'wpe-lightning/dist/lightning.js'), path.join(baseDir, 'dist/lightning.js'
), (err) => {
    if(!err) {
        console.log('Lightning copied to ' + baseDir + '/dist/lightning.js')
    }
    else console.error(err)
})