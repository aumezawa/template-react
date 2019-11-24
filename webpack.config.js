const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    bundle: path.join(__dirname, "components", "csr-main.js"),
  },
  output: {
    filename: "[name].js",
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
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [
                  require("precss"),
                  require("autoprefixer")
                ];
              }
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", "css", "scss"]
  },
  plugins: []
};
