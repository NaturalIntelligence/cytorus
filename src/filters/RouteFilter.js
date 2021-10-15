function filter(features, routeName, route, viaRoute, skipSteps){
    const filteredFeatures = [];
    for(let f_i=0; f_i < features.length; f_i++){
        const feature = features[f_i];
        if( !route[feature.fileName] ) continue; //skip the feature without given route

        const filteredRules = [];
        const markedScenarios = route[feature.fileName];

        for(let r_i=0; r_i < feature.rules.length; r_i++){
            const rule = feature.rules[r_i];
            const filteredScenarios = [];
            for(let s_i=0; s_i < rule.scenarios.length; s_i++){
                const scenario = rule.scenarios[s_i];
                selectQualifiedScenario(markedScenarios, filteredScenarios, scenario, s_i,  viaRoute,  skipSteps, routeName);
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

/**
 * Select qualified Scenario
 * @param {array} markedScenarios 
 * @param {array} filteredScenarios 
 * @param {object} scenario 
 * @param {number} s_i 
 * @param {string} viaRoute 
 * @param {boolean} skipSteps 
 * @param {string} routeName 
 */
function selectQualifiedScenario(markedScenarios, filteredScenarios, scenario, s_i,  viaRoute,  skipSteps, routeName) {
    const markedStep = markedScenarios["" + s_i];
    if (!markedStep && !viaRoute) { //--not-via
        filteredScenarios.push(scenario);
    } else if (markedStep && viaRoute) { //--via. --from, --on
        if (skipSteps) { //--from, --on
            skipStartingSteps(scenario, markedStep, routeName);
        }
        filteredScenarios.push(scenario);
    } else {
        //skip the scenario
    }
}

/**
 * Select steps from marked step till the end step in given scenario
 * Push route step in starting
 * @param {object} scenario 
 * @param {number} from 
 * @param {string} routeName 
 */   
function skipStartingSteps(scenario, markedStep, routeName){
    const step = buildStep(routeName, markedStep);
    if(scenario.examples !== undefined){
        scenario.expanded = [step].concat( scenario.expanded.slice(markedStep.stepIndex) );
    }
    scenario.steps = [step].concat( scenario.steps.slice(markedStep.stepIndex) );
}

function buildStep(routeName, markedStep){
    console.log(markedStep)
    return {
        "keyword": "Given",
        "statement": routeName,
        "lineNumber": markedStep.stepIndex - 1,
        "arg": {
            "type": "Other",
            "content": markedStep.parameters,
          },
      }
}

module.exports = filter;
