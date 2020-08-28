//This code will run in browser
const _E = require("./EventObjectBuilder");
const {stepDefs, forEachRule, forEachScenarioIn} = require("./Repository");
const reportHandler = require("./ReportHandler");

let currentTest = {};

module.exports = function( featureObj, fileName ){

    _E.beforeFeature(featureObj, fileName);

    describe(featureObj.feature.statement, () => {
        forEachRule(featureObj, rule => {
            window.Cypress.Promise.each([
                _E.beforeRule,
                runScenarios,
                _E.afterRule,
            ], (fn) => {
                if(!fn){
                    console.log()
                }
                fn(rule);
            })
        });
        
    });
    _E.afterFeature(featureObj, fileName);
    //TODO: what if the test doesn't run because of some errors. 
    reportHandler.report(featureObj)

}
function runScenarios(rule){
    forEachScenarioIn(rule, runScenario);
}
function runScenario(scenario){
    if(scenario.skip) {
        //Update pending test count
        xit(scenario.statement, ()=> {}); 
        //it.skip(scenario.statement, ()=> {}); 
        scenario.status = "skipped";
        return; 
    }
    //console.log("Running Scenario", scenario.statement);
    scenario.status = "passed";
    currentTest = scenario;
    window.Cypress.Promise.each([
        _E.beforeScenario,
        runSteps,
        _E.afterScenario,
    ], (fn) => {
        fn(scenario);
    })
}

function runSteps(scenario){
    //console.log("Running scenario", scenario.statement)
    it(scenario.statement, ()=>{
        for(let i=0; i < scenario.steps.length; i++){
            if(currentTest.status === "failed") break; //don't execute rest steps;
            const step = scenario.steps[i];
            cy
                .then(() => _E.beforeStep(step))
                .then(() => runStep(step))
                .then(() => {
                    step.status = currentTest.status;
                    step.error_message = currentTest.error_message;
                    _E.afterStep(step)
                })
        }
    })
}

function runStep(step){
    const fnDetail = stepDefs[step.stepDefsIndex];
    decorateDisplay(step,fnDetail);

    if(!fnDetail.fn){
        currentTest.status = "undefined";
        step.duration = 0;
        throw new Error("Step definition is missing for step: " + step.statement);
    }else{
        const startTime = Date.now();
        fnDetail.fn.apply(this, fnDetail.arg);
        const endTime = Date.now();
        step.duration = endTime - startTime;
    }
}

const failureReporter = err => {
    if(currentTest.status !== "undefined");
        currentTest.status = "failed";
    currentTest.error_message = err;
    _E.error(err);
    throw err;
};
Cypress.on("fail", failureReporter);



function decorateDisplay(step,fnDetail){
    return Cypress.log({
      name: "step",
      displayName: step.keyword,
      message: "**" + step.statement + "**",
      consoleProps: () => {
          return {
              statement: step.statement,
              Definition: fnDetail.fn,
              Expression: fnDetail.exp,
              Arguments: JSON.stringify(fnDetail.arg)
          }
      }
    });
  };