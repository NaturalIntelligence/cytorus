const BexpParser = require("bexp");
const { forEachFeature, forEachScenarioIn, forEachRule} = require("../Iterators");

/**
 * Skip tests as per given tag expression
 * @param {object} featureObj 
 * @param {string} tagExpression 
 */
 function filter(features, tagExpression){
    const tagExpResolver = new BexpParser("("+tagExpression+") but not @skip");
    const filteredFeatures = [];
    for(let f_i=0; f_i < features.length; f_i++){
        const feature = features[f_i];
        const filteredRules = [];

        for(let r_i=0; r_i < feature.rules.length; r_i++){
            const rule = feature.rules[r_i];
            const filteredScenarios = [];

            for(let s_i=0; s_i < rule.scenarios.length; s_i++){
                const scenario = rule.scenarios[s_i];
                const shouldRun = tagExpResolver.test(feature.tags.concat(scenario.tags));
                if(shouldRun){
                    filteredScenarios.push(scenario);
                }else{
                    continue;
                }
            }
            if(filteredScenarios.length > 0){
                rule.scenarios = filteredScenarios;
                filteredRules.push(rule);
            }
        }//loop rules
        if(filteredRules.length > 0){
            filteredFeatures.push(feature);
            filteredFeatures.rules = filteredRules;
        }
    }
    return filteredFeatures;
}

module.exports = filter;
