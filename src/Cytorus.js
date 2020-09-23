const browserify = require("@cypress/browserify-preprocessor");
const { transformer, parser} = require("./Transformer");
const { FNs : _F} = require("../Constants");

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

function cytorus(on, config){
    on('task', {
        cytorus_debug (message) {
            _F.debug(message);
            return null;
        }
    });
    on('file:preprocessor', filePreProcessor());
}

module.exports = cytorus;