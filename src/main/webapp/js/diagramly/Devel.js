/*
 * Copyright (c) 2006-2020, JGraph Ltd
 * 
 * This provides an indirection to make sure the mxClient.js
 * loads before the dependent classes below are loaded. This
 * is used for development mode where the JS is in separate
 * files and the mxClient.js loads other files.
 */
var mxIsElectron = window && window.process && window.process.type;
/**
 * Synchronously adds scripts to the page.
 */

function mxscript(src, onLoad, id, dataAppKey, noWrite) {
	var defer = onLoad == null && !noWrite;
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
};
var mxDevUrl = '';
// Used to request draw.io sources in dev mode
var drawDevUrl = './';
var geBasePath = drawDevUrl + 'js/grapheditor';
var mxBasePath = mxDevUrl + '/mxgraph';
if (!mxIsElectron && location.protocol !== 'http:') {
	(function () {
		var hashes = 'default-src \'self\'; ' +
			// storage.googleapis.com is needed for workbox-service-worker
			'script-src %script-src% \'self\' https://viewer.diagrams.net https://storage.googleapis.com ' +
			'https://apis.google.com https://*.pusher.com ' +
			// Below are the SHAs of the two script blocks in index.html.
			// These must be updated here and in the CDN after changes.
			//----------------------------------------------------------//
			//------------- Bootstrap script in index.html -------------//
			//----------------------------------------------------------//
			// Version 16.4.4
			'\'sha256-AVuOIxynOo/05KDLjyp0AoBE+Gt/KE1/vh2pS+yfqes=\' ' +
			// Version 15.8.3
			'\'sha256-r/ILW7KMSJxeo9EYqCTzZyCT0PZ9gHN1BLgki7vpR+A=\' ' +
			// Version 14.6.5
			'\'sha256-5DtSB5mj34lxcEf+HFWbBLEF49xxJaKnWGDWa/utwQA=\' ' +
			//---------------------------------------------------------//
			//------------- App.main script in index.html -------------//
			//---------------------------------------------------------//
			// Version 13.8.2
			'\'sha256-vS/MxlVD7nbY7AnV+0t1Ap338uF7vrcs7y23KjERhKc=\' ' +
			//---------------------------------------------------------//
			'; ';

		var styleHashes = '\'sha256-JjkxVHHCCVO0nllPD6hU8bBYSlsikA8TM/o3fhr0bas=\' ' + // index.html
			'\'sha256-1F7QEyp3oiW4n2eXlhilLpu+H5Wdj4t90pKtEyK/mFE=\' ' + // Minimal.js/Light
			'\'sha256-V8wOMdVocmGIO0DHZHJsKN6viAFJOJRbsJ7UhdJlmng=\' ' + // Minimal.js/Dark
			'\'sha256-7kY8ozVqKLIIBwZ24dhdmZkM26PsOlZmEi72RhmZKoM=\' ' + // mxTooltipHandler.js
			'\'sha256-01chdey79TzZe4ihnvvUXXI5y8MklIcKH+vzDdQvsuU=\' ' + // Editor.js/mathJaxWebkitCss
			'\'sha256-fGbXK7EYpvNRPca81zPnqJHi2y+34KSgAcZv8mhaSzI=\' ' + // MathJax.js
			'\'sha256-3hENQqEWUBxdkmJp2kQ2+G0F8NVGzFAVkW5vWDo7ONk=\' ' + // MathJax.js
			'\'sha256-Z4u/cxrZPHjN20CIXZHTKr+VlqVxrWG8cbbeC2zmPqI=\' ' + // MathJax.js
			'\'sha256-LDMABiyg2T48kuAV9ouqNCSEqf2OkUdlZK9D9CeZHBs=\' ' + // MathJax.js
			'\'sha256-XQfwbaSNgLzro3IzkwT0uZLAiBvZzajo0QZx7oW158E=\' ' + // MathJax.js
			'\'sha256-++XCePvZXKdegIqkwtbudr16Jx87KFh4t/t7UxsbHpw=\' ' + // MathJax.js
			'\'sha256-v9NOL6IswMbY7zpRZjxkYujhuGRVvZtp1c1MfdnToB4=\' ' + // MathJax.js
			'\'sha256-5xtuTr9UuyJoTQ76CNLzvSJjS7onwfq73B2rLWCl3aE=\' ' + // MathJax.js
			'\'sha256-W21B506Ri8aGW3T87iawssPz71NvvbYZfBfzDbBSArU=\' ' + // MathJax.js
			'\'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=\' ' + // spin.min.js
			'\'sha256-nzHi23DROym7G011m6y0DyDd9mvQL2hSJ0Gy3g2T/5Q=\' ' + // dropins.js
			'\'sha256-76P1PZLzT12kfw2hkrLn5vu/cWZgcOYuSYU3RT3rXKA=\' ' + // gapi
			'\'unsafe-hashes\'; '; // Required for hashes for style attribute

		var directives = 'connect-src %connect-src% \'self\' https://*.draw.io https://*.diagrams.net ' +
			'https://*.googleapis.com wss://*.pusher.com https://*.pusher.com ' +
			'https://api.github.com https://raw.githubusercontent.com https://gitlab.com ' +
			'https://graph.microsoft.com https://*.sharepoint.com  https://*.1drv.com https://api.onedrive.com ' +
			'https://dl.dropboxusercontent.com ' +
			'https://*.google.com https://fonts.gstatic.com https://fonts.googleapis.com; ' +
			// font-src about: is required for MathJax HTML-CSS output with STIX
			'img-src * data: blob:; media-src * data:; font-src * about:; ' +
			// www.draw.io required for browser data migration to app.diagrams.net and
			// viewer.diagrams.net required for iframe embed preview
			'frame-src %frame-src% \'self\' https://viewer.diagrams.net https://www.draw.io https://*.google.com; ' +
			'style-src %style-src% \'self\'  https://fonts.googleapis.com ' +
			// Replaces unsafe-inline style-src with hashes with safe-style-src URL parameter
			((urlParams['safe-style-src'] == '1') ? styleHashes : '\'unsafe-inline\'; ') +
			'base-uri \'none\';' +
			'child-src \'self\';' +
			'object-src \'none\';';

		var csp = hashes + directives;
		var devCsp = csp.
		// Adds script tags and loads shapes with eval
		replace(/%script-src%/g, 'https://www.dropbox.com https://api.trello.com https://devhost.jgraph.com \'unsafe-eval\'').
		// Adds Trello and Dropbox backend storage
		replace(/%connect-src%/g, 'https://*.dropboxapi.com https://trello.com https://api.trello.com').
		// Loads common.css from mxgraph
		replace(/%style-src%/g, 'https://devhost.jgraph.com').
		replace(/%frame-src%/g, '').
		replace(/  /g, ' ');

		mxmeta(null, devCsp, 'Content-Security-Policy');

		if (urlParams['print-csp'] == '1') {
			console.log('Content-Security-Policy');
			var app_diagrams_net = csp.replace(/%script-src%/g, 'https://www.dropbox.com https://api.trello.com').
			replace(/%connect-src%/g, 'https://*.dropboxapi.com https://api.trello.com').
			replace(/%frame-src%/g, '').
			replace(/%style-src%/g, '').
			replace(/  /g, ' ') + ' frame-ancestors \'self\' https://teams.microsoft.com;';
			console.log('app.diagrams.net:', app_diagrams_net);

			var se_diagrams_net = hashes.replace(/%script-src%/g, '') +
				'connect-src \'self\' https://*.diagrams.net ' +
				'https://*.googleapis.com wss://*.pusher.com https://*.pusher.com ' +
				'https://*.google.com https://fonts.gstatic.com https://fonts.googleapis.com; ' +
				'img-src * data: blob:; media-src * data:; font-src * about:; ' +
				'frame-src \'self\' https://viewer.diagrams.net https://*.google.com; ' +
				'style-src \'self\' https://fonts.googleapis.com ' + styleHashes + ' ' +
				'object-src \'none\';' +
				'frame-src \'none\';' +
				'worker-src https://se.diagrams.net/service-worker.js;'
			console.log('se.diagrams.net:', se_diagrams_net);

			// TODO remove https://ajax.googleapis.com April 2022. It's old jquery domain
			var ac_draw_io = csp.replace(/%script-src%/g, 'https://aui-cdn.atlassian.com https://connect-cdn.atl-paas.net https://ajax.googleapis.com https://cdnjs.cloudflare.com').
			replace(/%frame-src%/g, 'https://www.lucidchart.com https://app.lucidchart.com https://lucid.app blob:').
			replace(/%style-src%/g, 'https://aui-cdn.atlassian.com https://*.atlassian.net').
			replace(/%connect-src%/g, '').
			replace(/  /g, ' ');
			console.log('ac.draw.io:', ac_draw_io);

			var aj_draw_io = csp.replace(/%script-src%/g, 'https://connect-cdn.atl-paas.net').
			replace(/%frame-src%/g, 'blob:').
			replace(/%style-src%/g, 'https://aui-cdn.atlassian.com https://*.atlassian.net').
			replace(/%connect-src%/g, 'https://api.atlassian.com https://api.media.atlassian.com').
			replace(/  /g, ' ');
			console.log('aj.draw.io:', aj_draw_io);

			console.log('import.diagrams.net:', 'default-src \'self\'; worker-src blob:; img-src \'self\' blob: data: https://www.lucidchart.com ' +
				'https://app.lucidchart.com https://lucid.app; style-src \'self\' \'unsafe-inline\'; frame-src https://www.lucidchart.com https://app.lucidchart.com https://lucid.app;');
			console.log('Development:', devCsp);

			console.log('Header Worker:', 'let securityHeaders =', JSON.stringify({
				online: {
					"Content-Security-Policy": app_diagrams_net,
					"Permissions-Policy": "microphone=()"
				},
				se: {
					"Content-Security-Policy": se_diagrams_net,
					"Permissions-Policy": "microphone=()",
					"Access-Control-Allow-Origin": "https://se.diagrams.net"
				},
				teams: {
					"Content-Security-Policy": app_diagrams_net.replace(/ 'sha256-[^']+'/g, ''),
					"Permissions-Policy": "microphone=()"
				},
				jira: {
					"Content-Security-Policy": aj_draw_io,
					"Permissions-Policy": "microphone=()"
				},
				conf: {
					"Content-Security-Policy": ac_draw_io,
					"Permissions-Policy": "microphone=()"
				}
			}, null, 4));
		}
	})();
}


