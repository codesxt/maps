const fs = require('fs')

var functions = {
  deleteFolder: (path) => {
    if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file,index){
        var curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) {
          functions.deleteFolder(curPath);
        } else {
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    }
  },
  createFolder: (path) => {
    if (!fs.existsSync(path)){
      fs.mkdirSync(path, { recursive: true } )
    }
  },
  writeJSONFile: (filename, content) => {
    fs.writeFileSync(filename, JSON.stringify(content))
  },
  readJSONFile: (filename) => {
    return JSON.parse(fs.readFileSync(filename))
  },
  fileExists: (path) => {
    return fs.existsSync(path)
  }
}

module.exports = functions
