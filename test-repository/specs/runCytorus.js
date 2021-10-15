let child_process = require('child_process');
const fs = require('fs');

/**
 * Run cytorus command with given options 
 * @param {array} argList to pass to the cytorus command
 * @param {function} cb callback to run post test
 * @returns Promise
 */
module.exports = function(argList, cb) {
    argList.push("--skip-threshold");
    return new Promise( (resolve, reject) => {
        child_process.exec( "npx cytorus run " +   argList.join(" "), (err, stdoutMsg, stderrMsg) => {
            if (err) {
                //console.log(stdoutMsg);
                //console.log(err.message);
                reject(err);
            }else {
                const result = JSON.parse(fs.readFileSync(".cytorus/result/stats.json").toString());
                //assert(expected).toEqual(result);
                cb(result);
                resolve();
            }
        });

    })
}