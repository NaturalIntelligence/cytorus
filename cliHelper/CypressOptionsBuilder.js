const boolProperties = {
    "--headed" : "headed",
    "--headless" : "headless",
    "--no-exit" : "exit", //should be set to false
    "--record" : "record",
    "--parallel" : "parallel",
    "--dev" : "dev",
    "-q": "quiet",         "--quiet": "quiet",
};
const strProperties = {
    "-b" : "browser",      "--browser" : "browser",
    "--ci-build-id" : "ciBuildId",
    "-C" : "configFile",   "--config-file" : "configFile", //string or boolean
    "--group" : "group",
    "-s": "spec",          "--spec": "spec",
    "-P": "project",       "--project": "project",
    "-k": "key",           "--key": "key",
    "-r": "reporter",      "--reporter": "reporter",
    "-t": "tag",           "--tag": "tag",
}
const numProperties = {
    "-p": "port",          "--port": "port",
}
const objProperties = {
    "-c" : "config",       "--config" : "config",
    "-e" : "env",          "--env" : "env",
    "-o": "reporterOptions", "--reporter-options": "reporterOptions",
}

function cliArgsToObj(args){
    const options = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        let val = true;
        let key = boolProperties[arg];
        if(!key){
            key = strProperties[arg];
            val = args[++i];
            if(!key){
                key = numProperties[arg];
                if(key) val = Number.parseInt(val);
                else{
                    key = objProperties[arg];
                    if(key) val = parseToObj(val);
                }
            }
        }
        options[key] = val;
    }
    if(options.config){
        options.config = parseToObj(options.config);
    }
    return options;
}

//TODO: handle env variable with object values
const regex = /(\w+)=([^,]*)/g;
function parseToObj(str){
    const matches = regex.exec(str);
    if(matches){
        const obj = {};
        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            obj[match[1]] = match[2];
        }
        return obj;
    }
}

module.exports = cliArgsToObj