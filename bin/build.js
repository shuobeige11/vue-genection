var webpack = require('webpack')
var config = require('../webpack.prod.conf');

var compiler = webpack(config, function (err, stats) {
  if (err) throw err
})
