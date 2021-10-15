///@ts-check
const tasks = require("../Tasks");
const fs = require("fs");
const browserify = require("@cypress/browserify-preprocessor");
const { transformer: feature_file_transformer} = require("./CypressTransformer");

/**
 * 1. Update the file transformation options
 * 2. Don't update the options for the same file
 */
function updateTransformOption(options){
    const opt = Object.assign(options, { browserifyOptions: options.browserifyOptions });
    
    if( !Array.isArray(opt.browserifyOptions.transform) ){ //when there is no transformer
        opt.browserifyOptions.transform = [feature_file_transformer];
    }else if(!opt.browserifyOptions.transform.includes(feature_file_transformer) ){ 
        // whene there are more transformers and feature file transformer is not already added 
        // then append feature file transformer
        opt.browserifyOptions.transform = [feature_file_transformer].concat(opt.browserifyOptions.transform);
    }
    return opt;
}

function filePreProcessor(givenOptions){
    return async file => {
        //browserify([options])(fileContent)
      return browserify(
            updateTransformOption(givenOptions || browserify.defaultOptions )
        )(file);
    };
}

function cytorus(on, givenOptions){
    on('task', {
        cytorus_debug (message) {
            tasks.debug(message);
            return null;
        },
        cytorus_writeFile ( {filename, data}){
            fs.writeFile(filename, data, err => {
                if(err) console.error(err);
            });
            return null;
        }
    });
    on('file:preprocessor', filePreProcessor(givenOptions));
}

module.exports = cytorus;