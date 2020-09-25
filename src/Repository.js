//In Browser
const { processDataTable, processDocString } = require("./ArgInsProcessor");
const {
    CucumberExpression,
    RegularExpression,
    ParameterTypeRegistry
  } = require("cucumber-expressions");

const regexSteps = [];
const cucumberExpParamsRegistry= new ParameterTypeRegistry();

function register(step_exp, fn){
    let stepExpRegex;
    if (step_exp instanceof RegExp) {
        stepExpRegex = new RegularExpression( step_exp, cucumberExpParamsRegistry);
    } else {
        stepExpRegex = new CucumberExpression(step_exp, cucumberExpParamsRegistry);
    }
    
    regexSteps.push({
        fn: fn,
        statement: stepExpRegex
    });
}

//TODO: check if the performance can be increased by cache
function findStep(step){
    let fnDetail;
    for (let i=0; i < regexSteps.length; i++) {
        const stepDef = regexSteps[i];
        const match = stepDef.statement.match(step.statement);
        if(match){
            
            fnDetail = {
                fn: stepDef.fn,
                exp: step.statement
            }

            const matchingArgs = match.map( arg => arg.getValue());
            if(step.arg){//doc string or data table
                processArgument(step);
                matchingArgs.push(step.arg.content);
            }
            fnDetail.arg = matchingArgs;    
        }
    }
    return fnDetail;
}

function processArgument(step){
    try{
        step.arg.raw = step.arg.content;
        if(step.arg.type === "DataTable"){
            step.arg.content = processDataTable(step.arg.instruction, step.arg.content);
        }else{
            step.arg.content = processDocString(step.arg.instruction, step.arg.content);
        }
    }catch(err){
        console.log("🤦 Error in processing instruction for step: \n'''" + step.statement + "''' at line number" + step.lineNumber + " \n");
        throw err;
    }
}

function forEachFeature(features, cb){
    for(let f_i=0; f_i < features.length; f_i++){
        const feature = features[f_i];
        cb(feature);
    }
}
function forEachRule(feature, cb){
    for(let i=0; i < feature.rules.length; i++){
        const rule = feature.rules[i];
        cb(rule);
    }
}

function forEachScenarioIn(rule, cb){
    for(let i=0; i < rule.scenarios.length; i++){
        const scenario = rule.scenarios[i];
        if(scenario.examples){
            for(let expanded_i=0; expanded_i < scenario.expanded.length; expanded_i++){
                cb(scenario.expanded[expanded_i], i+1, expanded_i+1);
            }
        }else{
            cb(scenario, i+1, 0);
        }
    }
}

function forEachScenario(featureObj, cb){
    forEachFeature(featureObj, rule => {
        forEachScenarioIn( rule , cb)
    });
}

module.exports = {
    findStepDef: findStep,
    register: register,
    forEachFeature: forEachFeature,
    forEachRule: forEachRule,
    forEachScenarioIn: forEachScenarioIn,
    forEachScenario: forEachScenario
}