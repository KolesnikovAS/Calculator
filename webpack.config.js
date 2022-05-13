const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TSLintPlugin = require('tslint-webpack-plugin');

module.exports = {
  entry: "./src/index.tsx",
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index_bundle.js"
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new TSLintPlugin({
      files: ['./src/**/*.tsx']
    })
  ]
};