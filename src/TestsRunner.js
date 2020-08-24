//This code will run in browser
const _E = require("./EventObjectBuilder");
const Repository = require("./Repository");

const stats = {}
let currentTest = {};



function runScenarios(rule){
    for(let i=0; i < rule.scenarios.length; i++){
        const scenario = rule.scenarios[i];
        if(scenario.skip) {
            //Update pending test count
            xit(scenario.statement, ()=> {}); 
            //it.skip(scenario.statement, ()=> {}); 
            continue; 
        }
        //console.log("Running Scenario", scenario.statement);
        scenario.status = "Pass";
        currentTest = scenario;
        window.Cypress.Promise.each([
            _E.beforeScenario,
            runSteps,
            _E.afterScenario,
        ], (fn) => {
            fn(scenario);
        })
    }
}

function runSteps(scenario){
    //console.log("Running scenario", scenario.statement)
    it(scenario.statement, ()=>{
        for(let i=0; i < scenario.steps.length; i++){
            if(currentTest.status === "Fail") break; //don't execute rest steps;
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
    const fnDetail = Repository.stepDefs[step.stepDefsIndex];
    fnDetail.fn.apply(this, fnDetail.arg);
}

const failureReporter = err => {
    currentTest.status = "F";
    _E.error(err);
    throw err;
};
Cypress.on("fail", failureReporter);

module.exports = function( featureObj, fileName ){
    //console.log("Running test");

    _E.beforeFeature(featureObj, fileName);

    describe(featureObj.feature.statement, () => {
        for(let i=0; i < featureObj.feature.rules.length; i++){
            const rule = featureObj.feature.rules[i];
            console.log("Running rule", rule.statement);
            window.Cypress.Promise.each([
                _E.beforeRule,
                runScenarios,
                _E.afterRule,
            ], (fn) => {
                fn(rule);
            })
        }
    });
    _E.afterFeature(featureObj, fileName, stats);

}