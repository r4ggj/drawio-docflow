const path = require('path');
const fs = require('fs');
const {
  getJsFileList,
  mergeFiles,
  exec,
  replaceContent
} = require('./utils')


const basePath = path.join(__dirname + '/../src/main/webapp')
const joinPath = (path, name) => `${basePath}${path}/${name}.js`
const version = fs.readFileSync(path.join(__dirname, '../VERSION')).toString().trim()
const shapes = []

if(fs.existsSync(basePath + '/shapes/')){
  shapes.push(...getJsFileList(basePath + '/shapes/'))
}
if(fs.existsSync(basePath + '/stencils/')){
  shapes.push(...getJsFileList(basePath + '/stencils/'))
}

const sidebar = getJsFileList(basePath + '/js/diagramly/sidebar/')
const grapheditor = ['Editor', 'EditorUi', 'Sidebar', 'Graph', 'Format', 'Shapes', 'Actions', 'Menus', 'Toolbar', 'Dialogs'].map(item => joinPath('/js/grapheditor', item))
const client = ['js/deflate/base64', 'js/diagramly/Init', 'js/grapheditor/Init', 'mxgraph/mxClient', 
  // 'js/jscolor/jscolor'
].map(item => joinPath('', item))

// SketchExtraTheme 是从drawio官网提取的，增加sketch等主题
const grapheditorTemp = [
  ...['Editor', 'EditorUi', 'Graph', 'Shapes', 'Actions'].map(item => joinPath('/js/grapheditor', item)),
  ...['DrawioFile', 'LocalFile', 'Editor', 'EditorUi', 'Pages', 'Trees', 'Minimal', 'SketchExtraTheme','DrawioComment', 'DrawioUser'].map(item => joinPath('/js/diagramly', item)),
  ...['Graph-Resources', 'Graph-Stylesheet', 'js/diagramly/GraphViewer'].map(item => joinPath('', item))
]
const baseView = [
  'tmp0',
  'js/spin/spin.min',
  'js/sanitizer/purify.min',
  'js/deflate/pako.min',
  'js/rough/rough.min',
  'client.min',
  'tmp1'
].map(item => joinPath('', item))

const viewer = ['base-viewer.min', 'tmp2'].map(item => joinPath('', item))
const viewerStatic = ['base-viewer.min', 'js/shapes-14-6-5.min', 'tmp3', 'tmp2'].map(item => joinPath('', item))
const diagramlyTemp1 = [...['DrawioFile', 'LocalFile', 'LocalLibrary', 'StorageFile', 'StorageLibrary', 'RemoteFile', 'RemoteLibrary', 'UrlLibrary', 'EmbedFile', 'Dialogs', 'Editor', 'EditorUi', 'DiffSync', 'Settings', 'DrawioFileSync'].map(item => joinPath('/js/diagramly', item)), basePath + '/Graph-Stylesheet.js']
const baseMin = [
  ...['js/spin/spin.min.js', 
    'js/sanitizer/purify.min.js',
     'js/cryptojs/aes.min.js', 'js/deflate/pako.min.js', 'js/rough/rough.min.js'].map(item => basePath + '/' + item),
  ...['client.min', 'grapheditor.min', 'sidebar.min', 'tmp1'].map(item => joinPath('', item))
]
const extensions = [
  basePath + '/js/diagramly/Extensions.js',
  ...['VsdxExport', 'mxVsdxCanvas2D', 'bmpDecoder', 'importer'].map(item => joinPath('/js/diagramly/vsdx', item)),
  basePath + '/js/diagramly/graphml/mxGraphMlCodec.js'
]

const orgchart = ['bridge.min', 'bridge.collections.min', 'OrgChart.Layout.min', 'mxOrgChartLayout'].map(item => joinPath('/js/orgchart', item))
const extensionsPlus = ['/js/jszip/jszip.min', '/js/mermaid/mermaid.min', '/js/orgchart.min'].map(item => joinPath('', item))

