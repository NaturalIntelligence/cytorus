let defaultConfig = {
    init: () => {},
    end: () => {},
    coverage: [{
        threshold: 100
    }]
};

function readFrom(loadedConfig){
    const config = Object.assign({}, defaultConfig, loadedConfig);

    if(config.init && typeof config.init !== 'function'){
        throw new Error("'init' must be a function in cytorus config");
    }else if(config.end && typeof config.end !== 'function'){
        throw new Error("'end' must be a function in cytorus config");
    }

    return config;
}

module.exports = readFrom;