const loadDefinitions = require("./StepDefinitionsPathLoader");
const path = require('path');

/**
 * Bundle all required code including step defenitions, and test code generator
 * @param {string} featureFileData 
 */
function bundledCode(serializedFeaturePath, isCyDashboard, cliOptions){
    let codeAsStr = "";
    codeAsStr += "window.__projRootDir = '" + __projRootDir + "';";
    codeAsStr += "window.isCyDashboard = " + isCyDashboard + ";";
    codeAsStr += requireInBrowser( "Globals.js"); 
    codeAsStr += "window.featureObj= require('"+serializedFeaturePath+"');";

    //codeAsStr += requireInBrowser( "Events.js");
    codeAsStr += "window.Registry = " + requireInBrowser("Registry.js");
    codeAsStr += "const runTest = " + requireInBrowser("TestsRunner.js");
    codeAsStr += "\n" + loadDefinitions().join("\n"); //include step definitions
    // if(cliOPtions.cli){
    //   codeAsStr += requireInBrowser("ResultSaver.js");
    // }
    //Run tests
    codeAsStr += `runTest(featureObj, ${cliOptions.routeCount});`;
    return codeAsStr;
}

function requireInBrowser(moduleName){
    return "require('" + path.join( __dirname, moduleName) +"');"
}

module.exports = bundledCode;
