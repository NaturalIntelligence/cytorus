const path = require("path");
const paths = require("../paths");
const { cliLog } = require("../Tasks");
const { forEachRule, forEachScenarioIn} = require("./Iterators");

/**
 * Call this method after all the tests for a feature are executed.
 * 
 * Update feature object with extra information and save it on the disk.
 * @param {object} feature Updated feature object
 */
async function saveResult(feature){
    
    //Below line gives following error; so commented
    /**
"after all" hook for "Scenario: simple":
TypeError: Cannot read property 'addCommand' of undefined

Because this error occurred during a `after all` hook we are skipping the remaining tests in the current suite: `Feature: Failing scenarios`
      at Attempt._addCommand (https://www.google.com/__cypress/runner/cypress_runner.js:164184:10)
      at Attempt.addLog (https://www.google.com/__cypress/runner/cypress_runner.js:164031:25)

     */
    const resultFileName = extractRelativePath(feature.fileName, paths.features ).replace(/\.feature$/, ".json");
    //Due to https://github.com/cypress-io/cypress/issues/3350

    cliLog("Saving minimal result for " + feature.fileName);
    cy.writeFile( path.join( paths.report.minimal, resultFileName), minimalReportBuilder(feature), { log: false });
    cliLog("Saving detailed result for " + feature.fileName);
    cy.writeFile( path.join( paths.report.detailed, resultFileName), feature, { log: false });
    
    //I can't call cy.writeFile directly as it timesout
    //So I'm using task to writeFile
    // cy.task("cytorus_writeFile", path.join( paths.report.minimal , resultFileName), featureObj );
    // cy.task("cytorus_writeFile", path.join( paths.report.detailed , resultFileName), feature );
}

function extractRelativePath(path, basePath){
    return path.substr(basePath.length).replace(/\//g,"%");
}

function minimalReportBuilder(feature){
    const featureObj = {
        title: feature.title,
        fileName: feature.fileName,
        tags: feature.tags,
        stats: feature.stats,
        scenarios: []
    };
    forEachRule(feature, rule => {
        forEachScenarioIn(rule, (scenario, s_i, e_i) => {
            const scenarioObj = {
                title: scenario.title,
                tags: scenario.tags,
                status: scenario.status,
                position: {
                    scenario: s_i,
                    example: e_i
                }
            }
            featureObj.scenarios.push(scenarioObj);
        });
    });
    return featureObj;
}

module.exports.saveResult = saveResult;
