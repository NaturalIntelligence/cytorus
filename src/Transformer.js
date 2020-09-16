const through = require("through");
const fs = require('fs');
const path = require('path');
const filter = require('./ScenarioFilter');
const {featureFileParser} = require('./ConfigBuilder');
global.__projRootDir = process.cwd();

let cliOPtions = {};
const cucumonConfigFilePath = path.join( __projRootDir, '.cucumon/cli.json');
if(fs.existsSync(cucumonConfigFilePath)){
  cliOPtions = require( cucumonConfigFilePath );
}

const configFilePath = path.join(__projRootDir, "cucumon.r.js");

const featureObjFilePath = ".cucumon/featureObj.json";
const transform = fileName => {
    let content = "";
    function end() {
      if (cliOPtions.cli && fileName.match("group[0-9]+.cucumon")) {
        fileName = fileName.replace(/.cucumon$/, ".json");
        const transformedCode = bundledCode(fileName);
        this.queue( transformedCode );
      }else if (fileName.endsWith(".feature") && !content.startsWith("#!")) {
        parseFeatureFile(content, fileName);
        const transformedCode = bundledCode(path.resolve(featureObjFilePath));
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
  let featureObj = featureFileParser.parse(data);
  console.log("parsing feature file");
  featureObj.fileName = fileName; //for record
  featureObj = [featureObj]
  filter(featureObj, {});
  fs.writeFile(featureObjFilePath, JSON.stringify(featureObj));
}

const loadDefinitions = require("./StepDefinitionsPathLoader");

/**
 * Bundle all required code including step defenitions, and test code generator
 * @param {string} featureFileData 
 */
function bundledCode(featureFilePath){
    let codeAsStr = "";
    codeAsStr += "window.__projRootDir = '" + process.cwd() + "';";
    codeAsStr += "window.__featuresPath = '" + path.join(process.cwd(),"cypress/integration/features") + "';";
    codeAsStr += "window.featureObj= require('"+featureFilePath+"');";
    //codeAsStr += "window.featureObj= require('"+inputJsonFilePath+"');";
    codeAsStr += requireInBrowser( "Globals.js"); 
    codeAsStr += requireInBrowser( "Events.js");
    codeAsStr += "window.Repository = " + requireInBrowser("Repository.js");
    codeAsStr += "const runTest = " + requireInBrowser("TestsRunner.js");
    codeAsStr += "\n" + loadDefinitions().join("\n"); //include step definitions

    if(cliOPtions.cli){
      codeAsStr += requireInBrowser("MinimalReportBuilder.js");
    }
    if(cliOPtions.cli && fs.existsSync( configFilePath )){
      codeAsStr += "const cucumonProjectConfig = require('" + configFilePath + "');";
      codeAsStr += "const cucumonConfigReader = " + requireInBrowser("ConfigReader.js");
      codeAsStr += "const cucumonConfig = cucumonConfigReader(cucumonProjectConfig);";
      codeAsStr += "const integrate = " + requireInBrowser("ConfigIntegrator.js");
      codeAsStr += "integrate(cucumonConfig);";
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