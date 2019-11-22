const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    path: path.join(__dirname, "components", "csr-main.js"),
  },
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "public", "js")
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", "css"]
  },
  plugins: []
};
