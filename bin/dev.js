require('babel-register');
require('babel-polyfill');
require('./server')

var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('../webpack.dev.conf');

var app = require('../app');

var compiler = webpack(config)

const serverOption = {
  headers: {
    'Content-Type': 'application/javascript',
    'Access-Control-Allow-Origin': '*'
  },
  publicPath: config.output.publicPath,
  noInfo: true
}

app.use(webpackDevMiddleware(compiler, serverOption))
app.use(webpackHotMiddleware(compiler))

app.get('/', (req, res) => {
    res.render('index', {title: 'html'})
})

app.get('/login', (req, res) => {
  res.render('login', {title: 'a'})
})