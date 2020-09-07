
function beforeAll(){
    window._c_trigger("B", "all");
}
function afterAll(){
    window._c_trigger("A", "all");
}

function beforeFeature(fObj){
    const eventObj = {
        //fileName: fName,
        //lineNumber : fObj.lineNumber,
        statement : fObj.statement,
        //decsription : fObj.decsription,
        //tags : fObj.tags,
        // count = {
        //     rules : fObj.rules.length
        // }
    }
    //Here we can call reporter
    window._c_trigger("B", "feature", eventObj);
}

function afterFeature(fObj, stats){
    const eventObj = {
        //fileName: fName,
        //lineNumber : fObj.lineNumber,
        statement : fObj.statement,
        //decsription : fObj.decsription,
        //tags : fObj.tags,
        count : stats, // passed, failed, skipped
    }
    //Here we can call reporter
    window._c_trigger("A", "feature", eventObj);
}

function beforeScenario(scenario){
    const eventObj = {
        statement : scenario.statement,
    }
    window._c_trigger("B", "scenario", eventObj);
}
function afterScenario(scenario){
    const eventObj = {
        statement : scenario.statement,
        status: scenario.status
    }
    window._c_trigger("A", "scenario", eventObj);
}

function beforeStep(step){
    const eventObj = {
        statement : step.statement,
    }
    window._c_trigger("B", "step", eventObj);
}
function afterStep(step){
    const eventObj = {
        statement : step.statement,
        status: step.status
    }
    window._c_trigger("A", "step", eventObj);
}

function error(err){
    window._c_trigger("A", "step", err);
}

module.exports = {
    beforeAll: beforeAll,
    afterAll: afterAll,
    beforeFeature: beforeFeature,
    afterFeature: afterFeature,
    beforeScenario: beforeScenario,
    afterScenario: afterScenario,
    beforeStep: beforeStep,
    afterStep: afterStep,
    error: error,
}