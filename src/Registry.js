//TODO: Use own logic to parse cucumber expressions
const {
    CucumberExpression,
    RegularExpression,
    ParameterType,
    ParameterTypeRegistry
  } = require("cucumber-expressions");
const { processDataTable, processDocString } = require("./ArgInsProcessor");

const registry = [];
const registryForStaticSteps = {};
const cucumberExpParamsRegistry= new ParameterTypeRegistry();

/**
 * Register a step definition when code loads
 * @param {string|Regex} step_exp 
 * @param {function} fn 
 */
function register(step_exp, fn){
    let stepExpRegex;
    if (step_exp instanceof RegExp) {
        stepExpRegex = new RegularExpression( step_exp, cucumberExpParamsRegistry);
    } else {//TODO: check for type
        //TODO: save string exp into separate array to speed up discovery
        stepExpRegex = new CucumberExpression(step_exp, cucumberExpParamsRegistry);
        if(stepExpRegex.regexp.toString() === `/^${step_exp}$/`){
            registryForStaticSteps[step_exp] = fn;
            return;
        }
    }
    registry.push({
        fn: fn,
        statement: stepExpRegex
    });
}

/**
 * Find step definition into the registry.
 * @param {object} step parsed feature file step
 */
function find(step){
    //TODO: improve performance as number of search for each step is equal to number of step definitions
    const stepFound = registryForStaticSteps[step.statement];
    if( stepFound){
        const fnDetail = {
            fn: stepFound,
            exp: step.statement,
            registered_exp: step.statement
        }
        if(step.arg) {
            processArgument(step);
            if(step.arg.type === "Other"){
                fnDetail.arg = step.arg.content;
            }else{
                fnDetail.arg = [step.arg.content];
            }
        }
        return fnDetail;
    }
    let fnDetail;
    for (let i=0; i < registry.length; i++) {
        const stepDef = registry[i];
        const match = stepDef.statement.match(step.statement);
        if(match){
            
            fnDetail = {
                fn: stepDef.fn,
                exp: step.statement,
                registered_exp: stepDef.statement
            }

            const matchingArgs = match.map( arg => arg.getValue());
            if(step.arg){//doc string or data table
                processArgument(step);
                matchingArgs.push(step.arg.content);
            }
            fnDetail.arg = matchingArgs;
            break;
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

const defineParameterType = ({
    name,
    regexp,
    transformer,
    useForSnippets,
    preferForRegexpMatch
}) => {
    if(typeof useForSnippets !== Boolean) useForSnippets = true;
    if(typeof preferForRegexpMatch !== Boolean) preferForRegexpMatch = false;
    const parameterType = new ParameterType(
        name,
        regexp,
        null,
        transformer,
        useForSnippets,
        preferForRegexpMatch,
    )
    cucumberExpParamsRegistry.defineParameterType(parameterType);
}

module.exports = {
    register: register,
    find : find,
    defineParameterType
}
