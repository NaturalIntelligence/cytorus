///@ts-check
const path = require("path");
const events = require("./Events");
const { PATHS: _P, FNs: _F} = require("../Constants");
const {forEachRule, forEachScenarioIn} = require("./Repository");

//report folder will be clear from the cli cmd
events.after("feature", saveResult);

function saveResult(feature){
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
    const resultFileName = Date.now()+".json";
    _F.debug_cy("Saving result for " + resultFileName);
    cy.writeFile( path.join( _P.MINIMAL_RESULT_PATH , resultFileName), featureObj, { log: false });
    cy.writeFile( path.join( _P.DETAIL_RESULT_PATH  , resultFileName), feature, { log: false });
}