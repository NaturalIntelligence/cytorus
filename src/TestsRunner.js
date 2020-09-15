//This code will run in browser
const _E = require("./EventObjectBuilder");
const {findStepDef, forEachFeature, forEachRule, forEachScenarioIn} = require("./Repository");

let currentTest = {};
module.exports = function( featureArr ){
    describe("Suit", () => {
        it("Before Suit Hook", () => {
            cy.then(() => {
                _E.beforeSuit()
            });
        })
        forEachFeature(featureArr, feature => {
            describe("Feature: " + feature.statement, () => {
                it("Before Feature Hook", () => {
                    cy.then(() => {
                        _E.beforeFeature(feature);  
                    });
                });
                forEachRule(feature, rule => {
                    forEachScenarioIn(rule, scenario => {
                        if(scenario.skip) {
                            //Update pending test count
                            xit(scenario.keyword + ": "+ scenario.statement, ()=> {
                                //clilog("SKIPPING THIS TEST")
                            }); 
                            //it.skip(scenario.statement, ()=> {}); 
                            scenario.status = "skipped";
                        }else{
                            runSteps(scenario, feature);
                        }
                    });
                });
                it("After Feature Hook", () => {
                   cy.then(() => {
                    _E.afterFeature(feature);
                   });
                })
            });
        });
        it("After Suit Hook", () => {
            cy.then(() => {
                _E.afterSuit()
            });
        })
    });
}

function runSteps(scenario, feature){
    it( scenario.keyword + ": "+ scenario.statement, ()=>{
        currentTest = scenario;
        scenario.status = "pending";
        
        window.SC = {};//reset Scenario Context for every test
        clilog("Running scenario of Feature: " + feature.statement);
        cy
        .then( () => {
            //clilog("Before Scenario: " + scenario.statement);
            _E.beforeScenario(scenario) 
        })
        .then( () => {
            logMe("%c"+scenario.keyword+":: %c" + scenario.statement, "color: red; font-size:16px", "color: black; font-size:normal");
            let lastStep = {
                status: "pending"
            };
            
            for(let i=0; i < scenario.steps.length; i++){
                if(lastStep.status === "failed" || lastStep.status === "undefined") break; //don't execute rest steps;
                const step = scenario.steps[i];
                
                cy
                    .then(() => {
                        //clilog("Before Step: " + step.statement);
                    }).then(() => {
                        runStep(step, i+1);
                        //clilog("Status: " + step.status);
                    })
                    .then(() => {
                        lastStep = step;
                        //clilog("After Status: " + step.status)
                        step.error_message = currentTest.error_message;
                        _E.afterStep(step)
                    });
            }
            
        }).then(() => {
            if(scenario.status === "pending") scenario.status = "passed";
            //clilog("After Scenario: " + scenario.statement);
            _E.afterScenario(scenario)
        });
    })
}

function runStep(step, position){
    const fnDetail = findStepDef(step);
    //clilog("Step: ", step);

    if(!fnDetail){
        //clilog("Step: missing");
        const formattedStatement = " 🤦 ~~**" + step.statement + "**~~";
        decorateDisplay(step,fnDetail, formattedStatement);
        step.status = "undefined";
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
            //clilog("Step: executing");
            fnDetail.fn.apply(this, fnDetail.arg);
            logMe("%cStep "+ position +"::%c " + step.statement, "background-color: black; color:white", "color: inherit;");
        }catch(err){
            if(step.status !== "undefined") {
                //clilog("Step: failed");
                step.status = "failed";
                currentTest.status = "failed";
            }
            step.duration = 0;
            step.error_message = err;
            
            logMe("%cStep "+ position +"::%c 🐞 %c" + step.statement
                , "background-color: black; color:white"
                , "background-color: inherit;"
                , "color: red;");
            throw err;
        }
        const endTime = Date.now();
        step.duration = endTime - startTime;
        step.status = "passed";
        //step.status = "passed";
        //clilog("Step: successful");
    }
    

}

function clilog(message){
    cy.task("clilog", "DEBUG:: " + message);
}

function logMe(){
    console.log.apply(this, arguments);
    
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

