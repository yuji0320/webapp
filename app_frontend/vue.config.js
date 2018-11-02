module.exports = {
  //   chainWebpack: config => {
  //     const context = config.store.get("context");
  //     const resolve = _path => path.resolve(context, _path);
  //
  //     if (SOLUTION === "docs") {
  //       config
  //         .entry("app")
  //         .clear()
  //         .add(resolve("docs/main.ts"));
  //     }
  //   },
  devServer: {
    host: "0.0.0.0",
    port: 9000,
    disableHostCheck: true
  }
};
