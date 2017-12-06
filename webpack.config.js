var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: './src/index.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkHash:8].js',
  },
  resolve: {
    alias: {
      Axios: path.resolve(__dirname, './src/axios.js'),
      Store: path.resolve(__dirname, './src/store.js'),
      asyncRouter: path.resolve(__dirname, './src/asyncRouter.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|ttf|eot|svg|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 3000,
    stats: 'errors-only',
    open: true,
    proxy: {
      '/kanban/*': {
        target: 'http://123.207.142.127:8378',
        changeOrigin: true,
        pathRewrite: { '^/kanban': '' },
      },
    },
  },
  plugins: [
    new CommonsChunkPlugin({
      names: ['vendor', 'manifest'], //name是提取公共代码块后js文件的名字。
      // chunks: ['vendor'] //只有在vendor中配置的文件才会提取公共代码块至manifest的js文件中
    }),
    new HtmlWebpackPlugin({
      title: '首页',
      minify: {
        // collapseWhitespace:true
      },
      // hash: true,
      // excludeChunks:['contact'],
      chunks: ['manifest', 'vendor', 'app'],
      // chunks:['vendor','app'],
      template: './src/index.ejs', // Load a custom template (ejs by default see the FAQ for details)
    }),
  ],
};
