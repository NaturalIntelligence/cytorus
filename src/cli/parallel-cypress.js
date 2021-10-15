//const util = require('util');
//const exec = util.promisify(require('child_process').exec);
const {exec, spawn} = require('child_process');
const { debug } = require('../../Tasks');
const paths = require('../../paths');
const path = require('path');

//TODO: check if worker thread can be better option than spawned process
/**
 * 
 * @param {string} spec 
 * @param {array} args 
 * @returns Promise
 */
const runCy2 = function (spec, fromCli, projectConfig, count) {
  debug("Before returning the npx cy2 promise");
  return new Promise(  (resolve, reject) => {
    const proc = spawn("npx", buildCmd(projectConfig, spec, fromCli, count) );
    proc.stdout.on('data', (data) => {
      console.log(data.toString()); //chunk data
    });
    proc.stderr.on('data', (data) => {
      console.log(data.toString()); //chunk data
    });
    proc.on('close', (code) => {
      //console.log(`child process exited with code ${code}`);
      debug(`Tests completed for test group ${spec}`);
      resolve();
    });

    proc.on('error', (err) => {
      console.log(err);
      reject(err);
    });
  }).catch(err => {
    //don't want to let command fail when cypress returns with non zero exit code 
    debug(err);
  });
}


//TODO: Same command needs to build for different spec file. So it can be optimized
/**
 * Build command based on cy2 with necessary arguments
 * @param {object} projectConfig 
 * @param {string} spec 
 * @param {object} fromCli 
 * @returns {string} 
 */
function buildCmd(projectConfig, spec, fromCli, count ) {


  const cy2Args = [ ], cliArgs = [];

  if(count > 1){
    cy2Args.push("cy2", "run");
    cy2Args.push("--record", "--key", "cytorus", "--parallel", "--ci-build-id", fromCli.build)
  }else{
    if(fromCli.cy2 === true){
      cy2Args.push("cy2", "run");
    }else{
    }
    cy2Args.push("cypress", "run");
  }

  //cy2Args.push("--spec", `'${spec}'`);
  //To run tests parallely, same specs pattern should be passed
  cy2Args.push("--spec", path.resolve(__projRootDir,paths.cache) + "/*.cytorus" );

  // const cy2Args = [
  //   //`cy2 run --record --key cytorus --parallel --ci-build-id ${fromCli.build}`,
  //   "cy2", "run", "--record", "--key", "cytorus", "--parallel", "--ci-build-id", fromCli.build || randomBuildId(),
  //   "--spec", `'${spec}'`
  //   //"--spec", `cypress/integration/cytorus-cache/*.cytorus`
  // ];

  const fullCmd = cliArgs.concat(cy2Args).concat(fromCli.cypressArgs);
  debug("Executing: " + fullCmd.join(" "));
  return fullCmd;
}


module.exports = runCy2;

//some old code for reference
  //const { stdout, stderr } = await exec(`docker run -it -v $PWD:/e2e -w /e2e cypress/included:${version} --spec ${spec} ` + args.join(" "));
  //const cmd = `docker run -v $PWD:/e2e -w /e2e cypress/included:${version} --spec ${spec} ` + args.join(" ");

    //execFile(`docker run -v $PWD:/e2e -w /e2e cypress/included:${version} --spec ${spec} ` + args.join(" "), err => {
    // exec(cmd, (error, stdout, stderr)  => {
    //    console.error(stderr);
    //    console.log( stdout);
    //   if(error){
    //     reject(error);
    //   }else{
    //     resolve(stdout);
    //   }

    // })
