// eslint-disable-next-line no-undef
module.exports = {
  // entry: [
  //   "webpack-dev-server/client?http://127.0.0.0:8080",
  //   "webpack/hot/only-dev-server",
  //   "./src"
  // ],
  devServer: {
    // public: "192.168.2.114",
    host: '0.0.0.0',
    port: 9000,
    // disableHostCheck: true,
    // proxy: {
    //   '/websocket': {
    //     target: 'http://localhost:4000',
    //     ws: true,
    //     changeOrigin: true
    //   }
    // },
    watchOptions: {
      poll: true
    }
    // headers: {
    //   ' Access-Control-Allow-Origin ': ' * ',
    //   // eslint-disable-next-line max-len
    // eslint-disable-next-line max-len
    //   ' Access-Control-Allow-Headers ': ' Origin、X-Requested-With、Content-Type、Accept ',
    // },
  },
  productionSourceMap: false,
  publicPath: '/public/',
};
