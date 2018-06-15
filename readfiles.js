const path = require('path')
const fs = require('fs')

function readfiles(path) {
  return fs.readdirSync(path);
}

module.exports = paths => {
  let entry = []
  paths = path.resolve(__dirname, paths)
  if (fs.statSync(paths).isDirectory()) {
    let files = readfiles(paths)
    let states = fs.statSync(paths)
    files.forEach(function(file){
      if (states.isDirectory() && paths) {
        entry.push(file)
      }
    });
    entry = entry.filter(data => data != '.DS_Store')
    return entry
  }
}

