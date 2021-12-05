//const util = require('util');
//const exec = util.promisify(require('child_process').exec);
const {exec, spawn} = require('child_process');
const { debug } = require('../../Tasks');

//TODO: check if worker thread can be better option than spawned process
/**
 * 
 * @param {string} spec 
 * @param {array} args 
 * @returns Promise
 */
const runDockerCypress = function (spec, fromCli, projectConfig) {
  debug("Before returning the docker command");
  return new Promise(  (resolve, reject) => {
    const proc = spawn("docker", buildDockerCmd(projectConfig, spec, fromCli) , {shell: process.platform == 'win32'});
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
 * Build docker command based on docker cmd necessary params, cypress paramas, and env var from proj config
 * @param {object} projectConfig 
 * @param {string} spec 
 * @param {object} fromCli 
 * @returns {string} 
 */
function buildDockerCmd(projectConfig, spec, fromCli) {

  //TODO: support --env-file
  const dockerArgs = [ "run", "-v", `${process.cwd()}:/e2e`, "-w", "/e2e" ];

  //Add env variables
  for (let i = 0; i < projectConfig.runConfig.docker.env.length; i++) {
    const envVar = projectConfig.runConfig.docker.env[i];
    dockerArgs.push("-e");
    dockerArgs.push(envVar);
  }

  //Add CLI args
  if(projectConfig.runConfig.docker.args){
    const args = projectConfig.runConfig.docker.args;
    for (const key in args) {
      dockerArgs.push(key);
      dockerArgs.push(args[key]);
    }
  }

  const cypressArgs = [
    `cypress/included:${projectConfig.runConfig.docker.cypress}`, "--spec", `'${spec}'`
  ];

  const fullCmd = dockerArgs.concat(cypressArgs).concat(fromCli.cypressArgs);
  debug("Executing: docker " + fullCmd.join(" "));
  return fullCmd;
}

module.exports = runDockerCypress;

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
