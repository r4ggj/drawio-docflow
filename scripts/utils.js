let fs = require('fs');
const path = require('path')
const child_process = require('child_process');
const basePath = path.join(__dirname + '/../src/main/webapp')


/** 执行命令 */
function exec(commond, params, cwd = basePath) {
  console.time(`命令${commond} ${params}完成，花费时间`)
  const ls = child_process.spawn(commond, params, {
    cwd: cwd
  })
  return new Promise((resolve, reject) => {
    ls.stdout.on('data', (data) => {})
    ls.stderr.on('data', (data) => {})
    ls.on('close', (code) => {
      console.timeEnd(`命令${commond} ${params}完成，花费时间`)
      resolve(code);
    });
  })
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
        readFileList(path + itm + "/", callback)
      } else {
        const obj = {}; //定义一个对象存放文件的路径和名字
        obj.path = path; //路径
        obj.filename = itm //名字
        callback(obj)
      }
    })
  }

  readFileList(path, function (obj) {
    if (/\.js$/.test(obj.filename)) {
      // console.log('%c⧭', 'color: #731d6d', obj);
      filesList.push(obj.path + obj.filename)
    }
  });
  return filesList;
}




/** 读取文件合并两个文件内容 */
const mergeFiles = async (origin, source, append = true, content) => {
  // source = basePath + '/' + source
  if (!append) {
    await exec('rm', [origin])
    await exec('touch', [origin])
  }
  if (content) {
    fs.appendFileSync(origin, '\n' + content, function (err) {
      if (err) throw err;
    });
    return
  }
  source.forEach(item => {
    const sourcePath = item
    const content = fs.readFileSync(sourcePath, 'utf-8')
    fs.appendFileSync(origin, '\n' + content, function (err) {
      if (err) throw err;
    });
  })
}


const replaceContent = async (origin, replaceFn) => {
  const content = fs.readFileSync(origin, 'utf-8')
  await mergeFiles(origin, null, false, replaceFn ? replaceFn(content) : content)
}




module.exports = {
  getJsFileList,
  mergeFiles,
  exec,
  replaceContent
}
// const basePath = path.join(__dirname + '/../src/main/webapp')
// console.log(getJsFileList(basePath + '/shapes/'));