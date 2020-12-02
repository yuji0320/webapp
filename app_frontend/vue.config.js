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
  configureWebpack: {
    devServer: {
      watchOptions: {
        poll: true
      }
    }
  }
}