
/**
 * Skip tests which should not be included (or should be excluded).
 * Otherwise all the tests should run
 * @param {object} features 
 * @param {array} arr 
 * @param {boolean} include 
 */
 function filter(features, arr, include){
    const filteredFeatures = [];
    for(let f_i=0; f_i < features.length; f_i++){
        const feature = features[f_i];
        const filteredRules = [];
        let s_gi = 0;
        for(let r_i=0; r_i < feature.rules.length; r_i++){
            const rule = feature.rules[r_i];
            const filteredScenarios = [];

            for(let s_i=0; s_i < rule.scenarios.length; s_i++,s_gi++){
                const scenario = rule.scenarios[s_i];
                let doesContains = false;
                if(scenario.examples){
                    for(let e_i=0; e_i < scenario.expanded.length; e_i++){
                        doesContains = contains(arr, s_gi, e_i);
                        if( (include && !doesContains) || (!include && doesContains)){
                            continue;
                        }else{
                            filteredScenarios.push(scenario.expanded[e_i]);
                        }
                    }
                }else{
                    doesContains = contains(arr, s_gi, 0);
                    if( (include && !doesContains) || (!include && doesContains)){
                        continue;
                    }else{
                        filteredScenarios.push(scenario);
                    }
                }
            }
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

/**
 * Check if given scenario position presents in given array.
 * Eg 
 * * 1.2 presents in [ 1.2, 3, 5 ] => returns true
 * * 1.2 presents in [ 1, 3, 5 ] => returns true
 * * 1.1 presents in [ 1.2, 3, 5 ] => returns false
 * @param {array} arr 
 * @param {number} s_i scenario index
 * @param {number} e_i example index
 */
 function contains(arr, s_i, e_i){
    const position = s_i+ (e_i/10);
    return arr.indexOf(s_i) !== -1 || arr.indexOf(position) !== -1;
}

module.exports = filter;
