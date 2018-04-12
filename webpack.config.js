const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');

const ROOT = __dirname;
const DOCS = path.resolve(ROOT, "docs");

module.exports = {
  entry: {
    bundle: "./src/demo/index.js"
  },
  output: {
    path: DOCS,
    filename: "[name].js",
    libraryTarget: "umd"
  },
  mode: process.env.NODE_ENV || "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: DOCS,
    compress: false,
    historyApiFallback: true,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "WebUSB DMX512 Controller - Demo",
      filename: "index.html",
      template: "src/demo/index.html",
      alwaysWriteToDisk: true,
      minify: {
        collapseWhitespace: false,
        html5: false,
        minifyCSS: false,
        quoteCharacter: '"',
        removeComments: false,
        removeRedundantAttributes: false,
        removeScriptTypeAttributes: false,
        removeStyleLinkTypeAttributes: false,
        sortClassName: false,
        sortAttributes: false,
        useShortDoctype: false
      }
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: DOCS
    }),
    new FileManagerPlugin({
      onEnd: [
        {
          copy: [
            {
              source: "./docs/bundle.js",
              destination: "./dist/webusb-dmx512-controller.js" 
            },
            {
              source: "./docs/bundle.js.map",
              destination: "./dist/bundle.js.map"
            }
          ]
        }
      ]
    }),
  ]
};