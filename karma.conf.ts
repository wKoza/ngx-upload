import * as webpack from 'webpack';
import * as path from 'path';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export default config => {

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'karma-shim.ts'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'karma-shim.ts': ['webpack', 'sourcemap']
    },

    webpack: {
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [{
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            transpileOnly: !config.singleRun
          }
        }, {
          test: /src\/.+\.ts$/,
          exclude: /(node_modules|\.spec\.ts$)/,
          loader: 'istanbul-instrumenter-loader',
          enforce: 'post'
        }]
      },
      node: {
        fs: 'empty'
      },
      plugins: [
        new webpack.SourceMapDevToolPlugin({
          filename: null,
          test: /\.(ts|js)($|\?)/i
        }),
        new webpack.ContextReplacementPlugin(
          /angular(\\|\/)core(\\|\/)@angular/,
          path.join(__dirname, 'src')
        ),
        ...(config.singleRun ? [
          new webpack.NoEmitOnErrorsPlugin()
        ] : [
          new ForkTsCheckerWebpackPlugin({
            watch: ['./src', './test']
          })
        ])
      ]
    },

    mochaReporter: {
      showDiff: true,
      output: 'autowatch'
    },

    coverageIstanbulReporter: {
      reports: ['text-summary', 'html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },

    mime: {
      'text/x-typescript': ['ts']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage-istanbul'],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome']

  });

};
