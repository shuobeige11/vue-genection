var path = require('path')
var fs = require('fs')
var webpack = require('webpack');

module.exports = {
  entry: {
    index: [
      path.resolve(__dirname, './src/container/main.js')
    ]  
  },
  output: {
    path: path.resolve(__dirname, 'static/js'),
    publicPath: '/js/',
    filename: '[name].[chunkhash].js'
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
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
         new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: function (module, count) {
            // any required modules inside node_modules are extracted to vendor
            
            return (
              module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.indexOf(
                path.resolve(__dirname, './node_modules')
              ) === 0
            )
          }
        }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest',
          chunks: ['vendor']
        }),
    new webpack.NoErrorsPlugin()
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

