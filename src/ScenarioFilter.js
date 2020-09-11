const BexpParser = require("bexp");
const { forEachFeature, forEachScenarioIn, forEachRule} = require("./Repository");

function filter(featureObj, runConfig){
    if(runConfig.tags){
        filterByTagExpression(featureObj, runConfig.tags);
    }else if(runConfig.include){
        filterByPosition(featureObj, runConfig.include, true);
    }else if(runConfig.exclude){
        filterByPosition(featureObj, runConfig.exclude, false);
    }else{
        filterForPriorityTags(featureObj);
    }
}

function filterByPosition(featureObj, arr, include){
    forEachFeature(featureObj, feature => {
        let positionCounter = 1;
        const stats = {
            skipped: 0,
            total: 0
        }
        forEachRule(feature, rule => {
            forEachScenarioIn( rule , scenario => {
                if(include){
                    if(arr.indexOf(positionCounter) === -1) {
                        scenario.skip= true;
                        stats.skipped +=1;
                    }
                }else{
                    if(arr.indexOf(positionCounter) !== -1) {
                        scenario.skip= true; 
                        stats.skipped +=1;
                    }
                }
                positionCounter++;
            })
        })
        stats.total = positionCounter - 1;
        feature.stats = stats;
    });
    
}

function filterByTagExpression(featureObj, tagExpression){
    const tagExpResolver = new BexpParser("("+tagExpression+") but not @skip");

    forEachFeature(featureObj, feature => {
        const stats = {
            skipped: 0,
            total: 0
        }
        forEachRule(feature, rule => {
            forEachScenarioIn( rule , scenario => {
                const shouldRun = tagExpResolver.test(feature.tags.concat(scenario.tags));
                if(!shouldRun){
                    scenario.skip = true;
                    stats.skipped++;
                }
                stats.total++;
            })
        })
        feature.stats = stats;
    });
}

/**
 * Filter either all scenarios & exclude `@skip` tagged scenarios, or scenarios with `@only`
 * @param {object} featureObj 
 */
function filterForPriorityTags(featureObj){
    
    //Skip all the tags which are tagged as @skip
    forEachFeature(featureObj, feature => {
        const stats = {
            skipped: 0,
            total: 0
        }
    
        let hasOnlyTag = false;
        forEachRule(feature, rule => {
            forEachScenarioIn( rule , scenario => {
                stats.total++;
                const tags = feature.tags.concat(scenario.tags);
                if(tags.indexOf("@skip") !== -1){
                    scenario.skip = true;
                    stats.skipped++;
                }else if(tags.indexOf("@only") !== -1){
                    hasOnlyTag = true;
                }
            })
        });
        if(hasOnlyTag){
            stats.skipped = 0;
            forEachRule(feature, rule => {
                forEachScenarioIn( rule , scenario => {
                    const tags = feature.tags.concat(scenario.tags);
                    if(tags.indexOf("@only") === -1){
                        scenario.skip = true;
                        stats.skipped++;
                    }
                })
            })
        }
        feature.stats = stats;
    });
}

module.exports = filter;