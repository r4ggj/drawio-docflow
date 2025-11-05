const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const devConfig = require('./webpack.config.dev');
// const prodConfig = require('./webpack.config.prod');
const prodConfig = require('./webpack.config.prod');

module.exports = async (env) => {
  const hot = process.env['DEV_HOT'] ? true : false;

  const config = env === 'dev' ? devConfig({hot, RUN_ENV: 'dev'}) : prodConfig({hot,RUN_ENV:'prod'});
  return merge(config, baseConfig);
} 