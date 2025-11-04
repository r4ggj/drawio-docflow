const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');

// const {
//   packageMap,
//   init,
//   ...route
// } = require('./index')
const basePath = path.join(__dirname + '/../src/main/webapp')
module.exports = (options = {}) => {
  return {
    entry: {
      index: ['./src/main/webapp/index.js'],
    },
    mode:'production',
    devtool: 'cheap-module-source-map',
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify")
      }
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/docflow/drawio/',
      chunkFilename: 'static/js/[name].chunk.js',
      // filename: 'js/app.min.js',
      filename: (chunkData) => {
        return '[name].js'
      },
      clean: true,
      library: {
        type: 'umd'
      }
    },

    plugins: [
      // new InitPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../src/main/webapp/index.html'),
        filename: 'index.html',
        // chunks: ['[name]'],
        inject: 'body',
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true
        }
      }),
      new CopyWebpackPlugin({
        patterns: [{
            from: basePath + "/img",
            to: "img"
          },
          {
            from: basePath + "/images",
            to: "images"
          },
          {
            from: basePath + "/js",
            filter: (resourcesPath) => {
              if (/(app.min.js)|(PreConfig.js)|(PostConfig.js)|(shashapes-14-6-5.min)|(extensions.min)|(orgchart.min)/.test(resourcesPath)) {
                return true
              }
              return false
            },
            to: "js",
          },
          {
            from: basePath + "/styles",
            to: "styles"
          },
          {
            from: basePath + "/mxgraph/css",
            to: "mxgraph/css"
          },
          {
            from: basePath + "/mxgraph/images",
            to: "mxgraph/images"
          },
          {
            from: basePath + "/math",
            filter: (resourcesPath) => {
              if (/MathJax.js/.test(resourcesPath)) {
                return true
              }
              return false
            },
            to: 'math'
          },
          {
            from: basePath + "/resources",
            to: "resources"
          },
          {
            from: basePath + "/templates",
            to: "templates"
          },
          {
            from: basePath + "/math",
            filter: (resourcesPath) => {
              if (/(TeX-MML-AM_SVG-full.js)|(ontdata.js)/.test(resourcesPath)) {
                return true
              }
              return false
            },
            to: "math"
          },
        ]
      }),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify({
          RUN_ENV: options.RUN_ENV,
        })
      }),
    ],
    module: {
      rules: [{
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader',
          ]
        },
        {
          test: /\.xml$/i,
          use: ['xml-loader'],
        },
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          exclude: /node_modules/,
          terserOptions: {
            compress: {
              // warnings: true,
              // drop_console: true,
              // drop_debugger: true,
              // pure_funcs: ['console.log']
            }
          }
        })
      ]
    }
  }
}