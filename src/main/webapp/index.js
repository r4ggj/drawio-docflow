// 引入样式文件
import './styles/grapheditor.css';
import './mxgraph/css/common.css';
import './index.less';
var urlParams = (function () {
  var result = new Object();
  var params = window.location.search.slice(1).split('&');

  for (var i = 0; i < params.length; i++) {

    for (var i = 0; i < params.length; i++) {
      var idx = params[i].indexOf('=');

      if (idx > 0) {

        if (idx > 0) {
          result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
        }
      }


      return result;
    }
  }
})();


// Forces CDN caches by passing URL parameters via URL hash
if (window.location.hash != null && window.location.hash.substring(0, 2) == '#P') {
  try {
    urlParams = JSON.parse(decodeURIComponent(window.location.hash.substring(2)));

    if (urlParams.hash != null) {
      window.location.hash = urlParams.hash;
    }
  } catch (e) {
    // ignore
  }
}

// Global variable for desktop
var mxIsElectron = window && window.process && window.process.type;


// Redirects page if required
if (process.env.RUN_ENV !== 'dev') {
  (function () {
    var proto = window.location.protocol;

    if (!mxIsElectron) {
      var host = window.location.host;

      // Redirects apex, drive and rt to www
      if (host === 'draw.io' || host === 'rt.draw.io' || host === 'drive.draw.io') {
        host = 'www.draw.io';
      }

      var href = proto + '//' + host + window.location.href.substring(
        window.location.protocol.length +
        window.location.host.length + 2);

      // Redirects if href changes
      if (href != window.location.href) {
        window.location.href = href;
      }
    }
  })();
}

/**
 * Adds meta tag to the page.
 */
function mxmeta(name, content, httpEquiv) {
  try {
    var s = document.createElement('meta');

    if (name != null) {
      s.setAttribute('name', name);
    }

    s.setAttribute('content', content);

    if (httpEquiv != null) {
      s.setAttribute('http-equiv', httpEquiv);
    }

    var t = document.getElementsByTagName('meta')[0];
    t.parentNode.insertBefore(s, t);
  } catch (e) {
    // ignore
  }
};

/**
 * Synchronously adds scripts to the page.
 */
function mxscript(src, onLoad, id, dataAppKey, noWrite) {
  var defer = onLoad == null && !noWrite;
  if ((typeof document.createElement('canvas').getContext === "function") ||
    onLoad != null || noWrite) {
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('defer', 'true');
    s.setAttribute('src', src);

    if (id != null) {
      s.setAttribute('id', id);
    }

    if (dataAppKey != null) {
      s.setAttribute('data-app-key', dataAppKey);
    }

    if (onLoad != null) {
      var r = false;

      s.onload = s.onreadystatechange = function () {
        if (!r && (!this.readyState || this.readyState == 'complete')) {
          r = true;
          onLoad();
        }
      };
    }

    var t = document.getElementsByTagName('script')[0];

    if (t != null) {
      t.parentNode.insertBefore(s, t);
    }
  } else {
    document.write('<script src="' + src + '"' + ((id != null) ? ' id="' + id + '" ' : '') +
      ((dataAppKey != null) ? ' data-app-key="' + dataAppKey + '" ' : '') + '></scr' + 'ipt>');
  }
};


/**
 * Adds meta tags with application name (depends on offline URL parameter)
 */
(function () {
  var name = 'diagrams.net';
  mxmeta('apple-mobile-web-app-title', name);
  mxmeta('application-name', name);

  if (mxIsElectron) {
    mxmeta(null,
      'default-src \'self\' \'unsafe-inline\'; connect-src \'self\' https://*.draw.io https://fonts.googleapis.com https://fonts.gstatic.com; img-src * data:; media-src *; font-src *; style-src-elem \'self\' \'unsafe-inline\' https://fonts.googleapis.com',
      'Content-Security-Policy');
  }
})();

// Checks for local storage
var isLocalStorage = false;

try {
  isLocalStorage = urlParams['local'] != '1' && typeof (localStorage) != 'undefined';
} catch (e) {
  // ignored
}

var mxScriptsLoaded = false,
  mxWinLoaded = false;

function checkAllLoaded() {
  if (mxScriptsLoaded && mxWinLoaded) {
    App.main();
  }
};
 
