let child_process = require('child_process');
let path = require('path');
const {debug} = require('./../../Tasks');
const runCypressDocker = require("./cypress-docker");
const runCy2 = require("./parallel-cypress");

/**
 * Fork child process each for cache specs
 * @param {array} cachedSpecs 
 */
async function runTests(cachedSpecs, fromCli, projConfig, postRun) {
    const testMode = process.argv[2];
    console.log("Preparing processes to run tests");
    let done = 0;
    const cmdPromises = [];
    fromCli.build = fromCli.build || randomBuildId();
    for (let i = 0; i < cachedSpecs.length; i++) {
        if(fromCli.docker){
            cmdPromises.push(
                runCypressDocker(cachedSpecs[i], fromCli, projConfig)
            );
        }else{
            cmdPromises.push(
                runCy2(cachedSpecs[i], fromCli, projConfig, cachedSpecs.length)
            );
        }
    }

    Promise.all(cmdPromises).then( async () => {
        debug('All the Specs are executed');
        await postRun(); //Run post run if the tests are running from CLI
    })
}

function randomBuildId(){
    return `cytorus-${Date.now()}`
  }
module.exports = runTests;


        // let child = child_process.fork(path.join(__dirname, './cytorus-child-process.js'));
        // child.send({
        //     cmd: testMode,
        //     cypressConfig: Object.assign({}, {
        //         spec: cachedSpecs[i],
        //         //"quiet": true
        //     }, fromCli.cypress)
        // });
        // child.on('message', async function (message) {
        //     //console.log('[parent] received message from child:', message);
        //     debug('[parent] Specs for group ' + i + ' are completed.');
        //     done++;
        //     if (done === cachedSpecs.length) {
        //         debug('[parent] All the Specs are executed');
        //         if (testMode !== "open") await postRun(); //Run post run if the tests are running from CLI
        //     }
        // });
