var commonConfig = require('./webpack.common.js');

var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');

const nodeModules = path.join(process.cwd(), 'node_modules');

// Webpack Plugins
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const ModuleConcatenationPlugin = webpack.optimize.ModuleConcatenationPlugin;
const NoEmitOnErrorsPlugin = webpack.NoEmitOnErrorsPlugin;
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;
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
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[id].chunk.js'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                }),
                include: [root('src', 'styles')]
            },
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loader: '@ngtools/webpack'
            },
            {
                test: /\.js$/,
                loader: '@angular-devkit/build-optimizer/webpack-loader',
                options: {
                    sourceMap: false
                }
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

        new AngularCompilerPlugin({
            "mainPath": "src/main.ts",
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

        new ModuleConcatenationPlugin(),

        new PurifyPlugin(),

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
                negate_iife: false,
                pure_getters: true,
                passes: 3
            }
        })

    ],
    node: {
        global: true,
        crypto: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    },

    stats: {
        colors: true,
        hash: true,
        timings: true,
        chunkModules: false,
        modules: true,
        maxModules: 0,
        reasons: false,
        warnings: true,
        version: false,
        assets: true,
        chunks: false,
        children: false
    }
});

// Helper functions
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}
