///@ts-check
const path = require("path");
const events = require("./Events");
const {forEachRule, forEachScenarioIn} = require("./Repository");

//report folder will be clear from the cli cmd
events.after("feature", collector);

function collector(feature){
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
                    scenario: s_i
                }
            }
            if(e_i > 0) scenarioObj.position.example = e_i;
            featureObj.scenarios.push(scenarioObj);
        });
    });
    cy.writeFile(path.join(".cucumon/minimal-report", fileName(feature.fileName)), featureObj, { log: false });
}

function fileName(featureFileName){
    return featureFileName.substr(__featuresPath.length).replace("/", "_");
}