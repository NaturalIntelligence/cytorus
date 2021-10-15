/**
 * 
 * @param {array} features 
 * @param {function} cb 
 */
function forEachFeature(features, cb){
    for(let f_i=0; f_i < features.length; f_i++){
        const feature = features[f_i];
        cb(feature);
    }
}
function forEachRule(feature, cb){
    for(let i=0; i < feature.rules.length; i++){
        const rule = feature.rules[i];
        cb(rule);
    }
}

function forEachScenarioIn(rule, cb){
    for(let i=0; i < rule.scenarios.length; i++){
        const scenario = rule.scenarios[i];
        if(scenario.examples){
            for(let expanded_i=0; expanded_i < scenario.expanded.length; expanded_i++){
                cb(scenario.expanded[expanded_i], i+1, expanded_i+1);
            }
        }else{
            cb(scenario, i+1, 0);
        }
    }
}

function forEachScenario(features, cb){
    forEachFeature(features, feature => {
        forEachRule( feature, rule => {
            forEachScenarioIn( rule , cb);
        })
    });
}

module.exports = {
    
    
    forEachFeature: forEachFeature,
    forEachRule: forEachRule,
    forEachScenarioIn: forEachScenarioIn,
    forEachScenario: forEachScenario
}