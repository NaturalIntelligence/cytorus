
const storyInsRegex = new RegExp("story:\\s*([^\\s]*)");
const routeInsRegex= new RegExp("route\\s*:\\s*([^\\(]*)(?:\\((.*)\\))?");

// story: {
//     "story-number" : {
//         "feature.fileName" : [0,1,3]
//     }
// }
// route: {
//     "route name" : {
//         "feature.fileName" : {
//             "0" : [3,5]
//         }
//     }
// }
const indexes = {
    story: {},
    route: {}
}
/**
 * Create index data based on the instructions
 * @param {obj} feature 
 * @returns {array} instructions indexes
 */
function index(features){
    for(let f_i=0; f_i < features.length; f_i++){
        const feature = features[f_i];
        feature.only = [];
        let s_gi = 0;
        for(let r_i=0; r_i < feature.rules.length; r_i++){
            const rule = feature.rules[r_i];
            for(let s_i=0; s_i < rule.scenarios.length; s_i++,s_gi++){
                const scenario = rule.scenarios[s_i];
                if(scenario.tags.indexOf("@only")) feature.only.push(s_gi);
                for (let i = 0; i < scenario.steps.length; i++) {
                    const step = scenario.steps[i];
                    if(step.instruction){
                        processInstruction(step.instruction, feature,  s_gi, i);
                    }
                }//steps loop
            }//scenarios loop
        }//rules loop
    }//features loop
    return indexes;
}

function processInstruction(instruction, feature, scenarioIndex, stepIndex) {
    const instructions = instruction.split(";");

    instructions.forEach(instruction => {
        let match = storyInsRegex.exec(instruction);
        if(match){
            const stroyNum = match[1];
            if(!indexes.story[stroyNum]) indexes.story[stroyNum] = {};
            if(!indexes.story[stroyNum][feature.fileName]) indexes.story[stroyNum][feature.fileName] = [];

            indexes.story[stroyNum][feature.fileName].push(scenarioIndex);
        }else{
            match = routeInsRegex.exec(instruction);
            if(match){
                const routeName = match[1].trim();
                const parameters = match[2] || "";
                if(!indexes.route[routeName]) {
                    indexes.route[routeName] = {
                        [feature.fileName]: {}
                    };
                }
                const index = indexes.route[routeName][feature.fileName];
                if(!index[scenarioIndex]){
                    index[scenarioIndex] = {
                        stepIndex: stepIndex,
                        parameters: parameters.split(",").map(p => p.trim())
                    };
                }
            }
        }
    });
}

module.exports = index;