window.RUN_ENV = process.env.RUN_ENV
if (process.env.RUN_ENV === 'prod') {
  mxScriptsLoaded = true;
  mxscript('js/PreConfig.js', function () {
    mxscript('js/app.min.js', function () {
      mxScriptsLoaded = true;
      checkAllLoaded();
      mxscript('js/PostConfig.js');
    })
  })
} else if (process.env.RUN_ENV === 'dev') {
  // Used to request grapheditor/mxgraph sources in dev mode
  var mxDevUrl = '.';
  // Used to request draw.io sources in dev mode
  var drawDevUrl = './';
  var geBasePath = drawDevUrl + 'js/grapheditor';
  var mxBasePath = mxDevUrl + '/mxgraph';
  var mxForceIncludes = false;
  if (document.location.protocol == 'file:') {
    geBasePath = './js/grapheditor';
    mxBasePath = './mxgraph';
    drawDevUrl = './';
    mxForceIncludes = true;
  }

  mxscript(drawDevUrl + 'js/PreConfig.js')
  mxscript(drawDevUrl + 'js/diagramly/Init.js')
  mxscript(geBasePath + '/Init.js')
  mxscript(mxBasePath + '/mxClient.js', function () {
    mxscript(drawDevUrl + 'js/diagramly/Devel.js', function () {
      mxscript(drawDevUrl + 'js/PostConfig.js');

    })
  })


  // Electron
  if (mxIsElectron) {
    mxscript('js/diagramly/DesktopLibrary.js');
    mxscript('js/diagramly/ElectronApp.js');
  }


  mxScriptsLoaded = true
  // mxscript(drawDevUrl + 'js/PreConfig.js', function () {
  //   mxscript(drawDevUrl + 'js/diagramly/Init.js',function(){
  //     mxscript(geBasePath + '/Init.js', function () {
  //       mxscript(mxBasePath + '/mxClient.js', function () {
  //         mxscript(drawDevUrl + 'js/diagramly/Devel.js', function () {
  //           mxScriptsLoaded = true;
  //           checkAllLoaded();
  //         })
  //         // Electron
  //         if (mxIsElectron) {
  //           mxscript('js/diagramly/DesktopLibrary.js');
  //           mxscript('js/diagramly/ElectronApp.js');
  //         }
  //         mxscript(drawDevUrl + 'js/PostConfig.js');
  //       })
  //     });
  //   });
  // });

} else {

  (function () {
    var hostName = window.location.hostname;
    // Supported domains are *.draw.io and the packaged version in Quip
    var supportedDomain = (hostName.substring(hostName.length - 8, hostName.length) === '.draw.io') ||
      (hostName.substring(hostName.length - 13, hostName.length) === '.diagrams.net');

    function loadAppJS() {

      // zhaodeezhu
      // mxscript('js/app.min.js', function()
      mxscript('js/app.min.js', function () {
        mxScriptsLoaded = true;
        checkAllLoaded();

        // Electron
        if (mxIsElectron) {
          mxscript('js/diagramly/DesktopLibrary.js', function () {
            mxscript('js/diagramly/ElectronApp.js', function () {
              mxscript('js/extensions.min.js', function () {
                mxscript('js/stencils.min.js', function () {
                  mxscript('js/shapes-14-6-5.min.js', function () {
                    mxscript('js/PostConfig.js');
                  });
                });
              });
            });
          });
        } else if (!supportedDomain) {
          // zhaodeezhu
          // mxscript('js/PostConfig.js');
          mxscript('webapp/js/PostConfig.js');
        }
      });
    };

    if (!supportedDomain || mxIsElectron) {
      // zhaodeezhu
      // mxscript('js/PreConfig.js', loadAppJS);
      mxscript('js/PreConfig.js', loadAppJS);
    } else {
      loadAppJS();
    }
  })();
}


// Adds basic error handling
window.onerror = function () {
  var status = document.getElementById('geStatus');

  if (status != null) {
    status.innerHTML = 'Page could not be loaded. Please try refreshing.';
  }
};


/**
 * Main
 */
if (navigator.userAgent != null && navigator.userAgent.toLowerCase().indexOf(' electron/') >= 0 && typeof process !==
  'undefined' && process.versions.electron < 5) {
  // Redirects old Electron app to latest version
  var div = document.getElementById('geInfo');

  if (div != null) {
    div.innerHTML =
      '<center><h2>You are using an out of date version of this app.<br>Please download the latest version ' +
      '<a href="https://github.com/jgraph/drawio-desktop/releases/latest" target="_blank">here</a>.</h2></center>';
  }
} else {

  if (typeof document.createElement('canvas').getContext === "function") {

    window.addEventListener('load', function () {
      mxWinLoaded = true;
      checkAllLoaded();
    });
  } else {

    mxWinLoaded = true;
    checkAllLoaded();
  }
}










