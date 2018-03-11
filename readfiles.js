var path = require('path')
var fs = require('fs')

function readfiles(path) {
  return fs.readdirSync(path);
}

module.exports = paths => {
  var entry = []
  paths = path.resolve(__dirname, paths)
  if (fs.statSync(paths).isDirectory()) {
    var files = readfiles(paths);
    var states = fs.statSync(paths);
    files.forEach(function(file){
      if (states.isDirectory() && paths) {
        entry.push(file)
      }
    });
    entry = entry.filter(data => data != '.DS_Store')
    return entry;
  }
}

