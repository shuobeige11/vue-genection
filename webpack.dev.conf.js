var path = require('path')
var fs = require('fs')
var webpack = require('webpack');
console.log(path.join(__dirname, 'src/component'))
module.exports = {
  entry: {
    index: [
      'webpack-hot-middleware/client',
      path.resolve(__dirname, './src/container/main.js')
    ]  
  },
  output: {
    path: path.resolve(__dirname, 'static/js'),
    publicPath: '/js/',
    filename: 'index.min.js'
  },
  resolve: {
    modules: [
      path.join(__dirname, './node_modules')
    ],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue': 'vue/dist//vue.esm.js',
      'component': path.join(__dirname, 'src/component')
    }
  },
  plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
  ],
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
        loader: 'style-loader!css-loader!sass-loader'
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
        loader: 'url-loader',
        query: {
          limit: 20192,
          name: path.resolve(__dirname, 'dist/img/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}

