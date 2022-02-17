const BexpParser = require("bexp");
const { forEachFeature, forEachScenarioIn, forEachRule} = require("../Iterators");
const { debug } = require("../../Tasks");

/**
 * Skip tests as per given tag expression
 * @param {object} featureObj 
 * @param {string} tagExpression 
 */
 function filter(features, tagExpression){
    const bexp_exp = "("+tagExpression+") but not @skip";
    debug("Tag expression:" + bexp_exp);
    const tagExpResolver = new BexpParser(bexp_exp, {allowMathOperators:false});
    const filteredFeatures = [];
    for(let f_i=0; f_i < features.length; f_i++){
        const feature = features[f_i];
        const filteredRules = [];

        for(let r_i=0; r_i < feature.rules.length; r_i++){
            const rule = feature.rules[r_i];
            const filteredScenarios = [];

            for(let s_i=0; s_i < rule.scenarios.length; s_i++){
                const scenario = rule.scenarios[s_i];
                let shouldRun = false;
                if(scenario.examples){//Scenario Outline
                    for(let e_i=0; e_i < scenario.expanded.length; e_i++){
                        const exp_to_check = feature.tags.concat(scenario.expanded[e_i].tags)
                        const shouldRun = tagExpResolver.test(exp_to_check);
                        if(shouldRun){
                            debug("Including scenario with tags: " + exp_to_check);
                            filteredScenarios.push(scenario.expanded[e_i]);
                        }else{
                            debug("Excluding test with tags: " + exp_to_check);
                            continue;
                        }
                    }
                }else{//Scenario
                    const exp_to_check = feature.tags.concat(scenario.tags);
                    const shouldRun = tagExpResolver.test(exp_to_check);
                    if(shouldRun){
                        debug("Including scenario with tags: " + exp_to_check);
                        filteredScenarios.push(scenario);
                    }else{
                        debug("Excluding test with tags: " + exp_to_check);
                        continue;
                    }
                }
            }//scenario loop end
            if(filteredScenarios.length > 0){
                rule.scenarios = filteredScenarios;
                filteredRules.push(rule);
            }
        }//loop rules
        if(filteredRules.length > 0){
            feature.rules = filteredRules;
            filteredFeatures.push(feature);
        }
    }
    return filteredFeatures;
}

module.exports = filter;