// var drawDevUrl ='./'
// var geBasePath = drawDevUrl + 'js/grapheditor';
// var mxBasePath = drawDevUrl + 'mxgraph';

// import(drawDevUrl + 'js/PreConfig.js');
// import(drawDevUrl + 'js/diagramly/Init.js');
// import(geBasePath + '/Init.js');
// import(mxBasePath + '/mxClient.js');


// import(drawDevUrl + 'js/cryptojs/aes.min.js');
// import(drawDevUrl + 'js/spin/spin.min.js');
// import(drawDevUrl + 'js/deflate/pako.min.js');
// import(drawDevUrl + 'js/deflate/base64.js');
// import(drawDevUrl + 'js/jscolor/jscolor.js');
// import(drawDevUrl + 'js/sanitizer/sanitizer.min.js');
// import(drawDevUrl + 'js/rough/rough.min.js');

// // Uses grapheditor from devhost
// import(geBasePath + '/Editor.js');
// import(geBasePath + '/EditorUi.js');
// import(geBasePath + '/Sidebar.js');
// import(geBasePath + '/Graph.js');
// import(geBasePath + '/Format.js');
// import(geBasePath + '/Shapes.js');
// import(geBasePath + '/Actions.js');
// import(geBasePath + '/Menus.js');
// import(geBasePath + '/Toolbar.js');
// import(geBasePath + '/Dialogs.js');

// // Loads main classes
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ActiveDirectory.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Advanced.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AlliedTelesis.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Android.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ArchiMate.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ArchiMate3.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Arrows2.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Atlassian.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS3.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS3D.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS4.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS4b.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Azure.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Azure2.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Basic.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Bootstrap.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-BPMN.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-C4.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cabinet.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cisco.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cisco19.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-CiscoSafe.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Citrix.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cumulus.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-DFD.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-EIP.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Electrical.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ER.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Floorplan.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Flowchart.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-FluidPower.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCP.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCP2.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCPIcons.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Gmdl.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-IBM.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Infographic.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Ios.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Ios7.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Kubernetes.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-LeanMapping.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Mockup.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-MSCAE.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Network.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Office.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-PID.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Rack.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Signs.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Sitemap.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Sysml.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ThreatModeling.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-UML25.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Veeam.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Veeam2.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-VVD.js');
// import(drawDevUrl + 'js/diagramly/sidebar/Sidebar-WebIcons.js');

// import(drawDevUrl + 'js/diagramly/util/mxJsCanvas.js');
// import(drawDevUrl + 'js/diagramly/util/mxAsyncCanvas.js');

// import(drawDevUrl + 'js/diagramly/DrawioFile.js');
// import(drawDevUrl + 'js/diagramly/LocalFile.js');
// import(drawDevUrl + 'js/diagramly/LocalLibrary.js');
// import(drawDevUrl + 'js/diagramly/StorageFile.js');
// import(drawDevUrl + 'js/diagramly/StorageLibrary.js');
// import(drawDevUrl + 'js/diagramly/RemoteFile.js');
// import(drawDevUrl + 'js/diagramly/RemoteLibrary.js');
// import(drawDevUrl + 'js/diagramly/EmbedFile.js');
// import(drawDevUrl + 'js/diagramly/Dialogs.js');
// import(drawDevUrl + 'js/diagramly/Editor.js');
// import(drawDevUrl + 'js/diagramly/EditorUi.js');
// import(drawDevUrl + 'js/diagramly/DiffSync.js');
// import(drawDevUrl + 'js/diagramly/Settings.js');
// import(drawDevUrl + 'js/diagramly/DrawioFileSync.js');

// //Comments
// import(drawDevUrl + 'js/diagramly/DrawioComment.js');
// import(drawDevUrl + 'js/diagramly/DriveComment.js');

