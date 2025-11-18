const path = require("path");
const fs = require("fs");
const { getJsFileList } = require("./utils");
const AppMerge = require("./app.merge");
async function init() {
  await AppMerge();
}

const packageMap = {
  shapes: "js/shapes-14-6-5.min",
  extensions: "js/extensions.min",
  orgchart: "js/orgchart.min",
  app: "js/app.prod",
};

module.exports = {
  packageMap,
  init,
};