const tmp1 = [...[
    'DrawioFile',
    'LocalFile',
    'LocalLibrary',
    'StorageFile',
    'StorageLibrary',
    'RemoteFile',
    'RemoteLibrary',
    'UrlLibrary',
    'EmbedFile',
    'Dialogs',
    'Editor',
    'EditorUi',
    'DiffSync',
    'Settings',
    'DrawioFileSync',
    'DrawioClient',
    'DrawioUser',
    'DriveFile',
    'DriveLibrary',
    'DriveClient',
    'DropboxFile',
    'DropboxLibrary',
    'DropboxClient',
    'OneDriveFile',
    'OneDriveLibrary',
    'OneDriveClient',
    'GitHubFile',
    'GitHubLibrary',
    'GitHubClient',
    'TrelloFile',
    'TrelloLibrary',
    'TrelloClient',
    'GitLabFile',
    'GitLabLibrary',
    'GitLabClient',
    // 'NotionFile',
    // 'NotionLibrary',
    // 'NotionClient',
    'DrawioComment',
    'DriveComment',
    'App',
    'Menus',
    'Pages',
    'Trees',
    'Minimal',
    'SketchExtraTheme', // 这个文件很关键，是从官网提取的hook，拓展代码，增加了sketch等主题
    'DistanceGuides',
    'mxRuler',
    'mxFreehand',
  ].map(item => joinPath('/js/diagramly', item)),
  basePath + '/Graph-Stylesheet.js',
  basePath + '/js/diagramly/util/mxAsyncCanvas.js',
  basePath + '/js/diagramly/util/mxJsCanvas.js',
  basePath + '/js/onedrive/mxODPicker.js'
]
// const stencils = [...getJsFileList(basePath + '/stencils/'), basePath + '/js/stencils.min.js']
async function init() {
  // 1.合并shapes和stencils下的所有js文件
  // 暂时不处理shapes了，最新的源代码把shapes源码干掉了，使用了压缩文件，直接用
  // await mergeFiles(basePath + '/js/shapes-14-6-5.min.js', shapes, false)
  // 2.<target name="app" depends="merge">
  // 2.1添加环境变量
  await mergeFiles(basePath + '/tmp0.js', null, false, `
      window.PROXY_URL = window.PROXY_URL || 'https://viewer.diagrams.net/proxy';
			window.SHAPES_PATH = window.SHAPES_PATH || 'https://viewer.diagrams.net/shapes';
			window.STENCIL_PATH = window.STENCIL_PATH || 'https://viewer.diagrams.net/stencils';
			window.GRAPH_IMAGE_PATH  = window.GRAPH_IMAGE_PATH || 'https://viewer.diagrams.net/img';
			window.mxImageBasePath = window.mxImageBasePath || 'https://viewer.diagrams.net/mxgraph/images';
			window.mxBasePath = window.mxBasePath || 'https://viewer.diagrams.net/mxgraph/';
			window.mxLoadStylesheets = window.mxLoadStylesheets || false;
  `)
  // 2.2格式化Graph-Stylesheet
  await mergeFiles(basePath + '/tmp1.js', [basePath + '/styles/default.xml'], false)
  await replaceContent(basePath + '/tmp1.js', function (content) {
    return content.replace(/${line.separator}/g, version).replace(/\t/g, '').replace(/'/g, "\\\\'")
  })

  await mergeFiles(basePath + '/Graph-Stylesheet.js', null, false, `Graph.prototype.defaultThemes['default-style2'] = mxUtils.parseXml(\``)
  await mergeFiles(basePath + '/Graph-Stylesheet.js', [basePath + '/styles/default.xml'])
  await mergeFiles(basePath + '/Graph-Stylesheet.js', null, true, `
  \`).documentElement;
  Graph.prototype.defaultThemes['darkTheme'] = Graph.prototype.defaultThemes['default-style2'];`)

  await exec('rm', [basePath + '/tmp1.js'])
  // 2.3格式化Graph-Resources
  await mergeFiles(basePath + '/tmp1.js', [basePath + '/resources/dia.txt'], false)
  await mergeFiles(basePath + '/Graph-Resources.js', null, false, `mxResources.parse(\``)
  await mergeFiles(basePath + '/Graph-Resources.js', [basePath + '/resources/dia.txt'])
  await mergeFiles(basePath + '/Graph-Resources.js', null, true, `\`);`)
  await replaceContent(basePath + '/tmp1.js', function (content) {
    return content.replace(/${line.separator}/g, '\\\\n').replace(/'/g, "\\\\'")
  })
  await exec('rm', [basePath + '/tmp1.js'])

  // 需要构建: 被base-viewer引入
  await mergeFiles(basePath + '/grapheditor.min.js', grapheditor, false)
  await mergeFiles(basePath + '/sidebar.min.js', sidebar, false)
  await mergeFiles(basePath + '/client.min.js', client, false);
  await mergeFiles(basePath + '/tmp1.js', grapheditorTemp, false);

  // 需要构建: base-viewer引入
  await mergeFiles(basePath + '/base-viewer.min.js', baseView, false);
  await replaceContent(basePath + '/base-viewer.min.js', function (content) {
    return content.replace(/@DRAWIO-VERSION@/g, version)
  })

  // 需要构建
  await mergeFiles(basePath + '/tmp2.js', null, false, `(function()
  {
    Editor.initMath();
    GraphViewer.initCss();
  })();`)

  await mergeFiles(basePath + '/js/viewer.min.js', viewer, false)

  await mergeFiles(basePath + '/tmp3.js', null, false, `
  mxStencilRegistry.allowEval = false;
  (function()
  {
    try
    {
      if (Editor.enableServiceWorker)
      {
        navigator.serviceWorker.register('/service-worker.js');
      }
    }
    catch (e)
    {
      if (window.console != null)
      {
        console.error(e);
      }
    }
  })();
  `)

  await mergeFiles(basePath + '/js/viewer-static.min.js', viewerStatic, false);
  ['tmp0', 'tmp1', 'tmp2', 'tmp3'].forEach(item => exec('rm', [joinPath('', item)]))
  // await exec('rm', [delArr])

  await mergeFiles(basePath + '/tmp1.js', diagramlyTemp1, false)

  await exec('rm', [basePath + '/base.min.js'])
  // 需要编译 引用tmp1
  await mergeFiles(basePath + '/base.min.js', baseMin, false)
  await replaceContent(basePath + '/base.min.js', function (content) {
    return content.replace(/@DRAWIO-VERSION@/g, version)
  })

  // 需要编译
  await mergeFiles(basePath + '/js/extensions.min.js', extensions, false)

  // 需要编译
  await mergeFiles(basePath + '/js/orgchart.min.js', orgchart, false)
  await mergeFiles(basePath + '/js/extensions.min.js', extensionsPlus, true)
  await exec('rm', [basePath + '/tmp1.js'])


  await mergeFiles(basePath + '/tmp1.js', tmp1, false)
  // 需要编译
  await exec('rm', [basePath + '/js/app.min.js'])
  await mergeFiles(basePath + '/js/app.min.js', [basePath + '/base.min.js'], false)
  await mergeFiles(basePath + '/js/app.min.js', [ basePath + '/tmp1.js' ], false)
  await replaceContent(basePath + '/js/app.min.js', function (content) {
    return content.replace(/@DRAWIO-VERSION@/g, version)
  });

  ['Graph-Stylesheet',
    'Graph-Resources',
    'grapheditor.min',
    'sidebar.min',
    'client.min',
    'tmp1'
  ].forEach(item => exec('rm', [joinPath('', item)]))
}

const packageMap = {
  shapes: 'js/shapes-14-6-5.min',
  baseViewer: 'base-viewer.min',
  viewer: 'js/viewer.min',
  viewerStatic: 'js/viewer-static.min',
  base: 'base.min',
  extensions: 'js/extensions.min',
  orgchart: 'js/orgchart.min',
  app: 'js/app.prod',
}

// const resApp = [
//   ...['js/spin/spin.min.js', 'js/sanitizer/sanitizer.min.js', 'js/cryptojs/aes.min.js', 'js/deflate/pako.min.js', 'js/rough/rough.min.js'].map(item => basePath + '/' + item),
//   ...client, ...grapheditor, ...sidebar,...tmp1,
// ]


module.exports = {
  packageMap,
  init,
  // app:joinPath('','/js/app.min'),
  // shapes:joinPath('','/js/shapes-14-6-5.min'),
  // baseViewer:joinPath('','/base-viewer.min'),
  // viewer:joinPath('','/js/viewer.min'),
  // viewerStatic:joinPath('','/js/viewer-static.min'),
  // base:joinPath('','/base.min'),
  // extensions:joinPath('','/js/extensions.min'),
  // orgchart:joinPath('','/js/orgchart.min'),
}