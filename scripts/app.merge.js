const path = require("path");
const os = require("os");
const fs = require("fs/promises");
const {
  mergeFiles,
  replaceContent,
  compressJS,
  exec,
  deleteFile,
} = require("./utils");
const mxClientMerge = require("./mxClient.merge");

const basePath = path.join(__dirname + "/../src/main/webapp");

async function AppMerge() {
  // 1. 读取文件内容（utf8编码）
  const content = await fs.readFile(
    path.join(basePath, "/js/diagramly/Devel.prod.js"),
    "utf8"
  );
  // 2. 按系统默认换行符分割为行数组（保留原始行格式）
  const lines = content.split(os.EOL);
  const mxscriptKeyword = "mxscript(";
  const mxscriptRegExp = "mxscript((.+))";

  // 别删，给exec用的
  const drawDevUrl = path.join(basePath, "") + "/";
  // 别删，给exec用的
  const geBasePath = path.join(basePath, "js/grapheditor/") + "/";

  // 3. 遍历行数组，删除包含指定字符串的行
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes(mxscriptKeyword)) {
      const matches = lines[i].toString().match(mxscriptRegExp);
      if (matches?.[1]) {
        if (lines[i].toString().trim().startsWith("//")) {
          continue;
        }
        const scriptPath = path.resolve(eval(matches[1]));
        const scriptContent = await fs.readFile(scriptPath, "utf8");
        lines.splice(i, 1, scriptContent);
      }
    }
  }

  await mxClientMerge();

  await mergeFiles(
    basePath + "/js/app.tmp.js",
    [
      basePath + "/js/diagramly/Init.js",
      basePath + "/js/grapheditor/Init.js",
      basePath + "/mxgraph/mxClient.prod.js",
    ],
    false
  );

  deleteFile(path.join(basePath, "/mxgraph/mxClient.prod.js"));

  await replaceContent(basePath + "/js/app.tmp.js", (content) => {
    // 补充一些变量，不然访问未定义变量报错
    return [
      `
      window.mxBasePath = window.mxBasePath || undefined;
      window.DropboxFile = window.DropboxFile || undefined;
      window.GitHubFile = window.GitHubFile || undefined;
      window.OneDriveFile = window.OneDriveFile || undefined;
      window.TrelloFile = window.TrelloFile || undefined;
      window.GitLabFile = window.GitLabFile || undefined;
      `,
      content,
      lines.join(os.EOL),
    ].join(os.EOL);
  });

  deleteFile(path.join(basePath, "/js/app.prod.js"));

  await compressJS(basePath + "/js/app.tmp.js", basePath + "/js/app.prod.js");

  deleteFile(basePath + "/js/app.tmp.js");
}

module.exports = AppMerge;
