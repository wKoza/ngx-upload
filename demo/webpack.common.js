// root() is defined at the bottom
const path = require('path');
const webpack = require('webpack');

// Webpack Plugins
const autoprefixer = require('autoprefixer');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ENV = process.env.npm_lifecycle_event;


if (process.env.ENV != null) {
  environment = process.env.ENV
} else environment = 'DEV';


module.exports = function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Resolve
   * Reference: http://webpack.github.io/docs/configuration.html#resolve
   */
  config.resolve = {
    // only discover files that have those extensions
    extensions: ['.ts', '.js'],

    alias: {
      config: path.join(__dirname, './src/environments/environment.' + environment.toLowerCase())
    }
  };

  config.module = {
    rules: [

      // copy those assets to output
      {
        "test": /\.(eot|svg)$/,
        "loader": "file-loader?name=[name].[hash:20].[ext]"
      },
      {
        "test": /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
        "loader": "url-loader?name=[name].[hash:20].[ext]&limit=10000"
      },

      // Support for *.json files.
      {test: /\.json$/, use: 'json-loader'},


      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!postcss-loader'}),
        exclude: [root('src', 'app')]
      },


      // all css required in src/app files will be merged in js files
      {test: /\.css$/, include: root('src', 'app'), loaders: 'raw-loader!postcss-loader'},

      // support for .html as raw text
      {test: /\.html$/, use: 'raw-loader',  exclude: root('src', 'assets')}
    ]
  };

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [

    new DefinePlugin({
           'process.env': {
           'ENV': JSON.stringify(ENV)
         }
     }),
    new CopyWebpackPlugin([{
             from: 'src/assets', to: 'assets'
}]),



    // Tslint configuration for webpack 2
    new webpack.LoaderOptionsPlugin({
      options: {
        /**
         * Apply the tslint loader as pre/postLoader
         * Reference: https://github.com/wbuchwalter/tslint-loader
         */
        tslint: {
          emitErrors: true,
          failOnHint: false
        },

        /**
         * PostCSS
         * Reference: https://github.com/postcss/autoprefixer-core
         * Add vendor prefixes to your css
         */
        postcss: [
          autoprefixer({
            browsers: ['last 2 version']
          })
        ]
      }
    })
  ];

  return config;
}();

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