// // Excluded in base.min.js
// import(drawDevUrl + 'js/diagramly/DrawioClient.js');
// import(drawDevUrl + 'js/diagramly/DrawioUser.js');
// import(drawDevUrl + 'js/diagramly/UrlLibrary.js');
// import(drawDevUrl + 'js/diagramly/DriveFile.js');
// import(drawDevUrl + 'js/diagramly/DriveLibrary.js');
// import(drawDevUrl + 'js/diagramly/DriveClient.js');
// import(drawDevUrl + 'js/diagramly/DropboxFile.js');
// import(drawDevUrl + 'js/diagramly/DropboxLibrary.js');
// import(drawDevUrl + 'js/diagramly/DropboxClient.js');
// import(drawDevUrl + 'js/diagramly/GitHubFile.js');
// import(drawDevUrl + 'js/diagramly/GitHubLibrary.js');
// import(drawDevUrl + 'js/diagramly/GitHubClient.js');
// import(drawDevUrl + 'js/diagramly/OneDriveFile.js');
// import(drawDevUrl + 'js/diagramly/OneDriveLibrary.js');
// import(drawDevUrl + 'js/diagramly/OneDriveClient.js');
// import(drawDevUrl + 'js/onedrive/mxODPicker.js');
// import(drawDevUrl + 'js/diagramly/TrelloFile.js');
// import(drawDevUrl + 'js/diagramly/TrelloLibrary.js');
// import(drawDevUrl + 'js/diagramly/TrelloClient.js');
// import(drawDevUrl + 'js/diagramly/GitLabFile.js');
// import(drawDevUrl + 'js/diagramly/GitLabLibrary.js');
// import(drawDevUrl + 'js/diagramly/GitLabClient.js');
// import(drawDevUrl + 'js/diagramly/NotionFile.js');
// import(drawDevUrl + 'js/diagramly/NotionLibrary.js');
// import(drawDevUrl + 'js/diagramly/NotionClient.js');

// import(drawDevUrl + 'js/diagramly/App.js');
// import(drawDevUrl + 'js/diagramly/Menus.js');
// import(drawDevUrl + 'js/diagramly/Pages.js');
// import(drawDevUrl + 'js/diagramly/Trees.js');
// import(drawDevUrl + 'js/diagramly/Minimal.js');
// import(drawDevUrl + 'js/diagramly/DistanceGuides.js');
// import(drawDevUrl + 'js/diagramly/mxRuler.js');
// import(drawDevUrl + 'js/diagramly/mxFreehand.js');
// import(drawDevUrl + 'js/diagramly/DevTools.js');

// // Vsdx/vssx support
// import(drawDevUrl + 'js/diagramly/vsdx/VsdxExport.js');
// import(drawDevUrl + 'js/diagramly/vsdx/mxVsdxCanvas2D.js');
// import(drawDevUrl + 'js/diagramly/vsdx/bmpDecoder.js');
// import(drawDevUrl + 'js/diagramly/vsdx/importer.js');
// import(drawDevUrl + 'js/jszip/jszip.min.js');

// // GraphMl Import
// import(drawDevUrl + 'js/diagramly/graphml/mxGraphMlCodec.js');

// // P2P Collab
// import(drawDevUrl + 'js/diagramly/P2PCollab.js');

// // Org Chart Layout
// if (urlParams['orgChartDev'] == '1') {
//   import(drawDevUrl + 'js/orgchart/bridge.min.js');
//   import(drawDevUrl + 'js/orgchart/bridge.collections.min.js');
//   import(drawDevUrl + 'js/orgchart/OrgChart.Layout.min.js');
//   import(drawDevUrl + 'js/orgchart/mxOrgChartLayout.js');
// }




// var mxUtils
// import('./js/PreConfig.js');
// import('./js/app.min.js')
// import('./js/diagramly/Init.js');
// import('./js/grapheditor/Init.js');
// import('./mxgraph/mxClient.js')
// import('./base-viewer.min.js')
// import('./js/viewer.min.js')
// import('./js/viewer-static.min.js')
// import('./base.min.js')
// import('./js/PostConfig.js')
// import('./math/MathJax.js')
// import('./js/shapes-14-6-5.min.js')
// import('./js/stencils.min.js')
// import('./js/extensions.min.js')
// import('./js/dropbox/Dropbox-sdk.min.js')
// import('./js/onedrive/OneDrive.js')
// import('./js/orgchart.min.js')
// import('./math/extensions/MathMenu.js')
// import('./math/extensions/MathZoom.js')
// import('./js/diagramly/Devel.js');
// import('./js/diagramly/DesktopLibrary.js');
// import('./js/diagramly/ElectronApp.js');