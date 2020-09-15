const browserify = require("@cypress/browserify-preprocessor");
const { transformer, parser} = require("./Transformer");

function updateTransformOption(options){
    const opt = Object.assign(options, { browserifyOptions: options.browserifyOptions });

    if( !Array.isArray(opt.browserifyOptions.transform) ){
        opt.browserifyOptions.transform = [transformer];
    }else if(!opt.browserifyOptions.transform.includes(transformer) ){
        opt.browserifyOptions.transform = [transformer].concat(opt.browserifyOptions.transform);
    }
    return opt;
}

function filePreProcessor(options){
    const opt = options || browserify.defaultOptions;

    return async file => {
      return browserify( updateTransformOption(opt) )(file);
    };
}

function cucumonRunner(on, config){
    on('task', {
        cucumon_runner_debug (message) {
            console.log(message);
            return null;
        }
    });
    on('file:preprocessor', filePreProcessor());
}

module.exports = cucumonRunner;