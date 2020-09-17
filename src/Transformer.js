const Cucumon = require("cucumon");
const through = require("through");
const fs = require('fs');
const path = require('path');
const filter = require('./ScenarioFilter');
const { PATHS: _P, FNs: _F } = require("../Constants");


let cliOPtions = _F.readIfExist( _F.ABS(_P.CLI_ARG_PATH), {});

const transform = fileName => {
    let content = "";
    function end() {
      if (cliOPtions.cli && fileName.match("group[0-9]+.cucumon")) {
        fileName = fileName.replace(/.cucumon$/, ".json");
        const transformedCode = bundledCode(fileName);
        this.queue( transformedCode );
      }else if (fileName.endsWith(".feature") && !content.startsWith("#!")) {
        parseFeatureFile(content, fileName);
        const transformedCode = bundledCode(_P.SERIALIZED_FEATURE_PATH);
        this.queue(transformedCode);
      } else {
        this.queue(content);
      }
      this.queue(null);
    }

    function write(chunk) {
      content += chunk;
    }
    return through(write, end);
  };

function parseFeatureFile(data,fileName){
  !fs.existsSync(_P.WD) || fs.mkdirSync(_P.WD);

  const cucumon = new Cucumon({clubBgSteps : true});
  let featureObj = cucumon.parse(data);
  featureObj.fileName = fileName; //for record
  featureObj = [featureObj];
  filter(featureObj, {});
  fs.writeFile(_P.SERIALIZED_FEATURE_PATH, JSON.stringify(featureObj));
}

const loadDefinitions = require("./StepDefinitionsPathLoader");

/**
 * Bundle all required code including step defenitions, and test code generator
 * @param {string} featureFileData 
 */
function bundledCode(serializedFeaturePath){
    let codeAsStr = "";
    codeAsStr += "window.__projRootDir = '" + __projRootDir + "';";
    codeAsStr += "window.featureObj= require('"+serializedFeaturePath+"');";
    codeAsStr += requireInBrowser( "Globals.js"); 
    codeAsStr += requireInBrowser( "Events.js");
    codeAsStr += "window.Repository = " + requireInBrowser("Repository.js");
    codeAsStr += "const runTest = " + requireInBrowser("TestsRunner.js");
    codeAsStr += "\n" + loadDefinitions().join("\n"); //include step definitions

    if(cliOPtions.cli){
      codeAsStr += requireInBrowser("ResultSaver.js");
    }
    //Run tests
    codeAsStr += "runTest(featureObj);";
    return codeAsStr;
}

function requireInBrowser(moduleName){
    return "require('" + path.join( __dirname, moduleName) +"');"
}

module.exports = {
  transformer: transform,
}