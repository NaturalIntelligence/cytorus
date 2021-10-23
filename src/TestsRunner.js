//This code will run in browser
const {find} = require("./Registry");
const { saveResult } = require("./Report");
const { cliLog } = require("./../Tasks");
const { features: featuresPath } = require("./../paths");
const path = require("path");
const toNumber = require("strnum");

let currentTest = {};
let currentStep = {};
let urlChangedCount = 0;
module.exports = function ( features, routeCount ){

    for(let f_i=0; f_i < features.length; f_i++){
        const feature = features[f_i];
        let scenarioCount = {
            count: 0
        };

        describe("Feature: " + feature.statement, () => {
            for(let r_i=0; r_i < feature.rules.length; r_i++){
                const rule = feature.rules[r_i];
                for(let s_i=0; s_i < rule.scenarios.length; s_i++){
                    const scenario = rule.scenarios[s_i];
                    if(scenario.examples !== undefined){
                        for(let expanded_i=0; expanded_i < scenario.expanded.length; expanded_i++){
                            runScenario(scenario.expanded[expanded_i], scenarioCount, routeCount);
                        }
                    }else{
                        runScenario(scenario, scenarioCount, routeCount);
                    }
                }
            }

            // afterEach(() => {
            //     if(scenarioCount.count === feature.stats.total) saveResult(feature); 
            // });
            //after( ()=> {
                //cy.then( () => {saveResult(feature) }); 
                //return cy.wrap( saveResult(feature) ); 
                //return cy.log("after feature").then( ()=> {saveResult(feature) } ); 
            //});
            if(!window.isCyDashboard){
                it("Updating test results", function(){
                    cy.then( () => {
                        saveResult(feature)
                    }).then( () => {
                        this.skip();
                    });
                })
            }
        } );//describe ends
    }
}

function runScenario(scenario, scenarioCount, routeCount){
    const testStatement = scenario.keyword + ": "+ scenario.statement;

    if(scenario.skip){
        scenarioCount.count++;
        scenario.status = "skipped";
        xit( testStatement, function() {
            //this.skip();
        }); 
    }else{
        it(testStatement, insToObj(scenario.instruction), function(){
            let lastStep;
            urlChangedCount = 0;
            scenarioCount.count++;
            currentTest = scenario;
            scenario.status = "pending";
            window.SC = {};
            
            //return cy.then( () => {
            return cy.then( () => {
                //Execute all the step definitions for this scenario
                //const stepsPromises = Array(scenario.steps.length);
                for (let s_i = 0; s_i < scenario.steps.length; s_i++) {
                    const step = scenario.steps[s_i];
                    //unset properties before retry
                    if(step.status){
                        delete step.screenshot;
                        delete step.error_message;
                    }

                    step.status = "pending";
                    // currentStep = step;
                    let startTime;
                    let skipViaRoute = false;
                    //stepsPromises[s_i] = cy.then( () => {
                    cy.then( () => {
                        //This block doesn't get called for all the steps after failure step
                        currentStep = step;
                        startTime = Date.now();
                        //console.log(`urlChangeCount: ${s_i}, ${urlChangedCount}`);
                        if( routeCount === undefined || routeCount === 0 || routeCount >= urlChangedCount){
                            runStep(step, s_i+1);
                        }else if(!skipViaRoute){
                            scenario.status = lastStep.status;
                            skipViaRoute = true;
                            step.status = "skipped"; //to skip from reporting
                        }else{
                            step.status = "skipped"; //to skip from reporting
                        }
                        //this line will not be called in case of error
                    }).then( () => {
                        //This code is not called in case of undefined, failure, error
                        const endTime = Date.now();

                        if(!skipViaRoute){
                            if(step.status !== "undefined"){
                                step.duration = endTime - startTime;
                                if(step.status === "pending") step.status = "passed";
                            }
                            scenario.status = step.status; //failed, passed, undefined
                            lastStep = step;
                        }
                        scenario.status = step.status;
                        //return scenario.status;
                    });
                   
                }//for loop
                //return Cypress.Promise.each(stepsPromises, stepPromise => {});
            });
        });
    }
}


function runStep(step, position){
    const fnDetail = find(step);
                    
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
            //Silently mark the test failed and skip remaining steps
            //As sorry-cypress is not able to handle this case
        }
    }
}

function logMe(){
    console.log.apply(this, arguments);
    
}

/**
 * @param {string} insStr 
 */
function insToObj(insStr){
    const obj = {};
    if(insStr){
        const allInstructions = insStr.split(";");
        allInstructions.forEach(instruction => {
            const entity = instruction.split(":");
            retriesConfig(entity, obj);
        });
    }
    return obj;
}

function retriesConfig(entity, obj){
    if(entity[0].trim() === "retries"){
        obj.retries = {
            runMode: toNumber(entity[1]),
            openMode: 1,
        }
    }
}
//this will catch cypress error like when an element is not found or page takes time to load
const failureReporter = err => {
    if( currentStep.status !== "undefined") {
        currentStep.status = "failed";
        currentTest.status = "failed";
    }
    
    if(err.sourceMappedStack ){
        currentStep.error_message = JSON.stringify(err.sourceMappedStack);
    }else{
        currentStep.error_message = err.message;
    }

    //currentStep.rawErr = err;
    
    // returning false here prevents Cypress from failing the test
    throw err;
};

Cypress.on("fail", failureReporter);
// Cypress.on('after:screenshot', (details) => {
//     //this doesn't work in case of failure
//     currentStep.screenshot = details.path;
//  })
  
Cypress.Screenshot.defaults({
    onAfterScreenshot($el, props) {
        currentStep.screenshot = props.path;
    },
})
  


/**
 * Display text in console when user clicks on the step in left panel
 * @param {object} step 
 * @param {function} fnDetail 
 * @param {string} statement 
 */
function decorateDisplay(step,fnDetail, statement){
    const consoleLog = {
        statement: step.statement,
    }
    if(fnDetail){
        consoleLog.Expression = fnDetail.exp;
        consoleLog.LineNumber= step.lineNumber;
        consoleLog.Registered_Expression = fnDetail.registered_exp;
        consoleLog.Arguments = JSON.stringify(fnDetail.arg);
    }

    Cypress.log({
        name: "step",
        displayName: "👣 " + step.keyword.toUpperCase(),
        message: statement, //markdown
        consoleProps: () => consoleLog
      });

  };

  Cypress.on('url:changed', (newUrl) => {
    urlChangedCount++;
    //cy.log("URL changed to", newUrl);
  })
