const Cucumon = require("cucumon");
const fs = require("fs");
const path = require("path");
const {traverse} = require("./../fs_util");
const paths = require("../../paths");
const { debug } = require("./../../Tasks");

const glob = require("glob");

const cucumon = new Cucumon({clubBgSteps : true});

/**
 * Select feature files as per --specs
 * Filter tests as per CLI args
 * Load content from each file
 * parse
 * @param {array} specsLocation
 * @returns {object} - parsed Feature 
 */
function parseSpecs(runConfig){
    const features = [];
    const filesPattern = runConfig.pattern || path.resolve(paths.features + "/**/*.feature");
    const specFiles = glob.sync(filesPattern );
    debug("Selected feature files to run for " + filesPattern);
    debug(specFiles);
    for (let i = 0; i < specFiles.length; i++) {
      const specFile = specFiles[i];
      if(!specFile.endsWith(".feature")) throw new Error("Only .feature files are permitted for spec");
      else{
        const fileContent = fs.readFileSync(specFile).toString();
        if(!fileContent.startsWith("#!")){
          debug("Parsing:"+ specFile);
          const featureObj = cucumon.parse( fileContent );
          featureObj.fileName = specFile;
          features.push( featureObj );
        }else{
          debug("Skipping " + specFile);
        }
      }
    }
    
    return features;
}

  module.exports = parseSpecs;
