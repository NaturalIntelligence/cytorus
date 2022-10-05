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
    
    // normalize the arguments of CommonJS require() if the OS has '\' as path separator
    codeAsStr = normalizeRequireFilePaths(codeAsStr)
    
    return codeAsStr;
}

function requireInBrowser(moduleName){
    return "require('" + path.join( __dirname, moduleName) +"');"
}

function normalizeRequireFilePaths(fileContent) {
    // if an OS is used that has '\' instead of '/' as path separator, then we need to
    // replace the '\' with a '/' for the arguments of CommonJS require()
    const backslashInRequirePathPattern = /(?<=require\(\'.*)\\(?=.*\'\))/g
    return fileContent.replaceAll(backslashInRequirePathPattern, '/');
}

module.exports = bundledCode;
