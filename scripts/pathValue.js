const path = require('path');
const {
  getJsFileList
} = require('./utils')
const basePath = path.join(__dirname + '/../src/main/webapp')

const packageMap = {
  shapes: 'shapes-14-6-5.min.js',
  grapheditor: 'grapheditor.min.js',
  sidebar: 'sidebar.min.js',
  client: 'client.min.js',
  stencils: 'stencils.min.js',
  app: 'app.min.js',
  base: 'base.min.js'
}


const shapes = [...getJsFileList(basePath + '/shapes/'), ...getJsFileList(basePath + '/stencils/')]
const sidebar = getJsFileList(basePath + '/js/diagramly/sidebar/')
const grapheditor = ['Editor', 'EditorUi', 'Sidebar', 'Graph', 'Format', 'Shapes', 'Actions', 'Menus', 'Toolbar', 'Dialogs'].map(item => `${basePath}/js/grapheditor/${item}.js`)
const client = ['js/deflate/base64', 'js/diagramly/Init', 'js/grapheditor/Init', 'mxgraph/mxClient', 'js/jscolor/jscolor'].map(item => `${basePath}/${item}.js`)
const temp1 = ['DrawioFile', 'LocalFile', 'LocalLibrary', 'StorageFile', 'StorageLibrary', 'RemoteFile', 'RemoteLibrary', 'UrlLibrary', 'EmbedFile', 'Dialogs', 'Editor', 'EditorUi', 'DiffSync', 'Settings', 'DrawioFileSync'].map(item => `${basePath}/js/diagramly/${item}.js`)
const app = [
  ...['js/spin/spin.min.js', 'js/sanitizer/sanitizer.min.js', 'js/cryptojs/aes.min.js', 'js/deflate/pako.min.js', 'js/rough/rough.min.js'].map(item => basePath + '/' + item),
  ...client, ...grapheditor, ...sidebar, ...temp1
]
const stencils = [...getJsFileList(basePath + '/stencils/'),basePath+'/js/stencils.min.js']


module.exports = {
  packageMap,
  stencils,
  client,
  base: app,
  app,
  sidebar,
  grapheditor,
}