const {trigger} = require("./Events");

function beforeSuit(suit){
    trigger("B", "suit", suit);
}
function afterSuit(suit){
    trigger("A", "suit", suit);
}

function beforeFeature(fObj){
    trigger("B", "feature", fObj);
}

function afterFeature(fObj){
    trigger("A", "feature", fObj);
}

function beforeScenario(scenario){
    const eventObj = {
        statement : scenario.statement,
    }
    trigger("B", "scenario", eventObj);
}
function afterScenario(scenario){
    const eventObj = {
        statement : scenario.statement,
        status: scenario.status
    }
    trigger("A", "scenario", eventObj);
}

function beforeStep(step){
    const eventObj = {
        statement : step.statement,
    }
    trigger("B", "step", eventObj);
}
function afterStep(step){
    const eventObj = {
        statement : step.statement,
        status: step.status
    }
    trigger("A", "step", eventObj);
}

function error(err){
    trigger("A", "step", err);
}

module.exports = {
    beforeSuit: beforeSuit,
    afterSuit: afterSuit,
    beforeFeature: beforeFeature,
    afterFeature: afterFeature,
    beforeScenario: beforeScenario,
    afterScenario: afterScenario,
    beforeStep: beforeStep,
    afterStep: afterStep,
    error: error,
}