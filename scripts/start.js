const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const execSync = require('child_process').execSync;
const config = require('./webpack.config.js');
const open = require('open');
const path = require('path');
const HOT_ENV = process.env.HOT_ENV;

let hots = {}

if (!HOT_ENV) {
  hots.hot = true;
}

console.log('%c⧭', 'color: #eeff00', __dirname);
const options = {
  // hot: 'only',
  hot: true,
  historyApiFallback: true,
  static: [path.join(__dirname, '../src/main/webapp')],
  // stats: 'errors-only',
  // disableHostCheck: true,
  // inline: true,
  // injectHot: true,
  // hotOnly: true,
  // host: '172.17.229.216:3000',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  // proxy: {
  //   "/": { // 这是请求接口中要替换的标识
  //     target: 'http://172.16.2.96/docflow/drawio', // 被替换的目标地址，即把 /api 替换成这个
  //     pathRewrite: { "^/": "" },
  //     secure: false, // 若代理的地址是https协议，需要配置这个属性
  //   }
  // },
  ...hots
};

(async () => {

  const port = 2302;


  const mergeConfig = await config('dev');


  const compiler = webpack(mergeConfig);
  const server = new webpackDevServer(compiler, options);

  server.listen(port, '0.0.0.0', () => {
    console.log('dev server listening on port 2301');
  });

  const supportedChromiumBrowsers = [
    'Google Chrome Canary',
    'Google Chrome Dev',
    'Google Chrome Beta',
    'Google Chrome',
    'Microsoft Edge',
    'Brave Browser',
    'Vivaldi',
    'Chromium',
  ];

  // for (let chromiumBrowser of supportedChromiumBrowsers) {
  //   try {
  //     // Try our best to reuse existing tab
  //     // on OSX Chromium-based browser with AppleScript
  //     execSync('ps cax | grep "' + chromiumBrowser + '"');
  //     execSync(
  //       'osascript openChrome.applescript "' +
  //         encodeURI("http://localhost:3000") +
  //         '" "' +
  //         chromiumBrowser +
  //         '"',
  //       {
  //         cwd: __dirname,
  //         stdio: 'ignore',
  //       }
  //     );
  //     return true;
  //   } catch (err) {
  //     // console.log('error', err)
  //     // Ignore errors.
  //   }
  // }
  open(`http://localhost:${port}`, {
    app: {
      name: open.apps.chrome,
      wait: false,
      // arguments: ['--incognito'],
      url: true
    }
  });
})()