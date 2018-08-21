require("babel-register");
require("babel-polyfill");
require("./server");

var webpack = require("webpack");
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");
var config = require("../webpack.dev.conf");
var fileReder = require("../readfiles");
var files = fileReder("./src/features");
var proxyMiddleware = require("http-proxy-middleware");
var proxyTable = require("./config/dev").default;
proxyTable = proxyTable.proxyTable;

var app = require("../app");

var compiler = webpack(config);

const serverOption = {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
};

Object.keys(proxyTable).forEach(context => {
  let options = proxyTable[context];
  if (typeof options === "string") {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

app.use(webpackDevMiddleware(compiler, serverOption));
app.use(webpackHotMiddleware(compiler));
app.use((req, res, next) => {
  if (req.headers.accept.match("text/html")) {
    res.header("Content-Type", "text/html; charset=utf-8");
    return next();
  }
  return next();
});

files.forEach(data => {
  app.get("/" + data, (req, res) => {
    res.render(data);
  });
  app.get("/" + data + "/:siteId", (req, res) => {
    res.render(data);
  });
  app.get("/" + data + "/:siteId/:pageId", (req, res) => {
    res.render(data);
  });
  app.get("/" + data + "/:siteId/:pageId/:nameId", (req, res) => {
    res.render(data);
  });
  app.get("/" + data + "/:siteId/:pageId/nameId/nameId1", (req, res) => {
    res.render(data);
  });
});
