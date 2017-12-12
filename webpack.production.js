const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackProConfig = require('./webpack.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

process.env.NODE_ENV = 'production';

module.exports = merge(webpackProConfig, {
  // entry: './src/index.prod',
  devtool: false,
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   output: {
    //     comments: false,  // remove all comments
    //   },
    //   compress: {
    //     warnings: true,
    //   }
    // }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['module', 'exports', 'require'],
      },
      sourceMap: true,
      parallel: {
        cache: true,
        workers: 2,
      },
      output: {
        comments: false,
        beautify: false,
      },
      compress: {
        warnings: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'production',
      ),
    }),
    // Transfer Files
    /*new CopyWebpackPlugin([
      {from: 'src/www/css', to: 'css'},
      {from: 'src/www/images', to: 'images'}
    ]),*/
  ],
});
