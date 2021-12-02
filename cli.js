#!/usr/bin/env node
const paths = require('./paths');
const fs = require("fs");

if(process.argv.indexOf("-h") !== -1 || process.argv.indexOf("--help") !== -1){
  console.log( require('./src/cli/inlineHelpContent') );
  //process.exit(0);
  process.exitCode = 0;
}else if(process.argv[2] !== "open" && process.argv[2] !== "run"){
  console.log("Invalid action. Either use 'open', 'run', or '--help' instead of '"+process.argv[2]+"'");
  process.exitCode = 1;
  //process.exit(1);
}else{

  const appVersion = require("./package.json").version;
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
             Y8b d88P \x1b[38;5;112;1m${appVersion}\x1b[0m                                         
              "Y88P"                                           
  `);

  setupWorkSpace();
  let main = require('./src/cli/main');
  main();
}


/**
 * Setup workspace for cytorus.
 * Clean cytorus working directory and cache folder
 */
 function setupWorkSpace(){
  emptyDirSync( paths.cache                      , { recursive: true});
  emptyDirSync( paths.WD                          , { recursive: true});
  
  fs.mkdirSync( paths.cache                      , { recursive: true});
  fs.mkdirSync( paths.report.minimal    , { recursive: true});
  fs.mkdirSync( paths.report.detailed    , { recursive: true});
}

const emptyDirSync = location => {
  const files = fs.readdirSync(location); 
  for (const file of files) {
    const filePath = path.join(location, file);
    const stats = await fs.stat(filePath)

    if(stats.isDirectory()){
      emptyDirSync(filePath);
    }else{
      fs.unlinkSync(filePath);
    }
  }
}