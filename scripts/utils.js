let fs = require("fs");
let fsAsync = require("fs/promises");
const path = require("path");
const child_process = require("child_process");
const { minify } = require("terser");
const basePath = path.join(__dirname + "/../src/main/webapp");

/** 执行命令 */
function exec(commond, params, cwd = basePath) {
  console.time(`命令${commond} ${params}完成，花费时间`);
  const ls = child_process.spawn(commond, params, {
    cwd: cwd,
  });
  return new Promise((resolve, reject) => {
    ls.stdout.on("data", (data) => {});
    ls.stderr.on("data", (data) => {});
    ls.on("close", (code) => {
      console.timeEnd(`命令${commond} ${params}完成，花费时间`);
      resolve(code);
    });
  });
}

//获取文件夹下的所有文件
const getJsFileList = function (path) {
  const filesList = [];

  function readFileList(path, callback) {
    const files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
      const stat = fs.statSync(path + itm);
      if (stat.isDirectory()) {
        //递归读取文件
        readFileList(path + itm + "/", callback);
      } else {
        const obj = {}; //定义一个对象存放文件的路径和名字
        obj.path = path; //路径
        obj.filename = itm; //名字
        callback(obj);
      }
    });
  }

  readFileList(path, function (obj) {
    if (/\.js$/.test(obj.filename)) {
      // console.log('%c⧭', 'color: #731d6d', obj);
      filesList.push(obj.path + obj.filename);
    }
  });
  return filesList;
};

/** 读取文件合并两个文件内容 */
const mergeFiles = async (origin, source, append = true, content) => {
  // source = basePath + '/' + source
  if (!append) {
    await exec("rm", [origin]);
    await exec("touch", [origin]);
  }
  if (content) {
    fs.appendFileSync(origin, "\n" + content, function (err) {
      if (err) throw err;
    });
    return;
  }
  source.forEach((item) => {
    const sourcePath = item;
    const content = fs.readFileSync(sourcePath, "utf-8");
    fs.appendFileSync(origin, "\n" + content, function (err) {
      if (err) throw err;
    });
  });
};

const replaceContent = async (origin, replaceFn) => {
  const content = fs.readFileSync(origin, "utf-8");
  await mergeFiles(
    origin,
    null,
    false,
    replaceFn ? replaceFn(content) : content
  );
};

/**
 * 压缩JS文件
 * @param {string} inputPath - 源文件路径
 * @param {string} outputPath - 输出文件路径
 * @param {object} options - 压缩配置（可选）
 */
async function compressJS(inputPath, outputPath, userOptions = {}) {
  try {
    const code = await fsAsync.readFile(inputPath, "utf8");

    // 1. 定义默认配置（确保 comments 在顶层）
    const defaultOptions = {
      compress: {
        // 开启所有压缩优化（最小化体积）
        drop_console: true, // 移除 console.*
        dead_code: true, // 移除死代码
        drop_debugger: true, // 移除 debugger
        collapse_vars: true, // 合并变量
        reduce_vars: true, // 简化变量声明
        booleans: true, // 简化布尔运算
        comparisons: true, // 简化比较表达式
        evaluate: true, // 计算常量表达式
        loops: true, // 简化循环
        unused: true, // 移除未使用的变量/函数
      },
      mangle: {
        toplevel: false, // 禁止混淆全局标识符
        reserved: [
          // 强制保留的全局变量/方法名（按需添加）
          "globalMethod", // 全局方法
          "globalVariable", // 全局变量
          "Window",
          "document", // 浏览器内置全局（可选，防止误混淆）
        ],
        // 其他混淆选项（保持默认即可，不影响全局）
        eval: false, // 不混淆 eval 内的标识符
      },
      format: {
        comments: false, // 移除所有注释
        beautify: false, // 不美化输出（保持紧凑）
      },
    };

    // 2. 正确合并用户配置（子选项单独合并）
    const finalOptions = {
      ...defaultOptions,
      ...userOptions, // 覆盖顶层选项（如用户自定义 comments）
      format: {
        ...defaultOptions.format,
        ...userOptions.format, // 合并子选项（如用户自定义 beautify）
      },
    };

    // 3. 执行压缩
    const result = await minify(code, finalOptions);

    if (result.error) {
      throw new Error(`压缩失败：${result.error.message}`);
    }

    const resultCode = result.code
      .replace(/^\s*$/gm, "") // 移除空行（仅含空格/制表符的行）
      .replace(/\n{2,}/g, "\n"); // 连续换行最多保留1个（避免过多空行）

    // 4. 写入结果
    await fsAsync.writeFile(outputPath, resultCode, "utf8");
    console.log(`压缩完成：${outputPath}`);
  } catch (err) {
    console.error("压缩JS时出错：", err);
  }
}

function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = {
  getJsFileList,
  mergeFiles,
  exec,
  replaceContent,
  compressJS,
  deleteFile,
};
// const basePath = path.join(__dirname + '/../src/main/webapp')
// console.log(getJsFileList(basePath + '/shapes/'));
