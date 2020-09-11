//This code will run in browser
const _E = require("./EventObjectBuilder");
const {findStepDef, forEachFeature, forEachRule, forEachScenarioIn} = require("./Repository");
const reportHandler = require("./ReportHandler");

let currentTest = {};

//TODO: update to run for array of features
module.exports = function( featureObj ){
    
    
    _E.beforeAll();
    forEachFeature(featureObj, feature => {
        _E.beforeFeature(feature);
        describe("Feature: " + feature.statement, () => {
            forEachRule(feature, rule => {
                window.Cypress.Promise.each([
                    //_E.beforeRule,
                    runScenarios,
                    //_E.afterRule,
                ], (fn) => {
                    if(!fn){
                        console.log()
                    }
                    fn(rule);
                })
            });
        });
        _E.afterFeature(feature);
    });
    _E.afterAll();
    //TODO: what if the test doesn't run because of some errors. 
    reportHandler.report(featureObj)

}
function runScenarios(rule){
    
    forEachScenarioIn(rule, runScenario);
}
function runScenario(scenario){
    
    if(scenario.skip) {
        //Update pending test count
        xit(scenario.keyword + ": "+ scenario.statement, ()=> {}); 
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
    
    it( scenario.keyword + ": "+ scenario.statement, ()=>{
        currentTest = scenario;
        scenario.status = "pending";
        
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

function runStep(step, position){
    const fnDetail = findStepDef(step);

    if(!fnDetail){
        const formattedStatement = " 🤦 ~~**" + step.statement + "**~~";
        decorateDisplay(step,fnDetail, formattedStatement);
        currentTest.status = "undefined";
        step.duration = 0;
        logMe("%cStep "+ position +"::%c 🤦 %c" + step.statement
            , "background-color: black; color:white"
            , "background-color: inherit;"
            , "color: inherit; text-decoration: line-through;");
        //TODO: suggest the step definition code to implement
        
        throw new Error("Step definition is missing for step: " + step.statement);
    }else{
        decorateDisplay(step,fnDetail, "**"+ step.statement +"**");
        const startTime = Date.now();
        try{
            
            fnDetail.fn.apply(this, fnDetail.arg);
            logMe("%cStep "+ position +"::%c " + step.statement, "background-color: black; color:white", "color: inherit;");
        }catch(err){
            if(currentTest.status !== "undefined") currentTest.status = "failed";
            currentTest.error_message = err;
            
            logMe("%cStep "+ position +"::%c 🐞 %c" + step.statement
                , "background-color: black; color:white"
                , "background-color: inherit;"
                , "color: red;");
            throw err;
        }
        const endTime = Date.now();
        step.duration = endTime - startTime;
        currentTest.status = "passed";
    }
    

}

function logMe(){
    console.log.apply(this, arguments);
    //cy.task('cucumon_log', arguments);
}

const failureReporter = err => {
    _E.error(err);
    throw err;
};
Cypress.on("fail", failureReporter);



function decorateDisplay(step,fnDetail, statement){
    const consoleLog = {
        statement: step.statement,
    }
    if(fnDetail){
        consoleLog.Definition = fnDetail.fn;
        consoleLog.Expression = fnDetail.exp;
        consoleLog.Arguments = JSON.stringify(fnDetail.arg);
    }

    Cypress.log({
        name: "step",
        displayName: step.keyword.toUpperCase(),
        message: statement, //markdown
        consoleProps: () => consoleLog
      });

  };

// Cypress.on('fail', (err, runnable) => {
//     // returning false here prevents Cypress from
//     // failing the test
//     return false
// })

