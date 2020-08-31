const browserify = require("@cypress/browserify-preprocessor");
const { transformer, parser} = require("./Transformer");
const reportHandler = require("./ReportHandler");



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
        this.reportHandlersArr = [];
        this.parser = parser;
    }

    filePreProcessor(options){
        const opt = options || browserify.defaultOptions;

        return async file => {
          return browserify( updateTransformOption(opt) )(file);
        };
    }

    reportsTo(reportHandler){
        reportHandler.register(reportHandler);
    }
}

module.exports = CucumonRunner;