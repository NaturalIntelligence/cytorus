#!/usr/bin/env node

if(process.argv.indexOf("-h") !== -1 || process.argv.indexOf("--help") !== -1){
  console.log(require('./src/cliHelper/helpContent'));
  process.exit(0);
}else if(process.argv[2] !== "open" && process.argv[2] !== "run"){
  console.log("Invalid action. Either user 'open' or 'run' instead of '"+process.argv[2]+"'");
  process.exit(1);
}


const Cucumon = require("cucumon");

let child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const bestFit = require('./src/cliHelper/best-fit');
const cli = require('./src/cliHelper/CliArgsReader');
const buildCypressOptions = require('./src/cliHelper/CypressOptionsBuilder');
const readProjConfig = require('./src/cliHelper/ProjectConfigReader');
const filter = require('./src/ScenarioFilter');
const { PATHS: _P, FNs: _F } = require("./Constants");

const features = [];
let specFiles;
const cucumon = new Cucumon({clubBgSteps : true});
//TODO: support regex to select multiple files or all the files from a folder
for (let s_i = 0; s_i < cli.specs.length; s_i++) {
  const spec = cli.specs[s_i];
  if(!spec.files){
    specFiles = travers(_P.FEATURES_PATH);
  }else{
    specFiles = spec.files.split(",");
  }

  //TODO: this can be async
  for (let i = 0; i < specFiles.length; i++) {
    const specFilePath = specFiles[i];
    const fileContent = fs.readFileSync(specFilePath).toString();
    if(!fileContent.startsWith("#!")){
      console.log("Parsing:", specFilePath);
      const featureObj = cucumon.parse( fileContent );
      filter( [featureObj] , spec);
      featureObj.fileName = specFilePath;
      features.push( featureObj );
    }
  }
}

function readSpecFiles(givenPath){

}

function travers(dir){
  const fileArr = [];
  const list = fs.readdirSync(dir);
  
  for (let i = 0; i < list.length; i++) {
    let file = path.resolve(dir, list[i]);
    let stats = fs.lstatSync(file);

    if (stats.isDirectory(file)) {
      fileArr.concat(travers(file) );
    } else if (file.endsWith(".feature")) {
        fileArr.push(file);
    }
  }

  return fileArr;
}

const cacheLocation = "cypress/integration/cucumon-cache/";
//const cacheLocation = "cucumon/";
function createFileName(i){
  return cacheLocation + "group"+i;
}
setupWorkSpace();


console.log("Analyzing tests to run in parallel");


let cachedFeatureFileNames = [];
if(cli.cypress[0] !== "open" && cli.dist && cli.dist.limit > 1 && features.length > 1){
  //Group features based on number of scenarios
  const bins = bestFit(features,cli.dist.limit);
  
  //save it in multiple files
  console.log("I feel that " + bins.length + " processes are fine to run in parallel");
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

function createInputFile(data, i){
  
  fs.writeFile( _F.CACHED_JSON_FILE(i), JSON.stringify(data), err => {
    if(err){
      console.log("Not able to write processings files in .cucumon folder on the root of the project");
      throw err;
    }
  });
  const fileName = _F.CACHED_FEATURE_FILE(i);

  fs.writeFile(fileName, "" , err => {
    if(err){
      console.log("Not able to write processings files in .cucumon folder on the root of the project");
      throw err;
    }
  });

  return fileName;
}

console.log("Building Cypress configuration");

const commonCypressOptions = buildCypressOptions(cli.cypress);

let projConfig = _F.readIfExist( _F.ABS( _P.PROJ_CONFIG_FILENAME ) ,{});
projConfig = readProjConfig(projConfig);
projConfig.init();

fs.writeFileSync(".cucumon/cli.json", JSON.stringify({
  interactive: cli.cypress[0] === 'open',
  processes: cachedFeatureFileNames.length,
  cli: true
}))



console.log("Preparing processes to run tests");
let done = 0;
for (let i = 0; i < cachedFeatureFileNames.length; i++){
  let child = child_process.fork( path.join( __dirname, './src/cliHelper/cucumon-runner-child.js') );
  //const fileName = fileNames[i].replace(/.json$/, ".cucumon");
  child.send({
    cmd: cli.cypress[0],
    cypressConfig: Object.assign({}, {
        //spec: "cypress/integration/features/all.cucumon", 
        spec: cachedFeatureFileNames[i], 
        //"quiet": true
      } , commonCypressOptions)
  });
  child.on('message', function(message) {
    console.log('[parent] received message from child:', message);
    done++;
    if (done === cachedFeatureFileNames.length) {
      console.log('Completed all tests');
      //TODO: Show commulicative result
      //Retry logic
      postRun();
    }
  });
}

function postRun(){
  //clear cli.json
  //run end test event in common 

  fs.unlinkSync(".cucumon/cli.json");
  projConfig.end();
}

function setupWorkSpace(){
  fs.rmdirSync( _P.FEATURES_CACHE     , { recursive: true});
  fs.rmdirSync( _P.WD                 , { recursive: true});
  
  fs.mkdirSync( _P.FEATURES_CACHE     , { recursive: true});
  fs.mkdirSync( _P.MINIMAL_RESULT_PATH, { recursive: true});
  fs.mkdirSync( _P.DETAIL_RESULT_PATH , { recursive: true});
}