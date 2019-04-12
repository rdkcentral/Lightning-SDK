const packager = require("./package");
packager.release().then(()=>{
    console.log('\x1b[32m%s\x1b[0m',`success`);
});