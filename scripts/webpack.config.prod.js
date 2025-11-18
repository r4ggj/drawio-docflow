const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const { deleteFile } = require("./utils");
const basePath = path.join(__dirname + "/../src/main/webapp");

module.exports = (options = {}) => {
  return {
    entry: {
      index: ["./src/main/webapp/index.js"],
    },
    mode: "production",
    devtool: "cheap-module-source-map",
    resolve: {
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
      },
    },
    output: {
      path: path.resolve(__dirname, "../dist"),
      publicPath: "/docflow/drawio/",
      chunkFilename: "static/js/[name].chunk.js",
      // filename: 'js/app.min.js',
      filename: (chunkData) => {
        return "[name].js";
      },
      clean: true,
      library: {
        type: "umd",
      },
    },

    plugins: [
      // new InitPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "../src/main/webapp/index.html"),
        filename: "index.html",
        // chunks: ['[name]'],
        inject: "body",
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: basePath + "/img",
            to: "img",
          },
          {
            from: basePath + "/images",
            to: "images",
          },
          {
            from: basePath + "/js",
            filter: (resourcesPath) => {
              if (
                /(app.min.js)|(app.prod.js)|(PreConfig.js)|(PostConfig.js)|(shapes-14-6-5.min)|(shapes.min)|(stencils.min)|(extensions.min)|(orgchart.min)/.test(
                  resourcesPath
                )
              ) {
                return true;
              }
              return false;
            },
            to: "js",
          },
          {
            from: basePath + "/styles",
            to: "styles",
          },
          {
            from: basePath + "/mxgraph/css",
            to: "mxgraph/css",
          },
          {
            from: basePath + "/mxgraph/images",
            to: "mxgraph/images",
          },
          {
            from: basePath + "/math",
            to: "math",
          },
          {
            from: basePath + "/resources",
            to: "resources",
          },
          {
            from: basePath + "/templates",
            to: "templates",
          },
        ],
      }),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify({
          RUN_ENV: options.RUN_ENV,
        }),
      }),
      {
        apply: (compiler) => {
          compiler.hooks.done.tap("MyAfterBuildPlugin", (stats) => {
            deleteFile(
              path.join(__dirname, "../src/main/webapp/js/app.prod.js")
            );
            console.log("\n webpack 编译完成\n");
          });
        },
      },
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.less$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.xml$/i,
          use: ["xml-loader"],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          exclude: /(node_modules)|(embed\.dev\.js)/,
          terserOptions: {
            compress: {
              drop_console: true, // 移除console
              drop_debugger: true, // 移除debugger
              // 高级压缩：合并连续变量声明、简化条件判断等
              collapse_vars: true,
              reduce_vars: true,
            },
            mangle: {
              // 混淆选项：默认混淆变量，但保留类名（避免反射问题）
              keep_classnames: false, // 按需开启
            },
            output: {
              // 输出优化：移除注释、简化空格
              comments: false,
              ascii_only: true, // 避免非ASCII字符（可选）
            },
          },
        }),
      ],
    },
  };
};
