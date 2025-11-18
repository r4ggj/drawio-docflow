const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { PUBLIC_PATH } = require("./const");

module.exports = (options = {}) => {
  return {
    entry: "./src/main/webapp/index.js",
    mode: "development",
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
      publicPath: PUBLIC_PATH,
      chunkFilename: "static/js/[name].chunk.js",
      filename: "main.js",
      clean: true,
      library: `module-[name]`,
      libraryTarget: "umd",
    },
    plugins: [
      // new InitPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "../src/main/webapp/index.html"),
        filename: "index.html",
        publicPath: PUBLIC_PATH,
        // chunks: ['[name]'],
        inject: "body",
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: true,
          // minifyCSS: true,
          // minifyJS: true,
          // removeComments: true
        },
      }),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify({
          RUN_ENV: options.RUN_ENV,
        }),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.less$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [require("autoprefixer")],
                extract: false,
              },
            },
            "less-loader",
          ],
        },
        {
          test: /\.xml$/i,
          use: ["xml-loader"],
        },
      ],
    },
  };
};