mxscript(drawDevUrl + 'js/cryptojs/aes.min.js', function () {
	mxscript(drawDevUrl + 'js/spin/spin.min.js', function () {
		mxscript(drawDevUrl + 'js/deflate/pako.min.js', function () {

		});
	});
});


mxscript(drawDevUrl + 'js/deflate/base64.js', function () {

});
mxscript(drawDevUrl + 'js/jscolor/jscolor.js', function () {

});
mxscript(drawDevUrl + 'js/sanitizer/sanitizer.min.js', function () {

});
mxscript(drawDevUrl + 'js/rough/rough.min.js', function () {

});



mxscript(geBasePath + '/Sidebar.js', function () {
	// Loads main classes
	mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar.js', function () {
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ActiveDirectory.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Advanced.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AlliedTelesis.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Android.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ArchiMate.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ArchiMate3.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Arrows2.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Atlassian.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS3.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS3D.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS4.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS4b.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Azure.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Azure2.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Basic.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Bootstrap.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-BPMN.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-C4.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cabinet.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cisco.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cisco19.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-CiscoSafe.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Citrix.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cumulus.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-DFD.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-EIP.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Electrical.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ER.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Floorplan.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Flowchart.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-FluidPower.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCP.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCP2.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCPIcons.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Gmdl.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-IBM.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Infographic.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Ios.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Ios7.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Kubernetes.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-LeanMapping.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Mockup.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-MSCAE.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Network.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Office.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-PID.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Rack.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Signs.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Sitemap.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Sysml.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ThreatModeling.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-UML25.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Veeam.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Veeam2.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-VVD.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-WebIcons.js', function () {

		});
	});
});
mxscript(geBasePath + '/Graph.js', function () {
	// Uses grapheditor from devhost
	mxscript(geBasePath + '/Editor.js', function () {
		mxscript(geBasePath + '/EditorUi.js', function () {
			mxscript(geBasePath + '/Menus.js', function () {});
			mxscript(drawDevUrl + 'js/diagramly/Editor.js', function () {
				mxscript(drawDevUrl + 'js/diagramly/Settings.js', function () {});
				mxscript(drawDevUrl + 'js/diagramly/EditorUi.js', function () {
					mxscript(drawDevUrl + 'js/diagramly/Menus.js', function () {});
					mxscript(drawDevUrl + 'js/diagramly/App.js', function () {});
					mxscript(drawDevUrl + 'js/diagramly/Pages.js', function () {});
					mxscript(drawDevUrl + 'js/diagramly/Trees.js', function () {});
					mxscript(drawDevUrl + 'js/diagramly/Minimal.js', function () {});
					// GraphMl Import
					mxscript(drawDevUrl + 'js/diagramly/DiffSync.js', function () {});
					mxscript(drawDevUrl + 'js/diagramly/graphml/mxGraphMlCodec.js', function () {});
					mxscript(drawDevUrl + 'js/diagramly/vsdx/importer.js', function () {});

				});
			});

		});


	});
	mxscript(geBasePath + '/Format.js', function () {

	});
	mxscript(geBasePath + '/Shapes.js', function () {

	});
});


