var path = require('path')
var fs = require('fs')
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var fileReder = require('./readfiles')
var files = fileReder('./src/features')
var jsFile = {}
jsFile['vender'] = ['vue', 'vue-router', 'vuex', 'axios']

files.forEach(data => {
  jsFile[data] = './src/features/' + data + '/main.js'  
})
var pluginsArray1 = connect()

var pluginsArray2 = [
  new HtmlWebpackPluginDist(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    output: {
      comments: false,
    },
    compress: {
      warnings: false
    }
  }),
  //new webpack.optimize.CommonsChunkPlugin('common', 'dist/js/vendor.js'),
  new webpack.optimize.CommonsChunkPlugin({
    name: ['vender'],
    minChunks: 1
  }),
  new webpack.NoErrorsPlugin()
] 
pluginsArray1 = pluginsArray1.concat(pluginsArray2)

module.exports = {
  entry: jsFile,
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    publicPath: '/js/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    modules: [
      path.join(__dirname, './node_modules')
    ],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue': 'vue/dist/vue.esm.js',
      'component': path.join(__dirname, 'src/component')
    }
  },
  plugins: pluginsArray1,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'style-loader!css-loader!sass-loader'
          },
          postcss: [
            require('autoprefixer')({
              browsers: ['last 7 versions']
            })
          ]
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: "file-loader"
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader!file-loader',
        query: {
          limit: 20192,
          name: path.resolve(__dirname, 'dist/img/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}


function connect() {
  var arr = []
  files.forEach(function(data) {
    var cache = null
    cache = new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, './dist/' + data + '/index.html'),
      template: './view/'+ data + '.html',
      chunks:['vender', data]
    })
    arr.push(cache)  
  })
  return arr
}

function HtmlWebpackPluginDist() {}
HtmlWebpackPluginDist.prototype.apply = function (compiler) {
  var self = this;
  // Hook into the html-webpack-plugin processing
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin(
      'html-webpack-plugin-before-html-processing',
      function (data, cb)  {
        var filename = data.assets.js
        filename = filename.map(function(data) { return data.replace(/\/js\//, '') })
        filename = filename.map(function(data) {
          var name = data.split('.')
          return name[0]
        })
        if (data.html.match(filename[1])) {
          data.html = data.html.replace('<script type="text/javascript" src="/js/' + filename[1] + '.min.js"></script>', '')
        } 
        cb(null, data)
      }
    )
  });
};