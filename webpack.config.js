var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(env) {
  return {
    entry: [
      './src/index.js'
    ],
    devtool: "source-map",
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: path.resolve(__dirname, 'dist', 'assets')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        },
        {
          test: /\.png$/,
          use: { loader: 'url-loader', options: { limit: 100000 } },
        },
        {
          test: /\.jpg$/,
          use: [ 'file-loader' ]
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          use: [ 'file-loader' ]
        }
      ]
    },
    plugins: [new HtmlWebpackPlugin({
      title: 'TileMap',
      template: 'src/index.html'
    })],
    devServer: {
      port: 8998,
      stats: 'errors-only',
      historyApiFallback: {
        index: path.resolve(__dirname, 'dist', 'assets')
      }
    }
  };
};
