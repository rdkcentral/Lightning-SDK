const packager = require("./package");
const fs = require("fs");
const https = require("https");
const FormData = require("form-data");
const args = process.argv;
const key = args[args.length - 1];
let intervalId = 0;

const options = {
    host:"api.metrological.com",
    path:"/api/@type/app-store/upload-lightning",
    protocol: 'https:',
    headers:{
        'X-Api-Token': key
    }
};

const checkLoginStatus = ()=>{
    let data = "";
    return new Promise((resolve, reject)=>{
        https.get('https://api.metrological.com/api/authentication/login-status',{
            headers:{
                'X-Api-Token': key
            }
        },(res)=>{
            res.on("data",(chunk)=>{
                data += chunk.toString();
            })
            res.on("end",()=>{
                if(res.statusCode !== 200){
                    return reject(new Error("Incorrect API key or not logged in to metrological dashboard"));
                }

                const {securityContext} = JSON.parse(data);
                return resolve(securityContext[0]);
            });
        });
    });
}

checkLoginStatus().then(({type})=>{
    options.path = options.path.replace("@type",type);
}).then(packager.release.bind(null, true)).then((response)=>{



    const {absolutePath, data:{version,identifier}} = response;
    const form = new FormData();

    form.append("id", identifier);
    form.append("version", version);
    form.append('upload', fs.createReadStream(absolutePath));

    const http = form.submit(options,(err, res)=>{
        clearInterval(intervalId);
        if (err){
            console.log(err);
            return;
        }
        res.on("data", (chunk)=>handleData(chunk));
        res.on("end", ()=>handleOnEnd(res));
    })
}).catch((err)=>{
    clearInterval(intervalId);
    log('\x1b[31m%s\x1b[0m',err);
});

startLoader();

const log = (color, message)=>{
    console.clear();
    console.log(color, message);
}

const handleData = (chunk) =>{
    const status = JSON.parse(chunk.toString());
    if(status.hasOwnProperty("success")){
        return onReady();
    }else if(status.hasOwnProperty("error")){
        return onError(status);
    }
}

const handleOnEnd = (res)=>{
    if(res.statusCode !== 200){
        onError({error:"something went wrong"});
    }
}

const onReady = () =>{
    console.clear();
    log('\x1b[32m%s\x1b[0m',`Succesfully uploaded!`);
}

function onError(data={}){
    const error = UPLOAD_ERRORS[data.error];
    if(error){
        log('\x1b[31m%s\x1b[0m',`${error}`);
    }else{
        log('\x1b[31m%s\x1b[0m',`${data.error}`);
    }
}

function startLoader(){
    const pattern = ["◢","◣","◤","◥"];
    let x = 0;
    intervalId = setInterval(()=>{
        log('\x1b[36m%s\x1b[0m',`\ruploading ${pattern[x++]} \r`);
        x &= 3;
    },60)
}

const UPLOAD_ERRORS = {
    "version_already_exists":"The current version of your app already exists",
    "missing_field_file":"There is a missing field",
    "app_belongs_to_other_user":"You are not the owner of this app"
}