#!/usr/bin/env node

const isInteractiveMode = process.argv[2] === "open";

if(process.argv.indexOf("-h") !== -1 || process.argv.indexOf("--help") !== -1){
  console.log(require('./src/cliHelper/helpContent'));
  //process.exit(0);
  process.exitCode = 0;
}else if(!isInteractiveMode && process.argv[2] !== "run"){
  console.log("Invalid action. Either user 'open' or 'run' instead of '"+process.argv[2]+"'");
  process.exitCode = 1;
  //process.exit(1);
}else{

  console.log(`
   .d8888b.           888                                      
  d88P  Y88b          888                                      
  888    888          888                                      
  888        888  888 888888 .d88b.  888d888 888  888 .d8888b  
  888        888  888 888   d88""88b 888P"   888  888 88K      
  888    888 888  888 888   888  888 888     888  888 "Y8888b. 
  Y88b  d88P Y88b 888 Y88b. Y88..88P 888     Y88b 888      X88 
   "Y8888P"   "Y88888  "Y888 "Y88P"  888      "Y88888  88888P' 
                  888                                          
             Y8b d88P                                          
              "Y88P"                                           
  `);

  /*console.log(`
    Check cytorus-land for historical comparison, detail analysis, awesome 
    reports, page flow and to integrate your test result with Kanban board, API documents etc.
  `)*/

  console.log(`
  visit: amitkumargupta.work for more awesome opensource projects
  `);

  let child_process = require('child_process');
  const fs = require('fs');
  const path = require('path');
  const fromCli = require('./src/cliHelper/CliArgsReader');
  const readProjConfig = require('./src/cliHelper/ProjectConfigReader');
  const parseSpecs = require('./src/cliHelper/SpecsReader');
  const { PATHS: _P, FNs: _F } = require("./Constants");
  const distributeAndSaveSpecs = require('./src/cliHelper/ParallelProcessAnalyzer');
  const evalTestResult = require("./src/cliHelper/TestResultEvaluator");

  const startTime = Date.now();

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
    }else{
      _F.debug("Tests must start after this line");
    }
  })
  
  let projConfig;
  try{
    console.debug("Loading project configuration file for cytorus");
    projConfig = _F.readIfExist( _F.ABS( _P.PROJ_CONFIG_FILENAME ) ,{});
    projConfig = readProjConfig(projConfig);
    projConfig.init();
  }catch(err){
    console.log("");
    console.error(err);
    process.exit(1);
  }
  
  
  console.log("Preparing processes to run tests");
  let done = 0;
  for (let i = 0; i < cachedSpecs.length; i++){
    let child = child_process.fork( path.join( __dirname, './src/cliHelper/cytorus-child-process.js') );
    child.send({
      cmd: process.argv[2],
      cypressConfig: Object.assign({}, {
          spec: cachedSpecs[i], 
          //"quiet": true
        } , fromCli.cypress)
    });
    child.on('message', async function(message) {
      //console.log('[parent] received message from child:', message);
      _F.debug('[parent] Specs for group ' + i + ' are completed.');
      done++;
      if (done === cachedSpecs.length) {
        _F.debug('[parent] All the Specs are executed');
        //Retry logic
        if(!isInteractiveMode) await postRunProcessing();
      }
    });
  }
 
  
  async function postRunProcessing(){
    const minimalReports = fs.readdirSync( _P.MINIMAL_RESULT_PATH ); 
    const minimalCombinedReport = [];
    for (const file of minimalReports) {
      minimalCombinedReport.push( require( _F.ABS(path.join(_P.MINIMAL_RESULT_PATH , file))) );
    }
  
    await projConfig.end();
    fs.unlinkSync(_P.CLI_ARG_PATH);
    const stats = getCount(minimalCombinedReport);
    if(!projConfig.threshold) projConfig.threshold = [];
    const result = evalTestResult(projConfig.threshold, minimalCombinedReport);
    const testDuration = durationToredableFormat(Date.now() - startTime);
    console.log(`
====================================================================================================
`);
    if(result !== true){
      //console.table(stats);

      const climsg = `
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
    Status    :   ❌ Failed 
    Reason    :   ${result.message}
    Strategy  :   ${JSON.stringify(result.strategy)}
    Stats     :   Passed: ${stats.passed}
                  Failed: ${stats.failed}
                  Missing Steps: ${stats.missing}
                  Skipped: ${stats.skipped}
    Duration  :   ${testDuration}
  └────────────────────────────────────────────────────────────────────────────────────────────────┘

      `;
      console.log(climsg);
      process.exitCode = 1;

    }else{
      const climsg = `
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
    Status    :   ✔️  Passed
    Stats     :   Passed: ${stats.passed}
                  Failed: ${stats.failed}
                  Missing Steps: ${stats.missing}
                  Skipped: ${stats.skipped}                                                         
    Duration  :   ${testDuration}                                                                       
  └────────────────────────────────────────────────────────────────────────────────────────────────┘

      `;
      console.log(climsg);
      process.exitCode = 0;
    }
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


function getCount(minimalReport){
  const count = {
    passed: 0,
    failed: 0,
    missing: 0,
    skipped: 0,
  }
  for (let f_i = 0; f_i < minimalReport.length; f_i++) {
      const feature = minimalReport[f_i];
      for (let s_i = 0; s_i < feature.scenarios.length; s_i++) {
        const scenario = feature.scenarios[s_i];
        if(scenario.status === "passed"){
            count.passed++;
        }else if(scenario.status === "failed"){
          count.failed++;
        }else if(scenario.status === "undefined"){
          count.missing++;
        }else if(scenario.status === "skipped"){
          count.skipped++;
        }
      }
  }
  
  return count
}

function durationToredableFormat (duration) {
  const ms = parseInt((duration % 1000) / 100);
  const s = Math.floor((duration / 1000) % 60);
  const m = Math.floor((duration / (1000 * 60)) % 60);
  const h = Math.floor((duration / (1000 * 60 * 60)) % 24);
  return `${h}h ${m}m ${s}s ${ms}ms`;
}