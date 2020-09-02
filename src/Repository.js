//In Browser
const { resolveCucumberExp } = require("./CucumberExpressionResolver");

const strSteps = {};
const regexSteps = [];

function register(step_exp, fn){
    if(typeof step_exp === "string"){
        //const resolvedExp = resolveCucumberExp(step_exp);
        //if(resolvedExp === step_exp){//not a cucumber exp
            strSteps[step_exp] = {
                fn: fn
            }
            //return;
        //}else{
        //    step_exp = new RegExp(resolvedExp);
            //registerRegx(resolvedExp, fn);
        //}
    }else{
        registerRegx(step_exp, fn);
    }
}

function registerRegx(regexStep, fn){
    regexSteps.push({
        fn: fn,
        statement: regexStep
    });
}

const steps_cache = {}

function findStep(step){
    if(!step.arg && steps_cache[step.statement]) {
        //console.debug("Found in cache");
        return steps_cache[step.statement];
    }

    //console.debug("Not found in cache");
    let fnDetail;
    let stepDef = strSteps[step.statement];
    if(stepDef){
        fnDetail = {
            fn: stepDef.fn,
            exp: step.statement
        }
        if(step.arg) {
            fnDetail.arg = [step.arg.content];
        }else{
            steps_cache[step.statement] = fnDetail;
        }
    }else{
        for (let index = 0; index < regexSteps.length; index++) {
            stepDef = regexSteps[index];
            //console.log(stepDef.statement);
            const match = stepDef.statement.exec(step.statement);

            if(match){
                fnDetail = {
                    fn: stepDef.fn,
                    exp: step.statement
                }

                const matchingArgs = match.slice(1);
                if(step.arg){//doc string or data table
                    matchingArgs.push(step.arg.content);
                }
                fnDetail.arg = matchingArgs;    
                if(!fnDetail.arg) steps_cache[step.statement] = fnDetail;
            }
        }

    }
    //console.debug("Step definition detail::",fnDetail);
    return fnDetail;
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
    findStepDef: findStep,
    register: register,
    forEachRule: forEachRule,
    forEachScenarioIn: forEachScenarioIn,
    forEachScenario: forEachScenario
}