const path = require("path");

const defaultProjConfig = {
    // setup:{
    //     "step_definitions": "steps" //relative to "cypress/integration"
    // },
    runConfig: {
    },
    init: ()=> {},
    end: ()=> {},
    threshold: []
}
function buildMissingConfig(projConfig){
    const newProjConfig = deepAssign(projConfig, defaultProjConfig);

    // if(!newProjConfig.runConfig.docker.cypress){
    //     const packageConfig = require( path.join( process.cwd(), "package.json") )
    //     if( packageConfig.dependencies.cypress){
    //         newProjConfig.runConfig.docker.cypress = /[0-9\.]+/.exec(packageConfig.dependencies.cypress)[0];
    //     }else if( packageConfig.devDependencies.cypress){
    //         newProjConfig.runConfig.docker.cypress = /[0-9\.]+/.exec(packageConfig.devDependencies.cypress)[0];
    //     }else{
    //         newProjConfig.runConfig.docker.cypress = "7.3.0";
    //         console.error("Couldn't find target cypress version to run. Using 7.3.0.");
    //     }
    // }

    return newProjConfig;
}


function deepAssign(userConfig, defaultConfig){
    const newProjConfig = Object.assign({},defaultConfig, userConfig);
    
    //if(!newProjConfig.runConfig) newProjConfig.runConfig = {};
    // if(!newProjConfig.runConfig.docker) newProjConfig.runConfig.docker = {};
    // if(!newProjConfig.runConfig.docker.env) newProjConfig.runConfig.docker.env = [];

    if(!Array.isArray(newProjConfig.threshold)){
        throw new Error("Threshold must be defined as  an array of objects in project configuration");
    }
    return newProjConfig;
}
module.exports = buildMissingConfig;