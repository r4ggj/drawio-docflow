const path = require("path");
const os = require("os");
const fs = require("fs/promises");
const { mergeFiles, replaceContent, compressJS, deleteFile } = require("./utils");

const basePath = path.join(__dirname + "/../src/main/webapp");
const mxClientSources = [];

async function mxClientMerge() {
  // 1. 读取文件内容（utf8编码）
  const content = await fs.readFile(
    path.join(basePath, "/mxgraph/src/mxClient.js"),
    "utf8"
  );
  // 2. 按系统默认换行符分割为行数组（保留原始行格式）
  const lines = content.split(os.EOL);
  const rmStartKeyword = "PREPROCESSOR-REMOVE-START";
  const rmEndKeyword = "PREPROCESSOR-REMOVE-END";
  const includeRegJKeyword = "mxClient.include(";
  const includeRegExp = /mxClient\.include\((.+)\)/;
  const mxClient = {
    basePath: path.join(basePath, "/mxgraph/src/"),
  };

  let isRmMode = false;

  // 3. 遍历行数组，删除包含指定字符串的行
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(includeRegJKeyword)) {
      const matches = lines[i].toString().match(includeRegExp);
      if (matches?.[1]) {
        const scriptPath = path.resolve(eval(matches[1]));
        mxClientSources.push(scriptPath);
        lines.splice(i, 1); // 删除包含指定字符串的行
        i--; // 调整索引，因为删除了一行
      }
    }
    if (lines[i].includes(rmStartKeyword)) {
      isRmMode = true;
    }
    if (isRmMode) {
      if (lines[i].includes(rmEndKeyword)) {
        isRmMode = false;
      }
      lines.splice(i, 1); // 删除包含指定字符串的行
      i--; // 调整索引，因为删除了一行
    }
  }

  deleteFile(basePath + "/mxgraph/mxClient.prod.js");
  deleteFile(basePath + "/mxgraph/mxClient.tmp.js");

  await mergeFiles(basePath + "/mxgraph/mxClient.tmp.js", null, false, lines.join(os.EOL) );

  await mergeFiles(
    basePath + "/mxgraph/mxClient.prod.js",
    [basePath + "/mxgraph/mxClient.tmp.js", ...mxClientSources],
    false
  );

  await compressJS(basePath + "/mxgraph/mxClient.prod.js", basePath + "/mxgraph/mxClient.prod.js");

  deleteFile(basePath + "/mxgraph/mxClient.tmp.js");
}

module.exports = mxClientMerge;
