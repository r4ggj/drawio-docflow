const webpack = require('webpack');
const config = require('./webpack.config.js');
const {
  init,
} = require('./index');

(async () => {
  await init()
  const mergeConfig = await config('prod');

  const compiler = webpack(mergeConfig);
  compiler.run((err, stats) => {
    if (!err) return;
    console.log('构建成功');
  });
})()