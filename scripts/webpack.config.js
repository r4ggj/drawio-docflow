const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.config.base");
const devConfig = require("./webpack.config.dev");
const prodConfig = require("./webpack.config.prod");
const { DEV_HOT, RUN_ENV } = require("./const");

module.exports = async (env) => {
  const hot = DEV_HOT ? true : false;

  const config =
    env === "dev"
      ? devConfig({ hot, RUN_ENV: RUN_ENV })
      : prodConfig({ hot, RUN_ENV: "prod" });

  return merge(config, baseConfig);
};
