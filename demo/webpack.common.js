// root() is defined at the bottom
const path = require('path');
const webpack = require('webpack');
const rxPaths = require('rxjs/_esm5/path-mapping');

// Webpack Plugins
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');


if (process.env.ENV != null) {
    environment = process.env.ENV
} else environment = 'DEV';


module.exports = function makeWebpackConfig() {
    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    let config = {};

    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     */
    config.resolve = {
        // only discover files that have those extensions
        extensions: ['.ts', '.js'],

        alias: Object.assign({
            config: path.join(__dirname, './src/environments/environment.' + environment.toLowerCase())
        }, rxPaths())
    };

    config.module = {
        rules: [

            {
                test: /\.css$/,
                use: ['to-string-loader', 'css-loader'],
                exclude: [root('src', 'styles')]
            },
            // For Material
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            // Support for *.json files.
            {test: /\.json$/, loader: 'json-loader'},
            // support for .html as raw text
            {test: /\.html$/, loader: 'raw-loader'},
            {
                // Remove this when Angular drop System.import()
                test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                parser: {system: true}
            }
        ]
    };

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [

        new CopyWebpackPlugin([{
            from: 'src/assets', to: 'assets'
        }], {
            'ignore': [
                '.gitkeep'
            ],
            'debug': 'warning'
        }),

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
