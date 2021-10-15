const fs = require("fs");
const path = require("path");

/**
 * return the list of absolute path of all the files in cypress folder in user's workspace.
 * @returns {string[]}
 */
function loadAllStepDefinitions(basePath){
    const appRoot = basePath || process.cwd();
    let pathForStepDefinitions = path.join(appRoot, "cypress/integration");
    return travers(pathForStepDefinitions, [".js", ".ts"], "require('", "');");
}

/**
 * Go through all the directories recursively to list all the files as per given filter
 * @param {string} dir Absolute directory path
 * @param {string[]} extArr List of extensions to keep
 * @returns {string[]} list of paths
 */
function travers(dir, extArr , prefix, postfix){
    let fileArr = [];
    const list = fs.readdirSync(dir);
    for (let i = 0; i < list.length; i++) {
        let file = list[i];
        file = path.resolve(dir, file);
        let stats = fs.lstatSync(file);
        if (stats.isDirectory(file)) {
            fileArr = fileArr.concat(travers(file, extArr, prefix, postfix) );
        } else {
            const ext = file.substr(file.lastIndexOf("."));
            if (extArr.indexOf(ext) !== -1) {
                fileArr.push(prefix+ file + postfix);
            }
        }
    }

    return fileArr;
}
module.exports = loadAllStepDefinitions;
    
