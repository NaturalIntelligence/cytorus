const BexpParser = require("bexp");

function getRunConfig(){
    const config = {}
    config.tags = Cypress.env("tags");
    config.include = Cypress.env("include");
    config.exclude = Cypress.env("exclude");
  
    return config;
}

function filter(featureObj){
    
    const runConfig = getRunConfig();

    if(runConfig.tags){
        featureObj = filterByTagExpression(featureObj, runConfig.tags);
    }else if(runConfig.include){
        featureObj = filterByPosition(featureObj, runConfig.include, true);
    }else if(runConfig.exclude){
        featureObj = filterByPosition(featureObj, runConfig.exclude, false);
    }else{
        featureObj = filterForPriorityTags(featureObj);
    }
    return featureObj;
}
function filterByPosition(featureObj, arr, include){
    let positionCounter = 1;
    for(let rules_i=0; rules_i < featureObj.feature.rules.length; rules_i++){
        const rule = featureObj.feature.rules[rules_i];
        for(let scenario_i=0; scenario_i < rule.scenarios.length; scenario_i++){
            const scenario = rule.scenarios[scenario_i];
            if(include){
                if(arr.indexOf(positionCounter) === -1) scenario.skip= true;
            }else{
                if(arr.indexOf(positionCounter) !== -1) scenario.skip= true;
            }
            positionCounter++;
        }
    }
    return featureObj;
}

function filterByTagExpression(featureObj, tagExpression){
    
    const tagExpResolver = new BexpParser("("+tagExpression+") but not @skip");

    for(let rules_i=0; rules_i < featureObj.feature.rules.length; rules_i++){
        const rule = featureObj.feature.rules[rules_i];
        for(let scenario_i=0; scenario_i < rule.scenarios.length; scenario_i++){
            const scenario = rule.scenarios[scenario_i];
            const shouldRun = tagExpResolver.test(featureObj.feature.tags.concat(scenario.tags));
            //Cypress.log("" + featureObj.feature.tags.concat(scenario.tags));
            if(!shouldRun){
                scenario.skip= true;
            }
        }
    }
    
    return featureObj;
}

/**
 * Filter either all scenarios & exclude `@skip` tagged scenarios, or scenarios with `@only`
 * @param {object} featureObj 
 */
function filterForPriorityTags(featureObj){
    let hasOnlyTag = false;
    for(let rules_i=0; hasOnlyTag !== true && rules_i < featureObj.feature.rules.length; rules_i++){
        const rule = featureObj.feature.rules[rules_i];
        for(let scenario_i=0; scenario_i < rule.scenarios.length; scenario_i++){
            const scenario = rule.scenarios[scenario_i];
            const tags = featureObj.feature.tags.concat(scenario.tags);
            if(tags.indexOf("@skip") !== -1){
                scenario.skip = true;
            }else if(tags.indexOf("@only") !== -1){
                hasOnlyTag = true;
            }
        }
    } 

    if(hasOnlyTag){
        for(let rules_i=0; rules_i < featureObj.feature.rules.length; rules_i++){
            const rule = featureObj.feature.rules[rules_i];
            for(let scenario_i=0; scenario_i < rule.scenarios.length; scenario_i++){
                const scenario = rule.scenarios[scenario_i];
                const tags = featureObj.feature.tags.concat(scenario.tags);
                if(tags.indexOf("@only") === -1){
                    scenario.skip = true;
                }
            }
        }   
    }
    return featureObj;
}

module.exports = filter;