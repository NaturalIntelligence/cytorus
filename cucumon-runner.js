#!/usr/bin/env node

if(process.argv.indexOf("-h") !== -1 || process.argv.indexOf("--help") !== -1){
  console.log(`
  Following options are supported. You can also pass cypress run command arguments.

  --spec <spec-file>              comma sperated path of spec files without space
  --tags <tag-expression>         tag expression to run particular scenarios
  --include <scenario-positions>  comma sperated list of scenario positions to run the tests
  --exclude <scenario-positions>  comma sperated list of scenario positions to skip while running the tests
  --specs-config <file.json>      json file path containing the configuration to run the tests.
  --dist <false>                  Set it to true to not run tests in parallel
  --dist-limit <number>           Number of parallel processes to run the tests

  if you pass '--parallel' option, then '--dist' will be set to false.
  `);

  process.exit(0);
}

let child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const bestFit = require('./src/best-fit');
//const cypress = require('cypress')
const {config,cypressArgs,featureFileParser} = require('./src/ConfigBuilder');
const filter = require('./src/ScenarioFilter');
const buildCypressOptions = require('./cliHelper/CypressOptionsBuilder');

//console.log(config);

//read the feature file
//const baseSpecsPath = path.join(process.cwd(), "cypress/integration/features");
const baseSpecsPath = "cypress/integration/features";
const features = [];
let specFiles;
//TODO: support regex to select multiple files or all the files from a folder
for (let s_i = 0; s_i < config.specs.length; s_i++) {
  const spec = config.specs[s_i];
  if(!spec.files){
    specFiles = travers(baseSpecsPath);
  }else{
    specFiles = spec.files.split(",");
  }

  //TODO: this can be async
  for (let i = 0; i < specFiles.length; i++) {
    const specFilePath = specFiles[i];
    const fileContent = fs.readFileSync(specFilePath).toString();
    if(!fileContent.startsWith("#!")){
      console.log("Parsing:", specFilePath);
      const featureObj = featureFileParser.parse( fileContent );
      filter( [featureObj] , spec);
      featureObj.fileName = specFilePath;
      features.push( featureObj );
    }
  }
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
console.log("Clearing "+cacheLocation+" for this run");
fs.rmdirSync(cacheLocation, { recursive: true});
fs.mkdirSync(cacheLocation, { recursive: true});

// function rmDir(dir) {
//   if (fs.existsSync(dir)) {
//     fs.readdirSync(dir).forEach((file, index) => {
//       const curPath = path.join(dir, file);
//       if (fs.lstatSync(curPath).isDirectory()) { // recurse
//         rmDir(curPath);
//       } else { // delete file
//         fs.unlinkSync(curPath);
//       }
//     });
//     fs.rmdirSync(dir);
//   }
// };

console.log("Analyzing tests to run in parallel");


let fileNames = [];
if(config.dist && config.dist.limit > 1 && features.length > 1){
  //Group features based on number of scenarios
  const bins = bestFit(features,config.dist.limit);
  
  //save it in multiple files
  console.log("I feel that " + bins.length + " processes are fine to run in parallel 👍");
  fileNames = Array(bins.length);
  for (let i = 0; i < bins.length; i++) {
    const featureIndexes = bins[i].indexes;
    const group = Array(featureIndexes.length);
    for (let f_i = 0; f_i < featureIndexes.length; f_i++) {
      group[f_i] = features[featureIndexes[f_i]];
    }
    fileNames[i] = createInputFile(group, i);
  }
}else{
  fileNames = [ createInputFile(features, 0)];
}

function createInputFile(data, i){
  const fileName = createFileName(i);
  fs.writeFile( fileName + ".json", JSON.stringify(data), err => {
    if(err){
      console.log("Not able to write processings files in .cucumon folder on the root of the project");
      throw err;
    }
  });
  fs.writeFile(fileName + ".cucumon", "" , err => {
    if(err){
      console.log("Not able to write processings files in .cucumon folder on the root of the project");
      throw err;
    }
  });

  return fileName;
}

console.log("Building Cypress configuration");
const commonCypressOptions = buildCypressOptions(cypressArgs);


console.log("Preparing processes to run tests");
let done = 0;
for (let i = 0; i < fileNames.length; i++){
  let child = child_process.fork( path.join( __dirname, './cliHelper/cucumon-runner-child.js') );
  //const fileName = fileNames[i].replace(/.json$/, ".cucumon");
  child.send({
    cypressConfig: Object.assign({}, {
        //spec: "cypress/integration/features/all.cucumon", 
        spec: fileNames[i] + ".cucumon", 
        //"quiet": true
      } , commonCypressOptions)
  });
  child.on('message', function(message) {
    console.log('[parent] received message from child:', message);
    done++;
    if (done === fileNames.length) {
      console.log('[parent] received all results');
      //TODO: Show commulicative result
      //Retry logic
    }
  });
}



//Pass file name as message from server to child which will be passed as env variable
