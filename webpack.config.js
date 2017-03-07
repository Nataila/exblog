var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = [
  {
    name: 'server',
    entry: './bin/www',
    node: {
      __dirname: false,
    },
    target: 'node',
    output: {
      path: './dist',
      filename: 'server.js'
    },
    externals: nodeModules,
    module: {
      loaders: [
        {test: /\.js$/,exclude: /node_modules/,loader: 'babel-loader'},
        {test: /\.css$/, loader: 'style-loader!css-loader'},
        {test: /\.sass$/, loader: 'style-loader!css-loader!sass-loader'},
      ],
    },
  },
  {
    name: 'client',
    entry: './public/client.js',
    output: {
      path: './public/dist',
      filename: 'bundle.js'
    },
    externals: nodeModules,
    module: {
      loaders: [
        {test: /\.js$/,exclude: /node_modules/,loader: 'babel-loader'},
        {test: /\.css$/, loader: 'style-loader!css-loader'},
        {test: /\.sass$/, loader: 'style-loader!css-loader!sass-loader'},
        {test: /\.woff|\.woff2|\.svg|.eot|\.ttf|\.jpg/, loader: 'url-loader?prefix=font/&limit=10000'},
      ],
    },
  },
];
