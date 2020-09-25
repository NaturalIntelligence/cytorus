const fs = require("fs");
const path = require("path");
const {PATHS:_P} = require("./../Constants");

function traverse(dir, ext, fromProjRoot){
    let fileArr = [];
    const list = fs.readdirSync(dir);
    
    for (let i = 0; i < list.length; i++) {
      let file = path.resolve(dir, list[i]);
      let stats = fs.lstatSync(file);
  
      if (stats.isDirectory(file)) {
        fileArr = fileArr.concat(traverse(file, ext, fromProjRoot) );
      } else if (file.endsWith(ext)) {
        if(fromProjRoot){
          fileArr.push(makeRelative(_P.PROJ_ROOT, file));
        }else{
          fileArr.push(file);
        }
      }
    }
  
    return fileArr;
}

function makeRelative(basePath, absPath){
  return absPath.substr(basePath.length+1);
}

module.exports = {
    traverse : traverse
}