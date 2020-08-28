//In Browser
const { resolveCucumberExp } = require("./CucumberExpressionResolver");

/**
 * list of scenario steps.
 * It is subset of all steps filtered by tag expression, or feature file
 */
let steps = {};
let stepStatements = [];
let stepDefs = [];

function feed(obj){
    indexBySteps(obj);
    stepStatements = Object.keys(steps);
}

/**
 * Create the list of steps where each step, and step object in featureObject are pointing to stepDefs item
 * @param {any} featureObject 
 */
function indexBySteps(featureObject){
    
    forEachRule(featureObj, rule => {
        forEachScenarioIn( rule , scenario => {
            for(let step_i=0; step_i < scenario.steps.length; step_i++){
                const step = scenario.steps[step_i];
                const indexFound = steps[ step.statement ];
                if( typeof indexFound === "undefined"){
                    stepDefs.push({});
                    const index = stepDefs.length - 1;
                    steps[ step.statement ] = index;
                    step.stepDefsIndex = index;
                }else{
                    step.stepDefsIndex = indexFound;
                }
            }
        })
    });
}

function register(step_exp, fn){
    let exp = step_exp;
    if(typeof step_exp === "string"){
        exp = resolveCucumberExp(exp);
        if(resolvedExp === exp){
            const stepDefIndex = steps[exp];
            if(stepDefIndex){
                const fnDetail = stepDefs[stepDefIndex];
                assignStepDefinition(fnDetail, step_exp, fn)
            }
        }
    }
    registerUsingRegx(exp, fn);
}

/**
 * 
 * @param {RegExp} step_exp 
 */
function registerUsingRegx(step_exp, fn){
    for(let i=0; i< stepStatements.length; i++){
        const stepStatement = stepStatements[i];
        const match = step_exp.exec(stepStatement);
        if(match){
            const stepDefIndex = steps[stepStatement];
            const fnDetail = stepDefs[stepDefIndex];
            assignStepDefinition(fnDetail, step_exp, fn);
            
            if(fnDetail.arg){
                fnDetail.arg = match.slice(1).push(fnDetail.arg);
            }else{
                fnDetail.arg = match.slice(1)
            }
        }
    }
}

function assignStepDefinition(fnDetail, step_exp, fn){
    if(fnDetail.fn){
        console.log("Previously matched step definition:" + fnDetail.exp);
        console.log("New matching step definition:" + fnDetail.exp);
        throw new Error("Step is matching to multiple step definitions");
    }else{
        fnDetail.exp = step_exp;
        fnDetail.fn = fn;
    }
}


function forEachRule(featureObj, cb){
    for(let rules_i=0; rules_i < featureObj.feature.rules.length; rules_i++){
        const rule = featureObj.feature.rules[rules_i];
        cb(rule);
    }
}

function forEachScenarioIn(rule, cb){
    for(let scenario_i=0; scenario_i < rule.scenarios.length; scenario_i++){
        const scenario = rule.scenarios[scenario_i];
        if(scenario.examples){
            for(let expanded_i=0; expanded_i < scenario.expanded.length; expanded_i++){
                cb(scenario.expanded[expanded_i]);
            }
        }else{
            cb(scenario);
        }
    }
}

function forEachScenario(featureObj, cb){
    forEachRule(featureObj, rule => {
        forEachScenarioIn( rule , cb)
    });
}

module.exports = {
    feed: feed,
    steps: steps,
    stepDefs:stepDefs,
    register: register,
    forEachRule: forEachRule,
    forEachScenarioIn: forEachScenarioIn,
    forEachScenario: forEachScenario
}