var commonConfig = require('./webpack.common.js');

var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');

const nodeModules = path.join(process.cwd(), 'node_modules');

// Webpack Plugins
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const NoEmitOnErrorsPlugin = webpack.NoEmitOnErrorsPlugin;
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");
const AotPlugin = require('@ngtools/webpack').AotPlugin;

const ProgressPlugin = require('webpack/lib/ProgressPlugin');

const autoprefixer = require('autoprefixer');

module.exports = webpackMerge(commonConfig, {

    devtool: 'source-map',


    entry: {
        'polyfills': './src/polyfills.ts',
        'main': ['./src/main.ts'],
        'styles': ['./src/styles/app.css']
    },

    output: {
        path: root('dist'),
        filename: 'js/[name].[hash].js',
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

        new NoEmitOnErrorsPlugin(),

        new ProgressPlugin(),

        new CommonsChunkPlugin({
            name: "vendor",
            minChunks: function (module) {
                return module.resource && module.resource.startsWith(nodeModules)
            },
            chunks: [
                "main"
            ]
        }),
        // Extract css files
        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Disabled when in test mode or not in build mode
        new ExtractTextPlugin({filename: 'css/[name].[hash].css'}),

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

        // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
        // Minify all javascript, switch loaders to minimizing mode
        new UglifyJsPlugin({
            sourceMap: true,
            beautify: false,
            output: {
                comments: false
            },
            mangle: {
                screw_ie8: true
            },
            compress: {
                screw_ie8: true,
                warnings: false,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
                negate_iife: false
            }
        }),

        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })

    ],
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
