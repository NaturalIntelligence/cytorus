const fs = require("fs");
const path = require("path");

function traverse(dir, ext){
    let fileArr = [];
    const list = fs.readdirSync(dir);
    
    for (let i = 0; i < list.length; i++) {
      let file = path.resolve(dir, list[i]);
      let stats = fs.lstatSync(file);
  
      if (stats.isDirectory(file)) {
        fileArr = fileArr.concat(traverse(file, ext) );
      } else if (file.endsWith(ext)) {
          fileArr.push(file);
      }
    }
  
    return fileArr;
}

module.exports = {
    traverse : traverse
}