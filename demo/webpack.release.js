const commonConfig = require('./webpack.common.js');

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

// Webpack Plugins
const ModuleConcatenationPlugin = webpack.optimize.ModuleConcatenationPlugin;
const NoEmitOnErrorsPlugin = webpack.NoEmitOnErrorsPlugin;
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

module.exports = webpackMerge(commonConfig, {

    devtool: 'source-map',

    mode: 'production',

    entry: {
        'polyfills': './src/polyfills.ts',
        'ie-polyfills': './src/ie-polyfills.ts',
        'main': ['./src/main.ts', './src/styles/app.css']
    },

    output: {
        path: root('dist'),
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[id].chunk.js'
    },

    module: {
        rules: [

            {
                'test': /\.(eot|svg|cur)$/,
                'loader': 'file-loader',
                'options': {
                    'name': 'assets/[name].[hash:20].[ext]'
                }
            },
            {
                'test': /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                'loader': 'url-loader',
                'options': {
                    'name': 'assets/[name].[hash:20].[ext]',
                    'limit': 10000
                }
            },

            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ],
                include: [root('src', 'styles')]
            },
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loaders: ['@ngtools/webpack']
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
    optimization: {
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    enforce: true
                }
            }
        },
        minimizer: [
            new UglifyJsWebpackPlugin({
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                    mangle: true,
                    compress: {
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
                },
                extractComments: true
            })
        ]
    },

    plugins: [

        // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
        // Only emit files when there are no errors
        new NoEmitOnErrorsPlugin(),

        new ProgressPlugin(),

        new OptimizeCssAssetsPlugin(),

        new AngularCompilerPlugin({
            'mainPath': './src/main.ts',
            'tsConfigPath': './tsconfig.app.json'
        }),

        // Inject script and link tags into html files
        // Reference: https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            template: './src/index.html',
            excludeAssets: [/ie-polyfills.*.js/],
            chunksSortMode: function (a, b) {
                const order = ["polyfills", "vendor", "main"];
                return order.indexOf(a.names[0]) - order.indexOf(b.names[0]);
            }
        }),
        new HtmlWebpackExcludeAssetsPlugin(),

        // Extract css files
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[hash].css',
            chunkFilename: "[id].[hash].css"
        }),

        new ModuleConcatenationPlugin(),

        new PurifyPlugin()

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
