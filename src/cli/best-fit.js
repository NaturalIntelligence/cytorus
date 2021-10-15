
function flat(features, groups, scenarios){
    for(let f_i=0; f_i < features.length; f_i++){
        const feature = features[f_i];
        const id = "f"+f_i;
        const scenarioCount = feature.stats.total - feature.stats.skipped;
        scenarios[id] = scenarioCount;
        //if(scenarioCount === 0) continue;

        groups.push({
            id: f_i,
            fileName: feature.fileName,
            features: [f_i],
            scenarios: scenarioCount,
        });
    }
}

function compare(f1,f2){
    if(f1.scenarios > f2.scenarios) return 1;
    else if(f1.scenarios < f2.scenarios) return -1;
    return 0;
}

function bestFit(features, binCount, threshold){
    threshold = threshold || 5;
    const groups = [];
    const scenarios = {};
    flat(features, groups, scenarios);
    groups.sort(compare);
    const totalScenarios = sum(groups);
    console.log("Total scenarios to run: ", totalScenarios);

    let avg = Math.ceil(totalScenarios / binCount);
    if(totalScenarios < threshold){
        const featureGroups = [{
            indexes: [],
            scenarios: 0
        }];
        for (let i = 0; i < groups.length; i++) {
            featureGroups[0].indexes.push(i);
            featureGroups[0].scenarios += groups[i].scenarios
        }
        return featureGroups;
    }else if(avg <= binCount){
        avg = threshold;
        binCount = Math.floor(totalScenarios/avg);
    }else if(groups.length < binCount){
        const featureGroups = [];
        for (let i = 0; i < groups.length; i++) {
            featureGroups.push({
                indexes: groups[i].features,
                scenarios: groups[i].scenarios
            });
        }
        return featureGroups;
    }

    const bin_boundary = groups.length - binCount - 1;
    const featureGroups = [];
    for (let i = bin_boundary + 1; i < groups.length; i++) {
        featureGroups.push({
            indexes: groups[i].features,
            scenarios: groups[i].scenarios
        });
    }
    for(let i=bin_boundary; i> -1; i--){
        let fitToABin = false;
        for(let bin_i=featureGroups.length - 1; bin_i > -1; bin_i--){
            const newCount = featureGroups[bin_i].scenarios + groups[i].scenarios;
            if( newCount <= avg ) {
                fitToABin = true;
                featureGroups[bin_i].scenarios = newCount;
                featureGroups[bin_i].indexes.push(groups[i].id);
                break;
            }
        }
        if(!fitToABin){
            const bin = findBinWithLessScenarios(featureGroups)
            bin.indexes.push(groups[i].id);
            bin.scenarios += groups[i].scenarios;
        }
    }
    if(totalScenarios !== sum(featureGroups)){
        console.warn("Unable to distribute scenarios in "+ binCount+ " processes.");
    }
    return featureGroups;
}

function findBinWithLessScenarios(featureGroups, featureToFit){
    let lowest = Number.POSITIVE_INFINITY;
    let selectedFeature;
    for (let i=featureGroups.length-1; i> -1; i--) {
        if (featureGroups[i].scenarios < lowest) {
            selectedFeature = featureGroups[i];
            lowest = featureGroups[i].scenarios;
        }
    }
    return selectedFeature;
}
function sum(groups){
    let s = groups[0].scenarios;
    for(let i=1; i< groups.length; i++) s+= groups[i].scenarios;
    return s;
}

module.exports = bestFit;