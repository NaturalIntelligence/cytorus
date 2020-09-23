const filter = require('./../ScenarioFilter');
const Cucumon = require("cucumon");
const fs = require("fs");
const path = require("path");
const {traverse} = require("./../Util");
const { PATHS: _P, FNs: _F } = require("./../../Constants");

/**
 * Collect filesname
 * Load content from each file
 * parse
 * @param {object} cliConfig 
 */
function parseSpecs(cliConfig){
    const features = [];
    const cucumon = new Cucumon({clubBgSteps : true});
    //TODO: support regex to select multiple files or all the files from a folder
    for (let s_i = 0; s_i < cliConfig.specs.length; s_i++) {
      let specFiles;
      const spec = cliConfig.specs[s_i];
      if(!spec.files){
        specFiles = traverse(_P.FEATURES_PATH, ".feature");
      }else if(Array.isArray(spec.files)){
        specFiles = spec.files;
      }else if(typeof spec.files === 'string'){
        specFiles = spec.files.split(",");
      }
    
      //TODO: this can be async
      for (let i = 0; i < specFiles.length; i++) {
        const specFilePath = specFiles[i];
        const fileContent = fs.readFileSync(specFilePath).toString();
        if(!fileContent.startsWith("#!")){
          _F.debug("Parsing:"+ specFilePath);
          const featureObj = cucumon.parse( fileContent );
          filter( [featureObj] , spec);
          featureObj.fileName = specFilePath;
          features.push( featureObj );
        }
      }
    }
    return features;
}
  


  module.exports = parseSpecs;