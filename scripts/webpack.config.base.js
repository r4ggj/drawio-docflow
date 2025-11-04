const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const projectRoot = process.cwd();
const ReactRefreshTypeScript = require('react-refresh-typescript');
const path = require('path')
console.log(projectRoot);

module.exports = {
  target: 'web',
  stats: 'errors-only',
	resolve: {
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx', '.ts', '.tsx', 'd.ts'],
    fallback: {
      fs: false,
    },
  },
	module: {
		rules: [
      {
        test: /\.tsx?/,
        loader: 'ts-loader',
        options: {
          getCustomTransformers: () => ({
            before: [ReactRefreshTypeScript()],
          }),
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
        },
      },
			{
        test: /\.(woff|woff2|eot|ttf|otf|svg|webp)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'static/media/[name].[hash:8].[ext]',
            }
          }
        ]
      },
      {
        test: /\.(png|gif|jpg|jpeg|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '/',
              publicPath: '/'
            }
          }
        ]
      },
		],
		
	},
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new webpack.ProgressPlugin(),

  ],
}