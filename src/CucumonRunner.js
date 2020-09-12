const browserify = require("@cypress/browserify-preprocessor");
const { transformer, parser} = require("./Transformer");
const { cucumon_log} = require("./tasks");

function updateTransformOption(options){
    const opt = Object.assign(options, { browserifyOptions: options.browserifyOptions });

    if( !Array.isArray(opt.browserifyOptions.transform) ){
        opt.browserifyOptions.transform = [transformer];
    }else if(!opt.browserifyOptions.transform.includes(transformer) ){
        opt.browserifyOptions.transform = [transformer].concat(opt.browserifyOptions.transform);
    }
    return opt;
}

class CucumonRunner {
    constructor(config){
        this.config = config;
    }

    filePreProcessor(options){
        const opt = options || browserify.defaultOptions;

        return async file => {
          return browserify( updateTransformOption(opt) )(file);
        };
    }

    c_logger = cucumon_log;
}

module.exports = CucumonRunner;