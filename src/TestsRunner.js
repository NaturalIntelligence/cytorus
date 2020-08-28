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
    reportHandler.report(featureObj, fileName)

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
                    _E.afterStep(step)
                })
        }
    })
}

function runStep(step){
    const fnDetail = stepDefs[step.stepDefsIndex];
    decorateDisplay(step,fnDetail);
    fnDetail.fn.apply(this, fnDetail.arg);
}

const failureReporter = err => {
    currentTest.status = "F";
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