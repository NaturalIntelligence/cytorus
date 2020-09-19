const filter = require('./../ScenarioFilter');
const Cucumon = require("cucumon");
const fs = require("fs");
const path = require("path");
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
        specFiles = travers(_P.FEATURES_PATH);
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
          _F.debug("Parsing:", specFilePath);
          const featureObj = cucumon.parse( fileContent );
          filter( [featureObj] , spec);
          featureObj.fileName = specFilePath;
          features.push( featureObj );
        }
      }
    }
    return features;
  }
  
  function travers(dir){
    const fileArr = [];
    const list = fs.readdirSync(dir);
    
    for (let i = 0; i < list.length; i++) {
      let file = path.resolve(dir, list[i]);
      let stats = fs.lstatSync(file);
  
      if (stats.isDirectory(file)) {
        fileArr.concat(travers(file) );
      } else if (file.endsWith(".feature")) {
          fileArr.push(file);
      }
    }
  
    return fileArr;
  }

  module.exports = parseSpecs;