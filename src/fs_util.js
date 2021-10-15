const fs = require("fs");
const path = require("path");
const paths = require("../paths");

global.__projRootDir = process.cwd();

const absolute = p => path.join(__projRootDir, p);
const readIfExist = (m,otherwise) => fs.existsSync(m) ? require(m) : otherwise;

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
          fileArr.push(makeRelative( __projRootDir, file));
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

/**
 * Delete all the files from the given directory
 * @param {string} location of a directory
 */
function emptyDirSync(location){
  const files = fs.readdirSync(location); 
  for (const file of files) {
      fs.unlinkSync(path.join(location, file));
  }
}

/**
 * 
 * @param {string} filePath 
 * @returns size in MBs
 */
function size(filePath){
  var stats = fs.statSync(filePath);
  var fileSizeInBytes = stats.size;
  return  fileSizeInBytes / (1024*1024);
}

module.exports = {
    absolute : absolute,
    readIfExist : readIfExist,
    traverse : traverse,
    emptyDirSync: emptyDirSync,
    size: size
}