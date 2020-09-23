///@ts-check
const fs = require('fs');
const bestFit = require('./best-fit');
const { PATHS: _P, FNs: _F } = require("./../../Constants");

/**
 * Analyze if user is willing to run tests in parallel and there are sufficient tests to run in parallel
 * It also saves parsed spec files to cache
 * @param {object} config 
 * @param {object} features 
 */
function distribute(config, features){
    console.log("Analyzing if tests can run in parallel");
    let cachedFeatureFileNames = [];
    if(process.argv[2] !== "open" && config.dist && config.dist.limit > 1 && features.length > 1){
      //Group features based on number of scenarios
      const bins = bestFit(features,config.dist.limit);
      
      //save it in multiple files
      console.log("I feel " + bins.length + " processes are fine to run in parallel");
      cachedFeatureFileNames = Array(bins.length);
      for (let i = 0; i < bins.length; i++) {
        const featureIndexes = bins[i].indexes;
        const group = Array(featureIndexes.length);
        for (let f_i = 0; f_i < featureIndexes.length; f_i++) {
          group[f_i] = features[featureIndexes[f_i]];
        }
        cachedFeatureFileNames[i] = createInputFile(group, i);
      }
    }else{
      cachedFeatureFileNames = [ createInputFile(features, 0)];
    }
    return cachedFeatureFileNames;
  }
  
  function createInputFile(data, i){
    
    fs.writeFile( _F.CACHED_JSON_FILE(i), JSON.stringify(data), err => {
      if(err){
        console.log("Not able to write processings files in .cytorus folder on the root of the project");
        throw err;
      }
    });
    const fileName = _F.CACHED_FEATURE_FILE(i);
  
    fs.writeFile(fileName, "" , err => {
      if(err){
        console.log("Not able to write processings files in .cytorus folder on the root of the project");
        throw err;
      }
    });
  
    return fileName;
  }

  module.exports = distribute;