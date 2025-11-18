// ganguojiang 从drawio官网app.min.js中提取到的代码，用于修改drawio的主题
// 作者删除了内置支持主题，作为hook使用。。。
Editor.themes.unshift("simple");
Editor.themes.push("sketch");
Editor.themes.push("atlas");
(function () {
  EditorUi.prototype.switchCssForTheme = function (a) {
    var b = mxUtils.isAncestorNode(document.body, this.container)
      ? this.container
      : this.editor.graph.container;
    null != b &&
      ("kennedy" == a
        ? b.classList.add("geClassic")
        : b.classList.remove("geClassic"),
      "sketch" == a && b.classList.add("geSketch"),
      "simple" == a || "sketch" == a
        ? b.classList.add("geSimple")
        : b.classList.remove("geSimple"));
  };
  var x = EditorUi.prototype.createMainMenuForTheme;
  EditorUi.prototype.createMainMenuForTheme = function (a) {
    if ("simple" == a || "sketch" == a) {
      if (null == this.sketchMainMenuElt) {
        this.sketchMainMenuElt = document.createElement("div");
        var b = this.createMenu(
          "simple" == a ? "view" : "diagram",
          "simple" == a ? Editor.thinViewImage : Editor.menuImage
        );
        this.sketchMainMenuElt.appendChild(b);
        var c = this.createMenuItem("delete", Editor.trashImage),
          f = this.createMenuItem("undo", Editor.undoImage),
          g = this.createMenuItem("redo", Editor.redoImage);
        this.dependsOnLanguage(
          mxUtils.bind(this, function () {
            b.setAttribute(
              "title",
              mxResources.get("simple" == a ? "view" : "diagram")
            );
            c.setAttribute("title", mxResources.get("delete"));
            f.setAttribute("title", mxResources.get("undo"));
            g.setAttribute("title", mxResources.get("redo"));
          })
        );
        "simple" == a
          ? (this.sketchMainMenuElt.className =
              "geToolbarContainer geSimpleMainMenu")
          : (this.container.appendChild(this.sketchMainMenuElt),
            (this.sketchMainMenuElt.className =
              "geToolbarContainer geSketchMainMenu"),
            this.sketchMainMenuElt.appendChild(c),
            this.sketchMainMenuElt.appendChild(f),
            this.sketchMainMenuElt.appendChild(g));
        this.container.appendChild(this.sketchMainMenuElt);
      }
    } else x.apply(this, arguments);
  };
  var y = EditorUi.prototype.createFooterMenuForTheme;
  EditorUi.prototype.createFooterMenuForTheme = function (a) {
    if ("simple" == a || "sketch" == a) {
      if (null == this.sketchFooterMenuElt) {
        var b = this.createPageMenuTab(!1, "simple" != a),
          c = this.createMenu("pages", Editor.thinNoteImage),
          f = this.createMenuItem("undo", Editor.thinUndoImage),
          g = this.createMenuItem("redo", Editor.thinRedoImage),
          r = this.createMenuItem("delete", Editor.thinDeleteImage),
          u = this.createMenuItem("zoomOut", Editor.zoomOutImage),
          p = this.createMenuItem("zoomIn", Editor.zoomInImage),
          q = this.createMenuItem("fullscreen", Editor.fullscreenImage),
          m = this.createMenuItem("exit", Editor.closeImage);
        this.dependsOnLanguage(
          mxUtils.bind(this, function () {
            c.setAttribute("title", mxResources.get("pages"));
            f.setAttribute("title", mxResources.get("undo"));
            g.setAttribute("title", mxResources.get("redo"));
            r.setAttribute("title", mxResources.get("delete"));
            u.setAttribute("title", mxResources.get("zoomOut"));
            p.setAttribute("title", mxResources.get("zoomIn"));
            q.setAttribute("title", mxResources.get("fullscreen"));
            m.setAttribute("title", mxResources.get("exit"));
          })
        );
        this.sketchFooterMenuElt = document.createElement("div");
        this.sketchFooterMenuElt.className =
          "geToolbarContainer geFooterToolbar";
        var h = this.sketchFooterMenuElt;
        if ("simple" != a) {
          b.className = "geButton gePageMenu";
          b.style.backgroundImage = "url(" + Editor.arrowDownImage + ")";
          h.appendChild(b);
          var t = document.createElement("span");
          b.innerText = "";
          b.appendChild(t);
          var e = mxUtils.bind(this, function () {
            t.innerText = "";
            if (null != this.currentPage) {
              mxUtils.write(t, this.currentPage.getName());
              var k = null != this.pages ? this.pages.length : 1,
                v = this.getPageIndex(this.currentPage);
              v = null != v ? v + 1 : 1;
              var w = this.currentPage.getId();
              b.setAttribute(
                "title",
                this.currentPage.getName() +
                  " (" +
                  v +
                  "/" +
                  k +
                  ")" +
                  (null != w ? " [" + w + "]" : "")
              );
            }
          });
          this.editor.addListener("pagesPatched", e);
          this.editor.addListener("pageSelected", e);
          this.editor.addListener("pageRenamed", e);
          this.editor.addListener("fileLoaded", e);
          e();
          var l = mxUtils.bind(this, function () {
            b.style.display = this.isPageMenuVisible() ? "" : "none";
          });
          this.addListener(
            "editInlineStart",
            mxUtils.bind(this, function () {
              l();
              e();
            })
          );
          this.addListener("fileDescriptorChanged", l);
          this.addListener("pagesVisibleChanged", l);
          this.editor.addListener("pagesPatched", l);
          l();
          h.appendChild(u);
        }
        var d = this.createZoomInput("simple" != a);
        h.appendChild(d);
        if ("simple" == a) {
          f.style.marginLeft = "auto";
          h.appendChild(c);
          h.appendChild(f);
          h.appendChild(g);
          h.appendChild(r);
          var n = mxUtils.bind(this, function () {
            var k =
              window.innerWidth ||
              document.documentElement.clientWidth ||
              document.body.clientWidth;
            c.style.display = 480 > k ? "none" : "";
            d.style.display = 750 > k ? "none" : "";
            r.style.display = 290 > k ? "none" : "";
          });
          mxEvent.addListener(window, "resize", n);
          n();
        }
        "simple" != a && h.appendChild(p);
        "1" == urlParams.embedInline &&
          (h.appendChild(q),
          (n = mxUtils.bind(this, function () {
            q.style.backgroundImage =
              "url(" +
              (Editor.inlineFullscreen
                ? Editor.fullscreenExitImage
                : Editor.fullscreenImage) +
              ")";
            this.inlineSizeChanged();
            this.editor.graph.refresh();
            this.fitWindows();
          })),
          this.addListener(
            "editInlineStart",
            mxUtils.bind(this, function () {
              q.style.backgroundImage =
                "url(" +
                (Editor.inlineFullscreen
                  ? Editor.fullscreenExitImage
                  : Editor.fullscreenImage) +
                ")";
            })
          ),
          this.addListener("inlineFullscreenChanged", n),
          h.appendChild(m));
        "simple" == a
          ? ((this.sketchFooterMenuElt.style.cssText =
              "position:relative;gap:6px;flex-shrink:0;flex-grow:0.5;"),
            this.sketchMainMenuElt.appendChild(this.sketchFooterMenuElt))
          : this.container.appendChild(this.sketchFooterMenuElt);
      }
    } else y.apply(this, arguments);
  };
  var z = EditorUi.prototype.createPickerMenuForTheme;
  EditorUi.prototype.createPickerMenuForTheme = function (a) {
    if ("simple" == a || "sketch" == a) {
      if (null == this.sketchPickerMenuElt) {
        var b = this.editor.graph;
        this.sketchPickerMenuElt = document.createElement("div");
        this.sketchPickerMenuElt.className = "geToolbarContainer";
        "sketch" == a &&
          this.sketchPickerMenuElt.classList.add("geVerticalToolbar");
        var c = this.sketchPickerMenuElt,
          f = document.createElement("a");
        f.className = "geButton";
        f.style.height = "18px";
        f.style.opacity = "0.4";
        f.style.backgroundImage = "url(" + Editor.expandMoreImage + ")";
        f.setAttribute("title", mxResources.get("collapseExpand"));
        var g = this.createMenuItem(
            "insertFreehand",
            "simple" == a ? Editor.thinGestureImage : Editor.freehandImage,
            !0
          ),
          r = this.createMenu(
            "insert",
            "simple" == a ? Editor.thinAddCircleImage : Editor.addBoxImage
          ),
          u = this.createMenu("table", Editor.thinTableImage),
          p = r.cloneNode(!0);
        p.style.backgroundImage =
          "url(" +
          ("simple" == a ? Editor.thinShapesImage : Editor.shapesImage) +
          ")";
        p.setAttribute("title", mxResources.get("shapes"));
        this.addShapePicker(p, "simple" == a);
        var q = !1,
          m = mxUtils.bind(this, function (e) {
            if (e || (null != document.body && document.body.contains(c))) {
              e = function (n, k, v, w, B, C) {
                null != k && n.setAttribute("title", k);
                c.appendChild(n);
                "simple" != a &&
                  null != w &&
                  null == n.querySelector(".geShortcutKey") &&
                  ((k = document.createElement("div")),
                  (k.className = "geShortcutKey"),
                  mxUtils.write(k, w),
                  n.appendChild(k));
                b.isEnabled() ||
                  "1" == urlParams.embedInline ||
                  n.classList.add("mxDisabled");
                return n;
              };
              b.isEnabled() || "1" == urlParams.embedInline
                ? (g.classList.remove("mxDisabled"),
                  r.classList.remove("mxDisabled"),
                  u.classList.remove("mxDisabled"),
                  p.classList.remove("mxDisabled"))
                : (g.classList.add("mxDisabled"),
                  r.classList.add("mxDisabled"),
                  u.classList.add("mxDisabled"),
                  p.classList.add("mxDisabled"));
              c.innerText = "";
              if (!q) {
                var l =
                  window.innerWidth ||
                  document.documentElement.clientWidth ||
                  document.body.clientWidth;
                "simple" == a &&
                  (this.sidebar.graph.cellRenderer.minSvgStrokeWidth = 0.9);
                if ("simple" != a || 660 <= l) {
                  var d = this.sidebar.createVertexTemplate(
                    b.appendFontSize(
                      "text;strokeColor=none;fillColor=none;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;",
                      b.vertexFontSize
                    ),
                    60,
                    30,
                    "Text",
                    mxResources.get("text") + " (A)",
                    !0,
                    !1,
                    null,
                    "simple" != a,
                    null,
                    28,
                    28,
                    "simple" == a ? Editor.thinTextImage : null,
                    !0
                  );
                  e(d, mxResources.get("text") + " (A)", null, "A", 32);
                }
                d = this.sidebar.createVertexTemplate(
                  "rounded=0;whiteSpace=wrap;html=1;",
                  160,
                  80,
                  "",
                  mxResources.get("rectangle") + " (D)",
                  !0,
                  !1,
                  null,
                  "simple" != a,
                  null,
                  28,
                  28,
                  "simple" == a ? Editor.thinRectangleImage : null
                );
                "simple" == a
                  ? (600 <= l &&
                      e(d, mxResources.get("rectangle") + " (D)", null, "D"),
                    400 <= l && this.sketchPickerMenuElt.appendChild(p),
                    440 <= l &&
                      e(g, mxResources.get("freehand") + " (X)", null, "X"),
                    500 <= l && this.sketchPickerMenuElt.appendChild(u))
                  : (e(
                      this.sidebar.createVertexTemplate(
                        "shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;fontColor=#000000;darkOpacity=0.05;fillColor=#FFF9B2;strokeColor=none;fillStyle=solid;direction=west;gradientDirection=north;gradientColor=#FFF2A1;shadow=1;size=20;pointerEvents=1;",
                        140,
                        160,
                        "",
                        mxResources.get("note") + " (S)",
                        !0,
                        !1,
                        null,
                        !0,
                        null,
                        28,
                        28
                      ),
                      mxResources.get("note") + " (S)",
                      null,
                      "S"
                    ),
                    e(d, mxResources.get("rectangle") + " (D)", null, "D"),
                    e(
                      this.sidebar.createVertexTemplate(
                        "ellipse;whiteSpace=wrap;html=1;",
                        160,
                        100,
                        "",
                        mxResources.get("ellipse") + " (F)",
                        !0,
                        !1,
                        null,
                        !0,
                        null,
                        28,
                        28
                      ),
                      mxResources.get("ellipse") + " (F)",
                      null,
                      "F"
                    ),
                    (d = new mxCell(
                      "",
                      new mxGeometry(
                        0,
                        0,
                        this.editor.graph.defaultEdgeLength + 20,
                        0
                      ),
                      "edgeStyle=none;orthogonalLoop=1;jettySize=auto;html=1;"
                    )),
                    d.geometry.setTerminalPoint(new mxPoint(0, 0), !0),
                    d.geometry.setTerminalPoint(
                      new mxPoint(d.geometry.width, 0),
                      !1
                    ),
                    (d.geometry.points = []),
                    (d.geometry.relative = !0),
                    (d.edge = !0),
                    e(
                      this.sidebar.createEdgeTemplateFromCells(
                        [d],
                        d.geometry.width,
                        d.geometry.height,
                        mxResources.get("line") + " (C)",
                        !0,
                        null,
                        "simple" != a,
                        !1,
                        null,
                        28,
                        28
                      ),
                      mxResources.get("line") + " (C)",
                      null,
                      "C"
                    ),
                    (d = d.clone()),
                    (d.style =
                      "edgeStyle=none;orthogonalLoop=1;jettySize=auto;html=1;shape=flexArrow;rounded=1;startSize=8;endSize=8;"),
                    (d.geometry.width =
                      this.editor.graph.defaultEdgeLength + 20),
                    d.geometry.setTerminalPoint(new mxPoint(0, 20), !0),
                    d.geometry.setTerminalPoint(
                      new mxPoint(d.geometry.width, 20),
                      !1
                    ),
                    e(
                      this.sidebar.createEdgeTemplateFromCells(
                        [d],
                        d.geometry.width,
                        40,
                        mxResources.get("arrow"),
                        !0,
                        null,
                        !0,
                        !1,
                        null,
                        28,
                        28
                      ),
                      mxResources.get("arrow")
                    ),
                    e(g, mxResources.get("freehand") + " (X)", null, "X"),
                    this.sketchPickerMenuElt.appendChild(p));
                ("simple" != a || 320 < l) &&
                  this.sketchPickerMenuElt.appendChild(r);
              }
              "simple" != a && "1" != urlParams.embedInline && c.appendChild(f);
              this.sidebar.graph.cellRenderer.minSvgStrokeWidth =
                this.sidebar.minThumbStrokeWidth;
            }
          });
        mxEvent.addListener(
          f,
          "click",
          mxUtils.bind(this, function () {
            q
              ? (c.classList.remove("geCollapsedToolbar"),
                (f.style.backgroundImage =
                  "url(" + Editor.expandMoreImage + ")"),
                (q = !1),
                m())
              : ((c.innerText = ""),
                c.appendChild(f),
                c.classList.add("geCollapsedToolbar"),
                (f.style.backgroundImage =
                  "url(" + Editor.expandLessImage + ")"),
                (q = !0));
          })
        );
        var h =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth,
          t = null;
        mxEvent.addListener(window, "resize", function () {
          var e =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
          e != h &&
            ((h = e),
            null != t && window.clearTimeout(t),
            (t = window.setTimeout(function () {
              t = null;
              m();
            }, 200)));
        });
        this.editor.addListener("fileLoaded", m);
        this.addListener("sketchModeChanged", m);
        this.addListener("currentThemeChanged", m);
        this.addListener("languageChanged", m);
        this.addListener("lockedChanged", m);
        m(!0);
        "simple" == a
          ? ((this.sketchPickerMenuElt.style.cssText =
              "position:relative;white-space:nowrap;user-select:none;display:flex;align-items:center;justify-content:flex-end;flex-grow:1;gap:6px;flex-shrink:0;"),
            this.sketchMainMenuElt.appendChild(this.sketchPickerMenuElt))
          : this.container.appendChild(this.sketchPickerMenuElt);
        mxClient.IS_POINTER &&
          (this.sketchPickerMenuElt.style.touchAction = "none");
      }
    } else z.apply(this, arguments);
  };
  var A = EditorUi.prototype.createMenubarForTheme;
  EditorUi.prototype.createMenubarForTheme = function (a) {
    if ("simple" == a || "sketch" == a) {
      if (null == this.sketchMenubarElt) {
        this.sketchMenubarElt = document.createElement("div");
        this.sketchMenubarElt.className = "geToolbarContainer";
        if ("simple" == a) {
          if (
            ((this.sketchMenubarElt.style.cssText =
              "position:relative;flex-grow:0.5;overflow:visible;" +
              ("1" != urlParams.embed ? "flex-shrink:0;" : "min-width:0;") +
              "display:flex;white-space:nowrap;user-select:none;justify-content:flex-end;align-items:center;flex-wrap:nowrap;gap:6px;"),
            null == this.commentElt &&
              ((this.commentElt = this.createMenuItem(
                "comments",
                Editor.thinCommentImage,
                !0
              )),
              (this.commentElt.style.backgroundSize = "24px")),
            null == this.shareElt &&
              "1" != urlParams.embed &&
              "draw.io" == this.getServiceName())
          ){
            // ganguojiang start 隐藏共享按钮
            // if (
            //   ((this.shareElt = this.createMenu(
            //     "share",
            //     Editor.thinUserAddImage
            //   )),
            //   (this.shareElt.style.backgroundSize = "24px"),
            //   (this.shareElt.style.flexShrink = "0"),
            //   this.isStandaloneApp())
            // )
            //   this.shareElt.style.backgroundImage =
            //     "url(" + Editor.thinShareImage + ")";
            // else {
            //   var b = mxUtils.bind(this, function () {
            //     var c = mxResources.get("share"),
            //       f = Editor.thinUserAddImage,
            //       g = this.getNetworkStatus();
            //     null != g &&
            //       ((c = c + " (" + g + ")"), (f = Editor.thinUserFlashImage));
            //     this.shareElt.style.backgroundImage = "url(" + f + ")";
            //     this.shareElt.setAttribute("title", c);
            //   });
            //   this.addListener("realtimeStateChanged", b);
            //   this.editor.addListener("statusChanged", b);
            //   mxEvent.addListener(window, "offline", b);
            //   mxEvent.addListener(window, "online", b);
            //   b();
            // }
            // ganguojiang end 隐藏共享按钮
          }
        } else
          (this.sketchMenubarElt.style.cssText =
            "position:absolute;right:12px;top:10px;height:44px;border-radius:4px;overflow:hidden;user-select:none;max-width:calc(100% - 170px);box-sizing:border-box;justify-content:flex-end;z-index:1;padding:7px 12px;display:flex;white-space:nowrap;user-select:none;justify-content:flex-end;align-items:center;flex-wrap:nowrap;gap:6px;"),
            this.container.appendChild(this.sketchMenubarElt);
        "1" != urlParams.embedInline &&
          ((b = mxUtils.bind(this, function () {
            if ("sketch" == Editor.currentTheme) {
              var c =
                58 >
                this.sketchPickerMenuElt.offsetTop -
                  this.sketchPickerMenuElt.offsetHeight / 2;
              this.sketchMainMenuElt.style.left = c ? "70px" : "10px";
              this.sketchMenubarElt.style.maxWidth = c
                ? "calc(100% - 230px)"
                : "calc(100% - 170px)";
            } else "simple" == Editor.currentTheme && ((c = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth), null != this.commentElt && (this.commentElt.style.display = 560 < c && this.commentsSupported() ? "" : "none"), null != this.shareElt && (this.shareElt.style.display = 360 < c ? "" : "none"), null != this.overflowMenuElt && (this.overflowMenuElt.style.display = 750 > c ? "" : "none"));
          })),
          b(),
          mxEvent.addListener(window, "resize", b),
          this.editor.addListener("fileLoaded", b));
        "1" != urlParams.embed &&
          "atlassian" != this.getServiceName() &&
          this.installStatusMinimizer(this.sketchMenubarElt);
        this.dependsOnLanguage(
          mxUtils.bind(this, function () {
            null != this.commentElt &&
              this.commentElt.setAttribute(
                "title",
                mxResources.get("comments")
              );
            null != this.shareElt &&
              this.shareElt.setAttribute("title", mxResources.get("share"));
            null != this.mainMenuElt &&
              this.mainMenuElt.setAttribute(
                "title",
                mxResources.get("diagram")
              );
            null != this.formatElt &&
              this.formatElt.setAttribute("title", mxResources.get("format"));
          })
        );
      }
      "simple" == a &&
        (null != this.commentElt &&
          this.sketchMenubarElt.appendChild(this.commentElt),
        null != this.buttonContainer &&
          this.sketchMenubarElt.appendChild(this.buttonContainer),
        null != this.shareElt &&
          this.sketchMenubarElt.appendChild(this.shareElt),
        null == this.mainMenuElt &&
          (this.mainMenuElt = this.createMenu("diagram", Editor.thinMenuImage)),
        this.sketchMenubarElt.appendChild(this.mainMenuElt),
        null == this.formatElt &&
          ((this.formatElt = this.createMenuItem(
            "format",
            Editor.thinFormatImage,
            !0
          )),
          (this.formatElt.style.marginLeft =
            "1" != urlParams.embed ? "auto" : "0"),
          (b = mxUtils.bind(this, function () {
            0 < this.formatWidth
              ? this.formatElt.classList.add("geActiveItem")
              : this.formatElt.classList.remove("geActiveItem");
          })),
          this.addListener("formatWidthChanged", b),
          b()),
        this.sketchMenubarElt.appendChild(this.formatElt));
      null != this.statusContainer &&
        ((this.statusContainer.style.flexGrow = "1"),
        (this.statusContainer.style.flexShrink = "1"),
        (this.statusContainer.style.marginTop = "0px"),
        "simple" != a
          ? this.sketchMenubarElt.appendChild(this.statusContainer)
          : ((this.statusContainer.style.justifyContent = "center"),
            (this.statusContainer.style.width = "22%")));
      "simple" == a
        ? (null == this.overflowMenuElt &&
            ((this.overflowMenuElt = this.createMenu(
              "dynamicAppearance",
              Editor.thinDoubleArrowRightImage
            )),
            (this.overflowMenuElt.style.backgroundSize = "24px"),
            (this.overflowMenuElt.style.display = "inline-block"),
            (this.overflowMenuElt.style.flexShrink = "0"),
            (this.overflowMenuElt.style.display = "none"),
            this.overflowMenuElt.removeAttribute("title")),
          this.sketchMenubarElt.appendChild(this.overflowMenuElt),
          this.sketchMainMenuElt.appendChild(this.statusContainer),
          this.sketchMainMenuElt.appendChild(this.sketchMenubarElt))
        : null != this.buttonContainer &&
          this.sketchMenubarElt.appendChild(this.buttonContainer);
    } else A.apply(this, arguments);
  };
})();
