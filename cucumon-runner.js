#!/usr/bin/env node

if(process.argv.indexOf("-h") !== -1 || process.argv.indexOf("--help") !== -1){
  console.log(require('./src/cliHelper/helpContent'));
  //process.exit(0);
  process.exitCode = 0;
}else if(process.argv[2] !== "open" && process.argv[2] !== "run"){
  console.log("Invalid action. Either user 'open' or 'run' instead of '"+process.argv[2]+"'");
  process.exitCode = 1;
  //process.exit(1);
}else{
  let child_process = require('child_process');
  const fs = require('fs');
  const path = require('path');
  
  const fromCli = require('./src/cliHelper/CliArgsReader');
  const readProjConfig = require('./src/cliHelper/ProjectConfigReader');
  const parseSpecs = require('./src/cliHelper/SpecsReader');
  const { PATHS: _P, FNs: _F } = require("./Constants");
  const distributeAndSaveSpecs = require('./src/cliHelper/ParallelProcessAnalyzer');
  const evalTestResult = require("./src/cliHelper/TestResultEvaluator");

  setupWorkSpace();
  
  let cachedSpecs = distributeAndSaveSpecs(fromCli, parseSpecs(fromCli));
  fs.writeFile(_P.CLI_ARG_PATH, JSON.stringify({
    interactive: process.argv[2] === 'open',
    processes: cachedSpecs.length,
    cli: true
  }), err => {
    if(err){
      console.log("Error in creating", _P.CLI_ARG_PATH);
      //process.exit(1);
      process.exitCode = 1;
    }
  })
  
  let projConfig = _F.readIfExist( _F.ABS( _P.PROJ_CONFIG_FILENAME ) ,{});
  projConfig = readProjConfig(projConfig);
  projConfig.init();
  
  
  console.log("Preparing processes to run tests");
  let done = 0;
  for (let i = 0; i < cachedSpecs.length; i++){
    let child = child_process.fork( path.join( __dirname, './src/cliHelper/cucumon-runner-child.js') );
    child.send({
      cmd: process.argv[2],
      cypressConfig: Object.assign({}, {
          spec: cachedSpecs[i], 
          //"quiet": true
        } , fromCli.cypress)
    });
    child.on('message', function(message) {
      console.log('[parent] received message from child:', message);
      done++;
      if (done === cachedSpecs.length) {
        console.log('Completed all tests');
        //TODO: Show commulicative result
        //Retry logic
        postRun();
      }
    });
  }
 
  
  function postRun(){
    let testStatus = true;
    const minimalReports = fs.readdirSync( _P.MINIMAL_RESULT_PATH ); 
    const minimalCombinedReport = [];
    for (const file of minimalReports) {
      minimalCombinedReport.push( require( _F.ABS(path.join(_P.MINIMAL_RESULT_PATH , file))) );
    }
  
    if(!evalTestResult(projConfig.success, minimalCombinedReport)){
      testStatus = false;
    }

    fs.unlinkSync(_P.CLI_ARG_PATH);
    projConfig.end();
    if(!testStatus) process.exitCode = 1;
  }

  /**
   * Clean workspace and cache folder
   */
  function setupWorkSpace(){
    fs.rmdirSync( _P.FEATURES_CACHE     , { recursive: true});
    fs.rmdirSync( _P.WD                 , { recursive: true});
    
    fs.mkdirSync( _P.FEATURES_CACHE     , { recursive: true});
    fs.mkdirSync( _P.MINIMAL_RESULT_PATH, { recursive: true});
    fs.mkdirSync( _P.DETAIL_RESULT_PATH , { recursive: true});

  }

}


