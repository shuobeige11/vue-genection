var path = require('path')
var fs = require('fs')
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
      index: path.resolve(__dirname, './src/container/main.js')
  },
  output: {
    path: path.resolve(__dirname, 'static/js'),
    publicPath: '/js/',
    filename: '[name].min.js'
  },
  resolve: {
      
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue': 'vue/dist/vue.common.js'
    }
  },
  plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
    //      new webpack.optimize.CommonsChunkPlugin({
    //       name: 'vendor',
    //       minChunks: function (module, count) {
    //         // any required modules inside node_modules are extracted to vendor
    //         return (
    //           module.resource &&
    //           /\.js$/.test(module.resource) &&
    //           module.resource.indexOf(
    //             path.resolve(__dirname, './node_modules')
    //           ) === 0
    //         )
    //       }
    //     }),
    // // extract webpack runtime and module manifest to its own file in order to
    // // prevent vendor hash from being updated whenever app bundle is updated
    //     new webpack.optimize.CommonsChunkPlugin({
    //       name: 'manifest',
    //       chunks: ['vendor']
    //     }),
    
        new ExtractTextPlugin("[name].[hash].css"),
        new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
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
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 20192,
          name: path.resolve(__dirname, 'dist/img/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  vue: {
    loaders: {
        scss: 'style!css!sass'
    },
    postcss: [
      require('autoprefixer')({
        browsers: ['last 7 versions']
      })
    ]
  }
}

