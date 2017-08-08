const commonConfig = require('./webpack.common.js');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const path = require('path');
const nodeModules = path.join(process.cwd(), 'node_modules');

// Webpack Plugins
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AotPlugin = require('@ngtools/webpack').AotPlugin;


module.exports = webpackMerge(commonConfig, {

  devtool: 'cheap-module-source-map',

  entry: {
    'polyfills': './src/polyfills.ts',
    'main': ['./src/main.ts'],
    'styles': ['./src/styles/app.css']
  },

  output: {
    path: root('dist'),
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[id].chunk.js'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['@ngtools/webpack']
      }
    ]
  },




  plugins: [

    // Reference: https://webpack.github.io/docs/code-splitting.html
    // Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    new CommonsChunkPlugin({
      name: "vendor",
      minChunks: function (module) {
        return module.resource && module.resource.startsWith(nodeModules)
      },
      chunks: [
        "main"
      ]
    }),


    new AotPlugin({
      "mainPath": "./src/main.ts",
      "tsConfigPath": "tsconfig.app.json"
    }),


    // Inject script and link tags into html files
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
          template: './src/index.html',
          chunksSortMode: function (a, b) {
              var order = ["polyfills", "vendor", "main", "styles"];
              return order.indexOf(a.names[0]) - order.indexOf(b.names[0]);
          }
      }),

    // Extract css files
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin({filename: 'css/[name].[hash].css', disable: true})
  ],

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  devServer : {
    historyApiFallback: true,
    stats: true // none (or false), errors-only, minimal, normal (or true) and verbose
  },



  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
