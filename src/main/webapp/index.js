// 引入样式文件
import "./styles/grapheditor.css";
import "./mxgraph/css/common.css";
import "./index.less";

window.Cookies = {
  /**
   * 从cookie中获取字段
   *
   * @param cname
   */
  get(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },
  /**
   * 设置cookie
   * @param name
   * @param value
   * @param options
   */
  set(name, value, options) {
    let cookieString = `${name}=${value}`;

    if (options?.expires) {
      if (typeof options?.expires === "number") {
        const date = new Date();
        date.setTime(date.getTime() + options?.expires * 1000);
        cookieString += `; expires=${date.toUTCString()}`;
      } else if (options?.expires instanceof Date) {
        cookieString += `; expires=${options?.expires.toUTCString()}`;
      }
    }

    if (options?.path) {
      cookieString += `; path=${options?.path}`;
    }

    if (options?.domain) {
      cookieString += `; domain=${options?.domain}`;
    }

    if (options?.secure) {
      cookieString += "; secure";
    }

    document.cookie = cookieString;
  },
};

/**
 * URL Parameters and protocol description are here:
 *
 * https://www.drawio.com/doc/faq/supported-url-parameters
 *
 * Parameters for developers:
 *
 * - dev=1: For developers only
 * - test=1: For developers only
 * - export=URL for export: For developers only
 * - ignoremime=1: For developers only (see DriveClient.js). Use Cmd-S to override mime.
 * - createindex=1: For developers only (see etc/build/README)
 * - filesupport=0: For developers only (see Editor.js in core)
 * - savesidebar=1: For developers only (see Sidebar.js)
 * - pages=1: For developers only (see Pages.js)
 * - lic=email: For developers only (see LicenseServlet.java)
 * --
 * - networkshapes=1: For testing network shapes (temporary)
 * - embedInline=1: sketch画板模式
 */
// Parses URL parameters
window.urlParams = (function () {
  var result = new Object();
  var params = window.location.search.slice(1).split("&");

  for (var i = 0; i < params.length; i++) {
    var idx = params[i].indexOf("=");

    if (idx > 0) {
      result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
    }
  }

  return result;
})();

// Forces CDN caches by passing URL parameters via URL hash
if (
  window.location.hash != null &&
  window.location.hash.substring(0, 2) == "#P"
) {
  try {
    urlParams = JSON.parse(
      decodeURIComponent(window.location.hash.substring(2))
    );

    if (urlParams.hash != null) {
      window.location.hash = urlParams.hash;
    }
  } catch (e) {
    // ignore
  }
}

// Global variable for desktop
window.mxIsElectron = window && window.process && window.process.type;