mxscript(geBasePath + '/Actions.js', function () {

});

mxscript(geBasePath + '/Toolbar.js', function () {

});
mxscript(geBasePath + '/Dialogs.js', function () {

});




mxscript(drawDevUrl + 'js/diagramly/util/mxJsCanvas.js', function () {

});
mxscript(drawDevUrl + 'js/diagramly/util/mxAsyncCanvas.js', function () {

});

mxscript(drawDevUrl + 'js/diagramly/DrawioFile.js', function () {
	mxscript(drawDevUrl + 'js/diagramly/DrawioClient.js', function () {});
	mxscript(drawDevUrl + 'js/diagramly/DropboxFile.js', function () {
		mxscript(drawDevUrl + 'js/diagramly/DropboxClient.js', function () {});
		mxscript(drawDevUrl + 'js/diagramly/DropboxLibrary.js', function () {});
	});

	mxscript(drawDevUrl + 'js/diagramly/TrelloFile.js', function () {
		mxscript(drawDevUrl + 'js/diagramly/TrelloClient.js', function () {});
		mxscript(drawDevUrl + 'js/diagramly/TrelloLibrary.js', function () {});
	});
	
	mxscript(drawDevUrl + 'js/diagramly/NotionFile.js', function () {
		mxscript(drawDevUrl + 'js/diagramly/NotionClient.js', function () {});
		mxscript(drawDevUrl + 'js/diagramly/NotionLibrary.js', function () {});
	});
	
	mxscript(drawDevUrl + 'js/diagramly/OneDriveFile.js', function () {
		mxscript(drawDevUrl + 'js/diagramly/OneDriveClient.js', function () {});
		mxscript(drawDevUrl + 'js/diagramly/OneDriveLibrary.js', function () {});
	});

	mxscript(drawDevUrl + 'js/diagramly/DriveFile.js', function () {
		mxscript(drawDevUrl + 'js/diagramly/DriveClient.js', function () {});
		mxscript(drawDevUrl + 'js/diagramly/DriveLibrary.js', function () {});
	});
	mxscript(drawDevUrl + 'js/diagramly/LocalFile.js', function () {
		mxscript(drawDevUrl + 'js/diagramly/LocalLibrary.js', function () {});
		mxscript(drawDevUrl + 'js/diagramly/RemoteFile.js', function () {});
		mxscript(drawDevUrl + 'js/diagramly/RemoteLibrary.js', function () {});
	});
	mxscript(drawDevUrl + 'js/diagramly/StorageFile.js', function () {
		mxscript(drawDevUrl + 'js/diagramly/StorageLibrary.js', function () {

		});
		mxscript(drawDevUrl + 'js/diagramly/UrlLibrary.js', function () {

		});
	});

	mxscript(drawDevUrl + 'js/diagramly/EmbedFile.js', function () {

	});
	mxscript(drawDevUrl + 'js/diagramly/GitHubFile.js', function () {
		mxscript(drawDevUrl + 'js/diagramly/GitHubClient.js', function () {
			mxscript(drawDevUrl + 'js/diagramly/GitHubLibrary.js', function () {
				mxscript(drawDevUrl + 'js/diagramly/GitLabFile.js', function () {
					mxscript(drawDevUrl + 'js/diagramly/GitLabClient.js', function () {});
					mxscript(drawDevUrl + 'js/diagramly/GitLabLibrary.js', function () {});
				});
			});
		});

	});
});



