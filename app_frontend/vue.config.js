module.exports = {
  "devServer": {
    "host": "0.0.0.0",
    "port": 9000,
    "disableHostCheck": true,
    proxy: {
      '/websocket': {
          target: 'http://localhost:9000',
          ws: true,
          changeOrigin: true
      }
    }
  },

  "transpileDependencies": [
    "vuetify"
  ],

  lintOnSave: false,

  // index.htmlが読み込むjsやcssのroot
  // publicPath: './',

  // build時のdistファイルのアウトプット先
  outputDir: 'dist/',
  assetsDir: 'assets/',
  css: {
    sourceMap: true,

    loaderOptions: {
      css: {}
    }
  },

  // webpackBundleAnalyzerの出力設定。
  pluginOptions: {
    webpackBundleAnalyzer: {
      analyzerMode: 'static',
      openAnalyzer: false
    }
  },
}