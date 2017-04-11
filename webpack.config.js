const webpack = require('webpack')
const HtmlWebpackPLugin = require('html-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const autoprefixer = require('autoprefixer')

const debug = process.env.NODE_ENV !== 'production'

module.exports = {
  context: `${__dirname}/src`,
  devtool: debug ? 'cheap-module-eval-source-map' : 'source-map',
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      './client.js',
    ],
  },
  output: {
    path: `${__dirname}/public`,
    filename: debug ? '[name].js' : '[name].[chunkhash].js',
    publicPath: '/',
  },
  performance: {
    hints: false,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              importLoaders: 2,
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer(),
              ],
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: {
          loader: 'svg-sprite-loader',
          options: {
            name: '[name]',
          },
        },
      },
    ],
  },
  plugins: debug ? [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPLugin({
      template: './index.html',
    }),
  ] : [
    new webpack.EnvironmentPlugin('NODE_ENV'),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPLugin({
      template: './index.html',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && module.context.indexOf('node_modules') !== -1,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      mangle: true,
      sourcemap: true,
    }),
    new CopyWebpackPlugin([
      { from: 'manifest.json' },
    ]),
    new OfflinePlugin({
      version: '[hash]',
      AppCache: false,
      ServiceWorker: {
        events: true,
      },
    }),
  ],
  devServer: {
    contentBase: `${__dirname}/src`,
    historyApiFallback: true,
    hot: true,
    quiet: true,
  },
}
