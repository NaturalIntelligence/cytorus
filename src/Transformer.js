const through = require("through");
const fs = require('fs');
const path = require('path');
const Cucumon = require('cucumon');

const featureFileParser =  new Cucumon({
  clubBgSteps : true,
});

const featureObjFilePath = ".cucumon/featureObj.json";
const transform = fileName => {
    let content = "";

    function end() {
      if (fileName.endsWith(".feature")) {
        parseFeatureFile(content, fileName);
        const transformedCode = bundledCode(fileName, path.resolve(featureObjFilePath));
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
  if (!fs.existsSync(".cucumon")){
    fs.mkdirSync(".cucumon");
  }

  let featureObj = featureFileParser.parse(data);
  featureObj.fileName = fileName;
  fs.writeFile(featureObjFilePath, JSON.stringify(featureObj));

}

const loadDefinitions = require("./StepDefinitionsPathLoader");

/**
 * Bundle all required code including step defenitions, and test code generator
 * @param {string} featureFileData 
 */
function bundledCode(fileName, p){
    let codeAsStr = "";
    
    codeAsStr += requireInBrowser( "Globals.js"); 
    codeAsStr += requireInBrowser( "Events.js"); 
    codeAsStr += "const filter = " + requireInBrowser("ScenarioFilter.js");
    codeAsStr += "window.featureObj= filter(require('"+p+"'));";
    codeAsStr += "window.Repository = " + requireInBrowser("Repository.js");
    codeAsStr += "const runTest = " + requireInBrowser("TestsRunner.js");
    codeAsStr += "\n" + loadDefinitions().join("\n"); //include step definitions

    //Run tests
    codeAsStr += "runTest(featureObj,'"+ fileName +"');";

    //codeAsStr += "const codeLoader = " + requireInBrowser("CodeLoader.js");
    //codeAsStr += "codeLoader('"+ process.cwd()+"', '"+ __dirname+"', '"+fileName+"','"+ p +"')";
    return codeAsStr;
}

function requireInBrowser(moduleName){
    return "require('" + path.join( __dirname, moduleName) +"');"
}

module.exports = {
  transformer: transform,
  parser: featureFileParser
}