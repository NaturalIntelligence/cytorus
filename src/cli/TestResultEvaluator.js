/**
 * The whole test suite might be failing. But the test result may be passed depends on what test strategy have been set.
 * Eg tests which can fail in the evening as the stores are closed
 * A strategy can be defined to skip those tests conditionally or not to count their behaiour in the result of whole test suite
 */
const BexpParser = require("bexp");

function evalTestResult(strategies, minimalReport){
    
    for (let i = 0; i < strategies.length; i++) {
        const strategy = strategies[i];
        
        if(strategy.when && strategy.when() === false) continue; //skip this strategy

        if( strategy.pass || strategy.fail){
            const result = testForPositions(minimalReport, strategy);
            if(result === true) continue;
            else return result;
        }else if(strategy.max || strategy.min || strategy.max === 0 || strategy.min === 0 ){
            const count = getCount(minimalReport, strategy);
            
            if(count.success === 0 && count.failure === 0){ 
                //there is no test executed to satisfy current strategy
                continue;
            }
            
            if(typeof strategy.max === 'number'){
                if(count.success > strategy.max) {
                    return { strategy: strategy, message: "the expected maximum successful scenarios "+ strategy.max+" are lesser than " + count.success};
                }
            }else if(typeof strategy.max === 'string'){
                const expectedPercentage = +strategy.max.substr(0,strategy.max.length-1);
                if(expectedPercentage === 100 || expectedPercentage > 100) continue;
                
                const actualPercentage = (count.success*100)/(count.success+count.failure);
                if(actualPercentage > expectedPercentage) {
                    return { strategy: strategy, message: "the expected maximum successful scenarios "+ strategy.max+" are lesser than " + actualPercentage + "%"};
                }
            }else if(typeof strategy.min === 'number'){
                if(count.success < strategy.min) {
                    return { strategy: strategy, message: "the expected minimum successful scenarios "+strategy.min+" are greater than "+ count.success};
                }
            }else{
                let expectedPercentage = 100;
                if(typeof strategy.min === 'string'){
                    expectedPercentage = +strategy.min.substr(0,strategy.min.length-1);
                }
                const total = count.success+count.failure;
                const actualPercentage = (count.success*100)/total;
                if(isNaN(actualPercentage) && expectedPercentage !== 0){
                    return { strategy: strategy, message: "the expected minimum successful scenarios are "+strategy.min+" but found no scenario"};
                }else if(actualPercentage < expectedPercentage) {
                    return { strategy: strategy, message: "the expected minimum successful scenarios "+strategy.min+" are greater than "+ actualPercentage + "%"};
                }
            }
        }else{
            console.log(`Skipping following strategy as no Expectation found`);
            console.log(strategy);
        }
    }
    return true;
}



function testForPositions(minimalReport, strategy){
    for (let f_i = 0; f_i < minimalReport.length; f_i++) {
        const feature = minimalReport[f_i];
        if(!feature.fileName.match(strategy.file)) continue;
        for (let s_i = 0; s_i < feature.scenarios.length; s_i++) {
            const scenario = feature.scenarios[s_i];
            const position = scenario.position.scenario + "." +scenario.position.example;
            if(strategy.pass){
                const matchToPassed = matchPosition(strategy.pass, scenario.position.scenario, scenario.position.example);
                if(matchToPassed && scenario.status !== "passed"){
                    return { strategy: strategy, message: "the scenario "+ position +" was expected to be passed as per following threshold strategy" };
                }
            }
            if(strategy.fail){
                const matchToFailed = matchPosition(strategy.fail, scenario.position.scenario, scenario.position.example);
                if(matchToFailed && scenario.status !== "failed" && scenario.status !== "undefined"){
                    return { strategy: strategy, message: "the scenario "+ position +" was expected to be failed as per following threshold strategy"};
                }
            }
        }
    }
    return true;
}

function matchPosition(arr, s_i, e_i){
    const position = s_i+ (e_i/10);
    return arr.indexOf(s_i) !== -1 || arr.indexOf(position) !== -1;
}

/**
 * Get the count of passed, failing tests for given strategy.
 * 
 * @param {object} minimalReport 
 * @param {object} selector 
 * @returns {object}
 */
function getCount(minimalReport, strategy){
    // Iterate through minimal report and match
    const selector = getSelector(strategy);
    let successCount = 0;
    let failingCount = 0;
    for (let f_i = 0; f_i < minimalReport.length; f_i++) {
        const feature = minimalReport[f_i];
        for (let s_i = 0; s_i < feature.scenarios.length; s_i++) {
            const scenario = feature.scenarios[s_i];
            const match = selector.test(feature, scenario);
            if(match){
                if(scenario.status === "passed"){
                    successCount++;
                }else if(scenario.status === "failed" || scenario.status === "undefined"){
                    failingCount++;
                }
            }
        }
    }
    
    return {
        success: successCount,
        failure: failingCount
    }
}

function getSelector(strategy){
    let selector;
    if(strategy.file){
        selector = new FileSelector(strategy.file);
    }else if(strategy.tagExpression){
        let te = "";
        if(typeof strategy.tagExpression === "string"){
            te = strategy.tagExpression;
        // }else if(typeof strategy.tagExpression === "function"){
        //     te = strategy.tagExpression();
        }else{
            throw new Error("Invalid tag expression type for "+ strategy.tagExpression);
        }
        selector = new TagExpSelector(te);
    }else{
        selector = new TagExpSelector("");
    }
    return selector;
}
class TagExpSelector{
    constructor(tagExpression){
        this.tagExpResolver = new BexpParser(tagExpression, {allowMathOperators:false});
    }

    test(feature, scenario){
        return this.tagExpResolver.test(feature.tags.concat(scenario.tags));
    }
}

class FileSelector{
    constructor(fileName){
        //TODO: use glob module to accept file exp
        //this.fileNames = glob.sync( fileName));
        this.fileName = fileName;
    }

    test(feature, scenario){
        //TODO: loop on this.fileNames
        return feature.fileName.match(this.fileName);
    }
}

module.exports = evalTestResult;