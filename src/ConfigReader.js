let config = {
    common: {},
    coverage: [{
        threshold: 100
    }],
    reports:[]
};

function readFrom(loadedConfig){
    if(!loadedConfig) return config;
    
    //const loadedConfig = require(configFilePath);
    config = Object.assign({}, config, loadedConfig);

    readCoverageConfig(config.coverage);
    for (let r_i = 0; r_i < config.reports.length; r_i++) {
        const report = config.reports[r_i];
        validateReportOptions(report, r_i);
    }
    return config;
}

function readCoverageConfig(coverageArr){
    for (let i = 0; i < coverageArr.length; i++) {
        const coverage = coverageArr[i];
        if(!coverage.threshold){
            coverage.threshold = 100;
        }
    }
}

function validateReportOptions(report, index){
    if(!report.hooks){
        throwError("Mandatory field 'hooks' is missing for reports["+index+"] ");
    }else if(report.init && typeof report.init !== 'function'){
        throwError("reports["+index+"].init must be a function");
    }else if(report.location){
        throwError("reports["+index+"].location is missing");
    }else if(report.end && typeof report.end !== 'function'){
        throwError("reports["+index+"].end must be a function");
    }else{
        for (let h_i = 0; h_i < report.hooks.length; h_i++) {
            const hook = report.hooks[h_i];
            if(!hook.when || !hook.for || !hook.handler || typeof hook.handler !== 'function'){
                throwError("Mandatory hooks attribute for reports["+index+"] are not present");
            }else{
                //hooks will be registered from the transformer
            }
        }
    }
}

function throwError(msg){
    if(!msg){
        throw new Error(msg);
    }else{
        throw new Error("Error in reading cucumon runner configuration file");
    }
}

module.exports = readFrom;