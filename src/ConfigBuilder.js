///@ts-check
const fs = require('fs');
const path = require('path');

const configFilePath = path.join( process.cwd(), "cucumon-runner-config.js");

let config = {
  specs:[],
  parser: {},
  dist: false
};
if( fs.existsSync(configFilePath)){
  config = Object.assign( config, require(configFilePath));
}

//Read CLI arguments
  const args = process.argv;
  const cypressArgs = [];
  cypressArgs.push(args[2]);

  for (let i = 3; i < args.length; i++) {
    const arg = args[i];
    if(arg === "-s" || arg === "--spec"){
      const val = args[++i];
      config.specs.push({
        files: val
      })
    }else if(arg === "--tag"){
      setSpecFilter("tags",args[++i]);
    }else if(arg === "--include"){
      setSpecFilter("include",args[++i]);
    }else if(arg === "--exclude"){
      setSpecFilter("exclude",args[++i]);
    }else if(arg === "--parallel"){
      config.dist = false;
    }else if(arg === "--dist"){
      const val = args[++i];
      if(val === "true" ){
      }else{
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

function setSpecFilter(key, val){
  if(config.specs.length = 0){
    config.specs.push({
      [key]: val
    })
  }else{
    config.specs[config.specs.length - 1][key] = val;
  }
}
//End read CLI arguments

//setup parser
if (!fs.existsSync(".cucumon")){
  fs.mkdirSync(".cucumon");
}else{
  //clear .cucumon folder
}

const Cucumon = require("cucumon");
const featureFileParser =  new Cucumon({
  clubBgSteps : true,
});
if(config.parser.insProcessor){
  config.parser.insProcessor(featureFileParser);
}

module.exports = {
  config: config,
  cypressArgs: cypressArgs,
  featureFileParser: featureFileParser
};