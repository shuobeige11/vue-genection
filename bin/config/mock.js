let BaseConfig = {
  // 开发模式配置
  debug: true,
  develop: false,
  needLoading: true,
  proxyTable: {
    "/cust-complain-app": {
      target: "http://dev-csc.ymmoa.com/",
      changeOrigin: true,
      pathRewrite: {
        "^/cust-complain-app": "/cust-complain-app"
      }
    },
    "/callCenter": {
      target: "http://dev-csc.ymmoa.com/",
      changeOrigin: true,
      pathRewrite: {
        "^/callCenter": "/callCenter"
      }
    },
    "/callcenter-manage-app": {
      target: "http://dev-csc.ymmoa.com/",
      changeOrigin: true,
      pathRewrite: {
        "^/callcenter-manage-app": "/callcenter-manage-app"
      }
    }
  }
};
export default BaseConfig;
