//This code will run in browser
const _E = require("./EventObjectBuilder");
const {findStepDef, forEachRule, forEachScenarioIn} = require("./Repository");
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
        currentTest = scenario;
        scenario.status = "passed";
        window.SC = {};//reset Scenario Context for every test
        console.log("%c"+scenario.keyword+":: %c" + scenario.statement, "color: red; font-size:18px", "color: black; font-size:normal");
        for(let i=0; i < scenario.steps.length; i++){
            if(currentTest.status === "failed" || currentTest.status === "undefined") break; //don't execute rest steps;
            const step = scenario.steps[i];
            cy
                .then(() => _E.beforeStep(step))
                .then(() => {
                    
                    runStep(step, i+1);
                })
                .then(() => {
                    step.status = currentTest.status;
                    step.error_message = currentTest.error_message;
                    _E.afterStep(step)
                })
        }
    })
}

function runStep(step , position){
    const isOutline = currentTest.keyword.length > 9;
    const fnDetail = findStepDef(step, isOutline);
    decorateDisplay(step,fnDetail);

    if(!fnDetail){
        currentTest.status = "undefined";
        step.duration = 0;
        console.log("%cStep "+ position +"::%c 🤦 %c" + step.statement
            , "background-color: black; color:white"
            , "background-color: inherit;"
            , "color: inherit; text-decoration: line-through;");
        throw new Error("Step definition is missing for step: " + step.statement);
    }else{
        console.log("%cStep "+ position +"::%c " + step.statement, "background-color: black; color:white", "color: inherit;");
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
    const consoleLog = {
        statement: step.statement,
    }
    if(fnDetail){
        consoleLog.Definition = fnDetail.fn;
        consoleLog.Expression = fnDetail.exp;
        consoleLog.Arguments = JSON.stringify(fnDetail.arg);
    }
    return Cypress.log({
      name: "step",
      displayName: step.keyword,
      message: "**" + step.statement + "**",
      consoleProps: () => consoleLog
    });
  };

// Cypress.on('fail', (err, runnable) => {
//     // returning false here prevents Cypress from
//     // failing the test
//     return false
// })