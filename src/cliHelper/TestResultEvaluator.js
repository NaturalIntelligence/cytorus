const BexpParser = require("bexp");

function evalTestResult(strategies, minimalReport){
    
    for (let i = 0; i < strategies.length; i++) {
        const strategy = strategies[i];
        if(strategy.when && strategy.when() === false) continue; //skip this strategy

        if( strategy.pass || strategy.fail){
            if(testForPositions(minimalReport, strategy)) continue;
            else return false;
        }else{
            const selector = getSelector(strategy);
            const count = getCount(minimalReport, selector);
            if(typeof strategy.max === 'number'){
                if(count.success > strategy.max) {
                    return fail(count, strategy, "the expected maximum successful scenarios "+ strategy.max+" are lesser than " + count.success);
                }
            }else if(typeof strategy.max === 'string'){
                const expectedPercentage = +strategy.max.substr(0,strategy.max.length-1);
                if(expectedPercentage === 100 || expectedPercentage > 100) continue;
                
                const actualPercentage = (count.success*100)/(count.success+count.failure);
                if(actualPercentage > expectedPercentage) {
                    return fail(count, strategy, "the expected maximum successful scenarios "+ strategy.max+" are lesser than " + actualPercentage + "%");
                }
            }else if(typeof strategy.min === 'number'){
                if(count.success < strategy.min) {
                    return fail(count, strategy, "the expected minimum successful scenarios "+strategy.min+" are greater than "+ count.success);
                }
            }else{
                let expectedPercentage = 100;
                if(typeof strategy.min === 'string'){
                    expectedPercentage = +strategy.min.substr(0,strategy.min.length-1);
                }
                const total = count.success+count.failure;
                const actualPercentage = (count.success*100)/total;
                if(isNaN(actualPercentage) && expectedPercentage !== 0){
                    return fail(count, strategy, "the expected minimum successful scenarios are "+strategy.min+" but found no scenario");
                }else if(actualPercentage < expectedPercentage) {
                    return fail(count, strategy, "the expected minimum successful scenarios "+strategy.min+" are greater than "+ actualPercentage + "%");
                }
            }
        }
    }
    return true;
}

function fail(count, strategy, message){
    if(count){
        console.log("Number of matching passing scenarios are", count.success, "out of", count.success+ count.failure);
    }
    console.log("❌ Failing Test for following strategy", strategy);
    console.log("Because", message);
    return false;
}

function getSelector(strategy){
    let selector;
    if(strategy.file){
        selector = new FileSelector(strategy.file);
    }else if(strategy.tagExpression){
        let te = "";
        if(typeof strategy.tagExpression === "string"){
            te = strategy.tagExpression;
        }else if(typeof strategy.tagExpression === "function"){
            te = strategy.tagExpression();
        }else{
            throw new Error("Invalid tag expression type for "+ strategy.tagExpression);
        }
        selector = new TagExpSelector(te);
    }else{
        selector = new TagExpSelector("");
    }
    return selector;
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
                    return fail(null, strategy, "the scenario "+ position +" was expected to be passed");
                }
            }
            if(strategy.fail){
                const matchToFailed = matchPosition(strategy.fail, scenario.position.scenario, scenario.position.example);
                if(matchToFailed && scenario.status !== "failed" && scenario.status !== "undefined"){
                    return fail(null, strategy, "the scenario "+ position +" was expected to be failed");
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

function getCount(minimalReport, selector){
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

class TagExpSelector{
    constructor(tagExpression){
        this.tagExpResolver = new BexpParser(tagExpression);
    }

    test(feature, scenario){
        return this.tagExpResolver.test(feature.tags.concat(scenario.tags));
    }
}

class FileSelector{
    constructor(fileName){
        this.fileName = fileName;
    }

    test(feature, scenario){
        return feature.fileName.match(this.fileName);
    }
}

module.exports = evalTestResult;