// Redirects page if required
if (process.env.RUN_ENV !== "dev") {
  (function () {
    var proto = window.location.protocol;

    if (!mxIsElectron) {
      var host = window.location.host;

      // Redirects apex, drive and rt to www
      if (
        host === "draw.io" ||
        host === "rt.draw.io" ||
        host === "drive.draw.io"
      ) {
        host = "www.draw.io";
      }

      var href =
        proto +
        "//" +
        host +
        window.location.href.substring(
          window.location.protocol.length + window.location.host.length + 2
        );

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
    var s = document.createElement("meta");

    if (name != null) {
      s.setAttribute("name", name);
    }

    s.setAttribute("content", content);

    if (httpEquiv != null) {
      s.setAttribute("http-equiv", httpEquiv);
    }

    var t = document.getElementsByTagName("meta")[0];
    t.parentNode.insertBefore(s, t);
  } catch (e) {
    // ignore
  }
}

Object.assign(window, {
  mxmeta,
});

/**
 * Synchronously adds scripts to the page.
 */
function mxscript(src, onLoad, id, dataAppKey, noWrite) {
  var defer = onLoad == null && !noWrite;
  if (
    typeof document.createElement("canvas").getContext === "function" ||
    onLoad != null ||
    noWrite
  ) {
    var s = document.createElement("script");
    s.setAttribute("type", "text/javascript");
    s.setAttribute("defer", "true");
    s.setAttribute("src", src);

    if (id != null) {
      s.setAttribute("id", id);
    }

    if (dataAppKey != null) {
      s.setAttribute("data-app-key", dataAppKey);
    }

    if (onLoad != null) {
      var r = false;

      s.onload = s.onreadystatechange = function () {
        if (!r && (!this.readyState || this.readyState == "complete")) {
          r = true;
          onLoad();
        }
      };
    }

    var t = document.getElementsByTagName("script")[0];

    if (t != null) {
      t.parentNode.insertBefore(s, t);
    }
  } else {
    document.write(
      '<script src="' +
        src +
        '"' +
        (id != null ? ' id="' + id + '" ' : "") +
        (dataAppKey != null ? ' data-app-key="' + dataAppKey + '" ' : "") +
        "></scr" +
        "ipt>"
    );
  }
}

Object.assign(window, {
  mxscript,
});

/**
 * Adds meta tags with application name (depends on offline URL parameter)
 */
(function () {
  var name = "diagrams.net";
  mxmeta("apple-mobile-web-app-title", name);
  mxmeta("application-name", name);

  if (mxIsElectron) {
    mxmeta(
      null,
      "default-src 'self' 'unsafe-inline'; connect-src 'self' https://*.draw.io https://fonts.googleapis.com https://fonts.gstatic.com; img-src * data:; media-src *; font-src *; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "Content-Security-Policy"
    );
  }
})();

// Checks for local storage
window.isLocalStorage = false;

try {
  isLocalStorage =
    urlParams["local"] != "1" && typeof localStorage != "undefined";
} catch (e) {
  // ignored
}

Object.assign(window, {
  mxScriptsLoaded: false,
  mxWinLoaded: false,
});

function checkAllLoaded() {
  if (mxScriptsLoaded && mxWinLoaded) {
    App.main((app) => {
      // 挂载drawio实例到window上
      window.drawio = app;
    });
  }
}

Object.assign(window, {
  checkAllLoaded,
});

window.RUN_ENV = process.env.RUN_ENV;

if (process.env.RUN_ENV === "prod") {
  mxScriptsLoaded = true;
  mxscript("js/PreConfig.js", function () {
    mxscript("js/app.prod.js", function () {
      mxScriptsLoaded = true;
      checkAllLoaded();
      mxscript("js/PostConfig.js");
    });
  });
} else if (process.env.RUN_ENV === "dev") {
  // Used to request grapheditor/mxgraph sources in dev mode
  Object.assign(window, {
    mxDevUrl: "",
    drawDevUrl: "",
    geBasePath: "js/grapheditor",
    mxBasePath: "mxgraph/src",
    mxForceIncludes: false,
  });
  if (document.location.protocol == "file:") {
    geBasePath = "js/grapheditor";
    mxBasePath = "mxgraph/src";
    drawDevUrl = "";
    mxForceIncludes = true;
  }

  mxscript(drawDevUrl + "js/PreConfig.js");
  mxscript(drawDevUrl + "js/diagramly/Init.js", function () {
    mxscript(geBasePath + "/Init.js");
  });
  mxscript(mxBasePath + "/mxClient.js", function () {
    mxscript(drawDevUrl + "js/diagramly/Devel.js", function () {
      // Electron
      if (mxIsElectron) {
        mxscript("js/diagramly/DesktopLibrary.js", function () {});
        mxscript("js/diagramly/ElectronApp.js", function () {});
      }

      mxscript(drawDevUrl + "js/PostConfig.js", function () {
        mxScriptsLoaded = true;
        checkAllLoaded();
      });
    });
  });
} else {
  (function () {
    var hostName = window.location.hostname;
    // Supported domains are *.draw.io and the packaged version in Quip
    var supportedDomain =
      hostName.substring(hostName.length - 8, hostName.length) === ".draw.io" ||
      hostName.substring(hostName.length - 13, hostName.length) ===
        ".diagrams.net";

    function loadAppJS() {
      mxscript("js/app.prod.js", function () {
        mxScriptsLoaded = true;
        checkAllLoaded();

        // Electron
        if (mxIsElectron) {
          mxscript("js/diagramly/DesktopLibrary.js", function () {
            mxscript("js/diagramly/ElectronApp.js", function () {
              mxscript("js/extensions.min.js", function () {
                mxscript("js/stencils.min.js", function () {
                  mxscript("js/shapes-14-6-5.min.js", function () {
                    mxscript("js/PostConfig.js");
                  });
                });
              });
            });
          });
        } else if (!supportedDomain) {
          mxscript("webapp/js/PostConfig.js");
        }
      });
    }

    if (!supportedDomain || mxIsElectron) {
      mxscript("js/PreConfig.js", loadAppJS);
    } else {
      loadAppJS();
    }
  })();
}

// Adds basic error handling
window.onerror = function () {
  var status = document.getElementById("geStatus");

  if (status != null) {
    status.innerHTML = "Page could not be loaded. Please try refreshing.";
  }
};

/**
 * Main
 */
if (
  navigator.userAgent != null &&
  navigator.userAgent.toLowerCase().indexOf(" electron/") >= 0 &&
  typeof process !== "undefined" &&
  process.versions.electron < 5
) {
  // Redirects old Electron app to latest version
  var div = document.getElementById("geInfo");

  if (div != null) {
    div.innerHTML =
      "<center><h2>You are using an out of date version of this app.<br>Please download the latest version " +
      '<a href="https://github.com/jgraph/drawio-desktop/releases/latest" target="_blank">here</a>.</h2></center>';
  }
} else {
  if (typeof document.createElement("canvas").getContext === "function") {
    window.addEventListener("load", function () {
      mxWinLoaded = true;
      checkAllLoaded();
    });
  } else {
    mxWinLoaded = true;
    checkAllLoaded();
  }
}