mxscript(drawDevUrl + 'js/diagramly/Dialogs.js', function () {

});




mxscript(drawDevUrl + 'js/diagramly/DrawioFileSync.js', function () {

});

//Comments
mxscript(drawDevUrl + 'js/diagramly/DrawioComment.js', function () {
	mxscript(drawDevUrl + 'js/diagramly/DriveComment.js', function () {

	});
});


// Excluded in base.min.js

mxscript(drawDevUrl + 'js/diagramly/DrawioUser.js', function () {

});

mxscript(drawDevUrl + 'js/onedrive/mxODPicker.js', function () {

});

mxscript(drawDevUrl + 'js/diagramly/DistanceGuides.js', function () {

});
mxscript(drawDevUrl + 'js/diagramly/mxRuler.js', function () {

});
mxscript(drawDevUrl + 'js/diagramly/mxFreehand.js', function () {

});
mxscript(drawDevUrl + 'js/diagramly/DevTools.js', function () {

});

// Vsdx/vssx support
mxscript(drawDevUrl + 'js/diagramly/vsdx/VsdxExport.js', function () {

});
mxscript(drawDevUrl + 'js/diagramly/vsdx/mxVsdxCanvas2D.js', function () {

});
mxscript(drawDevUrl + 'js/diagramly/vsdx/bmpDecoder.js', function () {

});
mxscript(drawDevUrl + 'js/jszip/jszip.min.js', function () {

});



// P2P Collab
mxscript(drawDevUrl + 'js/diagramly/P2PCollab.js', function () {

})

// Org Chart Layout
if (urlParams['orgChartDev'] == '1') {
	mxscript(drawDevUrl + 'js/orgchart/bridge.min.js', function () {

	});
	mxscript(drawDevUrl + 'js/orgchart/bridge.collections.min.js', function () {

	});
	mxscript(drawDevUrl + 'js/orgchart/OrgChart.Layout.min.js', function () {

	});
	mxscript(drawDevUrl + 'js/orgchart/mxOrgChartLayout.js', function () {

	});
}