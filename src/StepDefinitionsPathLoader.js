const fs = require("fs");
const path = require("path");

/**
 * return the list of absolute path of all the files in cypress folder in user's workspace.
 * @returns {string[]}
 */
function loadAllStepDefinitions(basePath){
    const appRoot = basePath || process.cwd();
    let pathForStepDefinitions = path.join(appRoot, "cypress/integration");

    const files = travers(pathForStepDefinitions, [".js", ".ts"]);
    const props = {};
    files.forEach((file, i)=>{
        const content = fs.readFileSync(file)
        props[file] = {
          hasTypeDef: content.indexOf('defineParameterType') > -1,
          index: i
        }
    })
    // the files containing defineParameterType() call(s) must be loaded first
    files.sort((a,b) => {
        if (!(props[a].hasTypeDef ^ props[b].hasTypeDef)) {
            // use the original order for same condition
            return props[a].index - props[b].index
        } else {
            return props[a].hasTypeDef ? -1 : 1;
        }
    })
    return files.map(file=>"require('" + file + "');")
}

/**
 * Go through all the directories recursively to list all the files as per given filter
 * @param {string} dir Absolute directory path
 * @param {string[]} extArr List of extensions to keep
 * @returns {string[]} list of paths
 */
function travers(dir, extArr){
    let fileArr = [];
    const list = fs.readdirSync(dir);
    for (let i = 0; i < list.length; i++) {
        let file = list[i];
        file = path.resolve(dir, file);
        let stats = fs.lstatSync(file);
        if (stats.isDirectory(file)) {
            fileArr = fileArr.concat(travers(file, extArr) );
        } else {
            const ext = file.substr(file.lastIndexOf("."));
            if (extArr.indexOf(ext) !== -1) {
                fileArr.push(file);
            }
        }
    }

    return fileArr;
}
module.exports = loadAllStepDefinitions;
    
