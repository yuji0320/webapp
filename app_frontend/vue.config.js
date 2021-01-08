module.exports = {
  "devServer": {
    "host": "0.0.0.0",
    "port": 9000,
    "disableHostCheck": true
  },
  "transpileDependencies": [
    "vuetify"
  ],
  lintOnSave: false,
  // index.htmlが読み込むjsやcssのroot
  publicPath: './',
  // build時のdistファイルのアウトプット先
  outputDir: 'dist/',
  // webpackBundleAnalyzerの出力設定。
  pluginOptions: {
    webpackBundleAnalyzer: {
      analyzerMode: 'static',
      openAnalyzer: false
    }
  }
}