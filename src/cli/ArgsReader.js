/**
 * This module helps to build an object from CLI arguments. 
 * Then structure cypress friendly object to run Cypress command. 
 * Then check CPU cores to decide the limit for parallel processing.
 */
const buildCypressOptions = require('./CypressOptionsBuilder');
/**
 * Set optimal count for processes to run parallel based on available CPUs
 * @param {object} config 
 */
function setParallelProcessLimit(config){
  if(config.p){
    const cpuCount = require('os').cpus().length;
    if(!config.dist.limit){
      config.dist.limit = cpuCount > 1 ? cpuCount - 1 : 1;
    }else if(config.dist.limit >= cpuCount){
      config.dist.limit = cpuCount;
    }
  }else{
    config.dist.limit = 1;
  }
}

/**
 * Read CLI arguments
 * @param {array} args 
 * @returns object
 */
function buildConfig(args){
  let config = {
    parser: {},
    p: false, //default
    dist: {}
  };
  let filterConfig = {};
  //const cypressArgs = [args[2]];
  const cypressArgs = [];

  for (let i = 3; i < args.length; i++) {
    const arg = args[i];
    if(arg === "-s" || arg === "--spec"){
      filterConfig.specs = args[++i];
    }else if(arg === "--tags"){
      filterConfig.tags = args[++i];
    }else if(arg === "--only"){
      filterConfig.include = args[++i].split(",").map( n => +n);
    }else if(arg === "--skip"){
      filterConfig.exclude = args[++i].split(",").map( n => +n);
    }else if(arg === "--run-config"){ //combination of tags, specs, include, exclude
      config.runConfig = require( args[++i] );
    }else if(arg === "--parallel"){
      config.p = false;
    }else if(arg === "-p"){
      const val = args[++i];
      if(val === "true"){
        config.p = true;
      }
    }else if(arg === "--tian"){
      const val = args[++i];
      if(val === "true"){
        config.tian = true;
      }
    }else if(arg === "--story"){
      config.story = args[++i];
    }else if(arg === "--from"){
      config.fromRoute = args[++i];
    }else if(arg === "--on"){
      config.onRoute = args[++i];
    }else if(arg === "--till"){
      config.tillRoute = +args[++i];
    }else if(arg === "--via"){
      config.viaRoute = args[++i];
    }else if(arg === "--not-via"){
      config.notViaRoute = args[++i];
    }else if(arg === "--p-limit"){
      config.dist.limit = args[++i];
    }else if(arg === "--build"){
      config.build = args[++i];
    }else if(arg === "--p-strategy"){
      const val = args[++i];
      if(val !== "weight" && val !== "count") throw new Error("Unsupported ditribution strategy");
      else config.dist.strategy = val;
    }else if(arg === "--parsed-data"){
      config.parsedDataPath = args[++i];
    }else if(arg === "--skip-threshold"){
      config.skipThreshold = true;
    }else if(arg === "--cy2"){
      config.cy2 = true;
    }else if(arg === "--docker"){
      config.docker = true;
    }else{
      cypressArgs.push(args[i]);
    }
  }

  if(!config.runConfig){
    config.runConfig = {
      pattern: filterConfig.specs,
      tags: filterConfig.tags,
      include: filterConfig.include,
      exclude: filterConfig.exclude,
    };
  }

  config.cypress = buildCypressOptions(cypressArgs);
  config.cypressArgs = cypressArgs;
  return config
}

const config = buildConfig(process.argv);
setParallelProcessLimit(config);


module.exports = config;
