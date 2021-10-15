///@ts-check
const through = require("through");
const Cucumon = require("cucumon");
const paths = require("../paths");
const fs_util = require("./fs_util");
const filter = require('./ScenarioFilter');
const fs = require('fs');
const bundledCode = require("./BundledCodeBuilder");

let cliOptions = fs_util.readIfExist( fs_util.absolute(paths.cli), {});

/**
 * Create stream to transform feature file contents to mocha test
 * @param {string} fileName 
 * @returns {object} stream
 */
const transform = fileName => {
    let fileContent = "";
    //It will called at the end of the stream
    function end() {
      if (cliOptions.cli && fileName.match("group[0-9]+.cytorus")) {
        fileName = fileName.replace(/.cytorus$/, ".json");
        const transformedCode = bundledCode(fileName, false, cliOptions);
        this.queue( transformedCode );
      }else if (fileName.endsWith(".feature") && !fileContent.startsWith("#!" ) ){
        parseFeatureFile(fileContent, fileName);
        const transformedCode = bundledCode( fs_util.absolute ( paths.serialized_feature), cliOptions.isCyDashboard, cliOptions);
        
        this.queue(transformedCode);
      } else {
        this.queue(fileContent);
      }
      this.queue(null);
    }

    //This function will be called after each read from the stream
    function write(chunk) {
      fileContent += chunk;
    }
    return through(write, end);
};

/**
 * 1. Parse feature file contetents using Cucumon
 * 2. Save parsed object in a file
 * @param {string} fileContent 
 * @param {string} fileName 
 */
function parseFeatureFile(fileContent,fileName){
  if(!fs.existsSync( paths.WD)) fs.mkdirSync( paths.WD);

  const cucumon = new Cucumon({clubBgSteps : true});
  let featureObj = cucumon.parse(fileContent);
  featureObj.fileName = fileName; //for record
  //To support a feature of combining multiple feature files into one 
  // So that Cypress doesn't rerun everything for each feature file.
  // Instead, Cypress should run one time for combined/joint feature files
  featureObj = [featureObj]; 
  filter(featureObj, {});
  fs.writeFile(paths.serialized_feature, JSON.stringify(featureObj));
}


module.exports = {
  transformer: transform,
}
