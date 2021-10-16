function filter(features, story){
    const filteredFeatures = [];
    if(!story) return [];
    
    for(let f_i=0; f_i < features.length; f_i++){
        const feature = features[f_i];
        if( !story[feature.fileName] ) continue;
        const scenariosWithStory = story[feature.fileName];
        const filteredRules = [];
        let s_gi = 0;
        for(let r_i=0; r_i < feature.rules.length; r_i++){
            const rule = feature.rules[r_i];
            const filteredScenarios = [];
            for(let s_i=0; s_i < rule.scenarios.length; s_i++, s_gi++){
                if(scenariosWithStory.indexOf(s_gi) !== -1){
                    filteredScenarios.push(rule.scenarios[s_i]);
                }
            }
            if(filteredScenarios.length > 0){
                rule.scenarios = filteredScenarios;
                filteredRules.push(rule);
            }
        }
        if(filteredRules.length > 0){
            filteredFeatures.push(feature);
            filteredFeatures.rules = filteredRules;
        }
    }
    return filteredFeatures;
}

module.exports = filter;
