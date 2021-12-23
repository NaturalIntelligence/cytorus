const { forEachFeature, forEachScenarioIn, forEachRule} = require("./Iterators");


/**
 * Exclude disabled scenarios or the scenarios set not to run
 * @param {object} features Parsed feature file object 
 * @param {object} runConfig Specify the strategy to exclude tests
 */
function filter(features, runConfig = {}){
    filterForPriorityTags(features);
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