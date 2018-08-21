var path = require("path");
var webpack = require("webpack");
var fileReder = require("./readfiles");
var files = fileReder("./src/features");
var imgUrl = require("./bin/config/dev").default;
var jsFile = {};
function resolve(dir) {
  return path.join(__dirname, "..", dir);
}
files.forEach(data => {
  jsFile[data] = [
    "webpack-hot-middleware/client",
    "./src/features/" + data + "/main.js"
  ];
});

module.exports = {
  entry: jsFile,
  output: {
    path: path.resolve(__dirname, "./static"),
    publicPath: "/",
    filename: "[name].min.js"
  },
  resolve: {
    modules: [path.join(__dirname, "./node_modules")],
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue: "vue/dist//vue.esm.js",
      "@": path.join(__dirname, "src/components")
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
        loader: "vue-loader",
        options: {
          loaders: {
            scss: "style-loader!css-loader!sass-loader"
          },
          postcss: [
            require("autoprefixer")({
              browsers: ["last 7 versions"]
            })
          ]
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.scss$/,
        loader: "style-loader!css-loader!sass-loader"
      },
      {
        test: /\.(js|vue)$/,
        loader: "eslint-loader",
        enforce: "pre",
        include: [path.resolve(__dirname, "src")],
        options: {
          // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
          formatter: require("eslint-friendly-formatter") // 指定错误报告的格式规范
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: "json"
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: "file-loader"
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: path.posix.join(imgUrl.imageHost, "img/[name].[hash:7].[ext]")
        }
      }
    ]
  }
};
