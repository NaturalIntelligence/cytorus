const fs = require('fs');
const path = require('path');

console.log("Processing CLI arguments");

let config = {
  parser: {},
  dist: {}
};
let filterConfig = {};

//Read CLI arguments
  const args = process.argv;
  const cypressArgs = [];
  cypressArgs.push(args[2]);

  for (let i = 3; i < args.length; i++) {
    const arg = args[i];
    if(arg === "-s" || arg === "--spec"){
      filterConfig.specs = args[++i];
    }else if(arg === "--tags"){
      filterConfig.tags = args[++i];
    }else if(arg === "--include"){
      filterConfig.include = args[++i].split(",");
    }else if(arg === "--exclude"){
      filterConfig.exclude = args[++i].split(",");
    }else if(arg === "--specs-config"){
      config.specs = require( args[++i] );
    }else if(arg === "--parallel"){
      config.dist = false;
    }else if(arg === "--dist"){
      const val = args[++i];
      if(val === "false" ){
        config.dist = false;
      }
    }else if(arg === "--dist-limit"){
      config.dist.limit = args[++i];
    }else if(arg === "--dist-strategy"){
      const val = args[++i];
      if(val !== "weight" && val !== "count") throw new Error("Unsupported ditribution strategy");
      else config.dist.strategy = val;
    }else if(arg === "--parsed-data"){
      config.parsedDataPath = args[++i];
    }else{
      cypressArgs.push(args[i]);
    }
  }

  if(!config.specs){
    config.specs = [{
      files: filterConfig.specs,
      tags: filterConfig.tags,
      include: filterConfig.include,
      exclude: filterConfig.exclude,
    }];
  }

setParallelProcessLimit(config);


//End read CLI arguments

/**
 * Set optimal count for processes to run parallel based on available CPUs
 * @param {object} config 
 */
function setParallelProcessLimit(config){
  if(config.dist){
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

module.exports = {
  config: config,
  cypressArgs: cypressArgs
};