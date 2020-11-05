const webpack = require('webpack');
const path = require('path');
const env = process.env.NODE_ENV;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

let config = {
  mode: env || 'production',
  entry: './src/index.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, './public'),
    filename: './js/memory.js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/memory.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false, sourceMap: true } },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
    ],
  }
};

// Return Array of Configurations
module.exports = config;
