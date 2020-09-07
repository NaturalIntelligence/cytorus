const BexpParser = require("bexp");
const { forEachFeature, forEachScenarioIn, forEachRule} = require("./Repository");

function filter(featureObj, runConfig){
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
    forEachFeature(featureObj, feature => {
        forEachRule(feature, rule => {
            forEachScenarioIn( rule , scenario => {
                if(include){
                    if(arr.indexOf(positionCounter) === -1) scenario.skip= true;
                }else{
                    if(arr.indexOf(positionCounter) !== -1) scenario.skip= true; 
                }
                positionCounter++;
            })
        })
    });

    return featureObj;
}

function filterByTagExpression(featureObj, tagExpression){
    
    const tagExpResolver = new BexpParser("("+tagExpression+") but not @skip");

    forEachFeature(featureObj, feature => {
        forEachRule(feature, rule => {
            forEachScenarioIn( rule , scenario => {
                const shouldRun = tagExpResolver.test(feature.tags.concat(scenario.tags));
                if(!shouldRun){
                    scenario.skip
                }
            })
        })
    });
    
    return featureObj;
}

/**
 * Filter either all scenarios & exclude `@skip` tagged scenarios, or scenarios with `@only`
 * @param {object} featureObj 
 */
function filterForPriorityTags(featureObj){
    let hasOnlyTag = false;
    forEachFeature(featureObj, feature => {
        forEachRule(feature, rule => {
            forEachScenarioIn( rule , scenario => {
                const tags = feature.tags.concat(scenario.tags);
                if(tags.indexOf("@skip") !== -1){
                    scenario.skip = true;
                }else if(tags.indexOf("@only") !== -1){
                    hasOnlyTag = true;
                }
            })
        })
    });

    if(hasOnlyTag){
        forEachFeature(featureObj, feature => {
            forEachRule(feature, rule => {
                forEachScenarioIn( rule , scenario => {
                    const tags = feature.tags.concat(scenario.tags);
                    if(tags.indexOf("@only") === -1){
                        scenario.skip = true;
                    }
                })
            })
        });  
    }
    return featureObj;
}

module.exports = filter;