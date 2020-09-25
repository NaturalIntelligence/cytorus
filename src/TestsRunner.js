//This code will run in browser
const _E = require("./EventObjectBuilder");
const {FNs: _F} = require("./../Constants");
const {findStepDef, forEachFeature, forEachRule, forEachScenarioIn} = require("./Repository");

let currentTest = {};
let currentStep = {};
module.exports = function( featureArr ){
    describe("Suit", () => {
        it("Before Suit Hook", () => {
            cy.then( () => _E.beforeSuit() );
        })
        forEachFeature(featureArr, feature => {
            describe("Feature: " + feature.statement, () => {
                it("Before Feature Hook", () => {
                    cy.then( () => _E.beforeFeature(feature) );  
                });
                forEachRule(feature, rule => {
                    forEachScenarioIn(rule, scenario => {
                        if(scenario.skip) {
                            //Update pending test count
                            xit(scenario.keyword + ": "+ scenario.statement, ()=> {
                            }); 
                            //it.skip(scenario.statement, ()=> {}); 
                            scenario.status = "skipped";
                        }else{
                            runSteps(scenario, feature);
                        }
                    });
                });
                it("After Feature Hook", () => {
                    cy.then( () => _E.afterFeature(feature))
                })
            });
        });
        it("After Suit Hook", () => {
            cy.then( () => _E.afterSuit() );
        })
    });
}

function runSteps(scenario, feature){
    it( scenario.keyword + ": "+ scenario.statement, ()=>{
        currentTest = scenario;
        scenario.status = "pending";
        
        window.SC = {};
        cy.then(() =>{
            new window.Cypress.Promise(() => {
                logMe("%c"+scenario.keyword+":: %c" + scenario.statement, "color: red; font-size:16px", "color: black; font-size:normal");
                _E.beforeScenario(scenario);
            }).then( 
                window.Cypress.Promise.each( scenario.steps , (step,i) => {
                    let startTime;
                    cy.then(() => {
                        step.status = "pending";
                        
                        startTime = Date.now();
                        currentStep = step;
                        runStep(step, i+1);
                    }).then(() => {
                        if(step.status !== "undefined"){
                            step.duration = Date.now() - startTime;

                            if(step.status === "pending") step.status = "passed";
                            
                            scenario.status = step.status;
                            //_E.afterStep(step)
                        }else{
                            scenario.status = step.status;
                        }
                    });
                })
            );
        }).then( () => {
            _F.debug_cy("After scenario: "+ scenario.statement);
            _E.afterScenario(scenario)
        });
    })
}

function runStep(step, position){
    const fnDetail = findStepDef(step);
                    
    if(!fnDetail){
        const formattedStatement = " 🤦 ~~**" + step.statement + "**~~";
        decorateDisplay(step,fnDetail, formattedStatement);
        step.status = "undefined";
        currentTest.status = "undefined";
        step.duration = 0;
        logMe("%cStep "+ position +"::%c 🤦 %c" + step.statement
            , "background-color: black; color:white"
            , "background-color: inherit;"
            , "color: inherit; text-decoration: line-through;");
        
        throw new Error("Step definition is missing for step: " + step.statement);
    }else{
        decorateDisplay(step,fnDetail, "**"+ step.statement +"**");
        
        try{
            fnDetail.fn.apply(this, fnDetail.arg);
            logMe("%cStep "+ position +"::%c " + step.statement, "background-color: black; color:white", "color: inherit;");
        }catch(err){
            //This section will catch syntax or logical errros in test written by user
            //step.status = "failed";
            //step.duration = 0;
            //step.error_message = err;

            console.error("ERROR:: Step definition implementation issue");
            logMe("%cStep "+ position +"::%c 🐞 %c" + step.statement
                , "background-color: black; color:white"
                , "background-color: inherit;"
                , "color: red;");
            throw err;
        }
    }
}

function logMe(){
    console.log.apply(this, arguments);
    
}

//this will catch cypress error like when an element is not found or page takes time to load
const failureReporter = err => {
    if( currentStep.status !== "undefined") {
        currentStep.status = "failed";
        currentTest.status = "failed";
    }
    
    if(err.sourceMappedStack ){
        currentStep.error_message = err.sourceMappedStack;
    }else{
        currentStep.error_message = err.message;
    }
    
    // returning false here prevents Cypress from failing the test
    throw err;
};

Cypress.on("fail", failureReporter);



function decorateDisplay(step,fnDetail, statement){
    const consoleLog = {
        statement: step.statement,
    }
    if(fnDetail){
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
