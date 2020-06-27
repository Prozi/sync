const webpack = require("webpack");

module.exports = {
  entry: "./lib/demo.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js"],
  },
  output: {
    path: __dirname + "/demo",
    publicPath: "/",
    filename: "dist.js",
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: "./demo",
    hot: true,
  },
  externals: {
    "@jacekpietal/bouncer.js": "{}",
  },
};
