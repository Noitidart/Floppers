const {Cc, Ci, Cu, Cr} = require('chrome');
const wm = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);
const selfId = 'jid0-0uCDvyBBy2XyYBjdfX77EmWehtg';
const selfTitle = 'surfacenotes';
const selfPath = 'resource://' + selfId + '-at-jetpack/' + selfTitle + '/'; //NOTE - this must be gotten from "Properties" panel
//example: selfPath + 'data/style/global.css'
const fm = Cc['@mozilla.org/focus-manager;1'].getService(Ci.nsIFocusManager);
const sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
const ios = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
const images = {
    connect: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ+SURBVBgZlcFLSBRhAAfw/858s860aygiptIp9NChoDzkxYNUYIcO0TUIOghFUNElvEad6lBkdEqCIugi3QQfLR2yQumBaPh+7Li7o/uanfmes1972IOEQv5+Ma01DuPRh+U+StlEhSsZUnElprXGQd6kdomUsoOJaiflojXk4mIM+pZjaXCp8GslTwkOMDLlOVyoCamiXhkpVCOJRDyGpG2CCYlsgSPvh4TgACGVt21L97Y0meBCg0kNyiW28wHiJrC8VYAo0wsE+3g1vtRdquYeHyXHUfAldkohKJcIuUSjbWI5XYKXLQ5/fnk1RbDHyJTnSKHeCbF6SbVMGCteH5pxAk7cQLbAQZmAGbOQccuQZTqGGoK615M5woX6aRPdZTkn4a+7kehMmdOzMmptaDOTNkEuzxE3gaAcQITMQ42BugpVHUzIrqRjwCJVOA3nzPLvMzKScujPxnK04RbRdIQgYBxhIYSs0DRqDNSFnHUKIUG5xKZXQTweg5Potmyde9hz/quZ9RbgukWsLWQQlvxFFQkXNQbqKgFvDRhHyCRCKrC27cOxYmhrPksyP5rQMzAPd3FJZVdzoyrip+cn7yvUENSVQnajvclCSAUqlIMyCa8oYVsmoPsxM/pJRVVxam7ywTz2IKi5+WLmXqNjXI4TA5lCgIRtwjI1GqwYhJBY39hFLt0+NPtxcB7/IIPPvt9N2MaTRNwAZQKWqbGeLmFnxwf1GZhPwXz+RXH2HPsgPuVP25qT0DrCZtbHpltEwQuGlRBjEedexFVaCenOjd9R2Acp+RQb2xFMaKS3iiju+v3Tb69N4T8RGtBjK/lSRoWKKsYGvr2/nsIh/AUG0IfiieuuUQAAAABJRU5ErkJggg==',
    delete: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJdSURBVDjLpZP7S1NhGMf9W7YfogSJboSEUVCY8zJ31trcps6zTI9bLGJpjp1hmkGNxVz4Q6ildtXKXzJNbJRaRmrXoeWx8tJOTWptnrNryre5YCYuI3rh+8vL+/m8PA/PkwIg5X+y5mJWrxfOUBXm91QZM6UluUmthntHqplxUml2lciF6wrmdHriI0Wx3xw2hAediLwZRWRkCPzdDswaSvGqkGCfq8VEUsEyPF1O8Qu3O7A09RbRvjuIttsRbT6HHzebsDjcB4/JgFFlNv9MnkmsEszodIIY7Oaut2OJcSF68Qx8dgv8tmqEL1gQaaARtp5A+N4NzB0lMXxon/uxbI8gIYjB9HytGYuusfiPIQcN71kjgnW6VeFOkgh3XcHLvAwMSDPohOADdYQJdF1FtLMZPmslvhZJk2ahkgRvq4HHUoWHRDqTEDDl2mDkfheiDgt8pw340/EocuClCuFvboQzb0cwIZgki4KhzlaE6w0InipbVzBfqoK/qRH94i0rgokSFeO11iBkp8EdV8cfJo0yD75aE2ZNRvSJ0lZKcBXLaUYmQrCzDT6tDN5SyRqYlWeDLZAg0H4JQ+Jt6M3atNLE10VSwQsN4Z6r0CBwqzXesHmV+BeoyAUri8EyMfi2FowXS5dhd7doo2DVII0V5BAjigP89GEVAtda8b2ehodU4rNaAW+dGfzlFkyo89GTlcrHYCLpKD+V7yeeHNzLjkp24Uu1Ed6G8/F8qjqGRzlbl2H2dzjpMg1KdwsHxOlmJ7GTeZC/nesXbeZ6c9OYnuxUc3fmBuFft/Ff8xMd0s65SXIb/gAAAABJRU5ErkJggg==',
    disconnect: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKuSURBVDjLlZLLS5RRGMbf7zrzebdw8FaSqJAbF0GgRBvptinoPxDKRdDKQjBw2TKClgVJCwmUyMBKydDKS9TCME2tRhs1cZwZ57ud853bfB0HiiAVOvBuDuf5ve/7nEcJwxAOOgPTtk4Fr6ZU1OCAVyBCm2Td9jEdcxG5pBwEeDyZtaRwjAvWSpkAxjkITsGKqJBIuvB903upH9QdE3rd1MLW0gIVCMsBoYq8U8H2CUQNBdJZp33fCe6PbJo+4XZVmRHFhEDKCXaB4Accii0NFlfT8GNt56a6X/er56qog/Cd1aQjRRQictasR8B2EXgIQyblAbX95X9WeDSRPiriz3oZY1pvZ2dH590Z7GB+q7LcjBZHVdhMBaCpEfBsCXDR9p8V+t9lLGlUP7PXLxyJbkUMw4DZ2dm+rq6ujjPdz09xTEZrY8VWYZEh/WAwNxWHwEV1eYDsqsuOCxFDaYRQwGZ8ljeUE31+fr4PY3xFVulM5mQzC4LRypoSy037kEykvuZytDnvAQ5oNSa8scAE0JQcGIeb9LcrJl02Tj+U4gcIoanG8MU35qKzK58SaCux9ZSLoGVxvJvnPfAQrQEQEhTCRhpBYVQB61CNyZY+v6qvrzdisRgMDg6O1+kjbUt+23EpTPz2LA9wMa7QFJBuhxIWQHKHQWmBDrXHGozJuTfQ4sWBEDI9NDSUkc8zf5ueB9gubiqyVJBacBDZXQm2MhSiugZW7QkYfj/NuGi5ttd3a9uxi6bM9FhFmak5fgCmHEXqQFcVEDkBiZVt+edhz8fh7om9AHrWxV5JgWoImXMfE1jbsMHd8QF7AQQyONjxp4UQ9/YLnJ710JgaGucXUi6sr2cY84MeQfmyCOg2p3RD5PjPL69v8H0ByEWXnSR7IoPSzjEt+jDQQeE/zi9kq6pv7shelwAAAABJRU5ErkJggg==',
    lock: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ/SURBVDjLbVJBaxNBGH2bpEkTmxi1NTRKTZtoQUHEWz0Igj2I4kG9eVNQhEBO7bEHc+yv8JAiHnr2B4gFqVrQRhObljQolBSTJqZJdnZmfbNr2rU68DEz33zfm/fejGHbNrxjaWlpRCk1J6WcYZxkgPGTsWJZ1mIul/vlrTe8AIVC4Qqbl5PJ5GQsFoPP5wP36PV6qNfr2OIg0L35+fm1fwDYPMLDj+l0OmOaJmq1Gjqdjr4dgUAAiUTCqSsWixvMXV5YWOjqvW+AxOSz8fHxjBAC5XJ5s91up7gO6tDrUqn0QwOTXYZSsoO+wGDB5EwkEkGlUgGb7mSz2apHajWfz9+sVqvFVCrl1P4PYExr5m16vYUjQ+c0O11DtmN/ebD95pG9UpnGzl7Y0Xz30ir8toAtLdiWG0JIvFi76piaGG7g9plVTD/5YLgMCPLg/g0YtMTwhznfApRBfsP6kAYJSKuN57Md5oXTsvHy7aEEfZMutHZfIRAahWGMsHAICMeZVsD+HmTrG8zudyhrH+HJLGyz7wEgRSh9k4nm+nvqPIb4xWuovV5k/2lMXJ9F8+s6ARqIpk6QsIQtTC+AcGTYpBqfvgBfcJTuKMi+xKfdMCZgIp6eRK8TYu2+w2oA4PwDm+5qVK218XmNLN7xxILqKfS7pGqTWekLmuVtV65STs8hA73RqJQQP5+CP3KKACamHj7FlGBDawfH00kEW0MuA8o9AmA6qMrSHqwTIAoM08hAkHkN0ES3UYfotBGdiNFu5cr2AmgJobOPET7nhxEMuU/o40soSjO7iHbbVNgnUen6pY0/AOCTbC7PuV44H0f8Cetg5g9zP5aU7loDcfwGcrKyzYdvwUUAAAAASUVORK5CYII=',
    lock_open: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJpSURBVDjLdZLLaxNRFIe/O2kTqxmNxAopUjXWB7pwrUIXggs3oispCoqCFWG0G6H9D6Su3IjrQEAExYULF+LKlagUNL5qs4i0jRhokj6mM/dxXIyPIdgDh3s43Pvx+517lIiQjmq1etJaeyuKomPAFmPMC2PMvSAIXvKfUGlApVK57vv+/aGhIeV5HgArKyvMzc1Jq9W6MTk5+aAX0Jd6fCifz0+XSiXVaDRoNpsA+L5PqVRSYRhOl8vln/V6/XEa4P0put3uq2Kx6M/Pz9NsNi8GQaCCIFCLi4uXZmdnKRQK+bGxsTu9CrxUnTPGsLCwsBQEQfVPc2pqqgK0Op2OGhwczG9oAchYaxER23tpYmJikA1CiQiNV1fk2cxRjFNYazlz5A0Z0Yg1iElSa/vUddtPgfMKOe2J4eC1dypRIML45WMoPFRmAMVpcAr6NgECVvOxevEscBZg5Nwdvj28+c+CWAMIpvWIvtwOlMqD64eBAoiDtQ4jJ0aJw3mcWQPnkDhKAYwBJ2Bj2rW3eN4WCoeP8/35XcTtZHj0FO3PNeJwCX/PdkQsouM0QIMIYjWFgwfwsjtAOWxked8aYJiYwr69rK/mELMG4v4CPADRGhELVrP0YYZ27TV4BrfuiMIIJKb95RPtr43ErnOI1ikFWidUG1PYv4fM5iJ4MeUL45S1ge4Ptu0bItvtTxQ46QXE4BzOxLRrNTKbfdiUh74sOAPdNuHST/TqMv7wVgSX2E4DRCy5XVcZ2J1BZXPJF3r94CzEIX64jNUR4mwyL2NSgDii/uR2MgtjEKN/p/l7Ym2yWNYmtUsW9hfAtnFXLnJPWAAAAABJRU5ErkJggg==',
    pages: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIpSURBVDjLddM9aFRBFIbh98zM3WyybnYVf4KSQjBJJVZBixhRixSaShtBMKUoWomgnaCxsJdgIQSstE4nEhNREgyoZYhpkogkuMa4/3fuHIu7gpLd00wz52POMzMydu/Dy958dMwYioomIIgqDa+VnWrzebNUejY/NV6nQ8nlR4ufXt0fzm2WgxUgqBInAWdhemGbpcWNN9/XN27PPb1QbRdgjEhPqap2ZUv5+iOwvJnweT1mT5djZKjI6Ej/udz+wt1OJzAKYgWyDjJWyFghmzFsbtcY2gsTJwv09/Vc7RTgAEQgsqAKaoWsM8wu/z7a8B7vA8cHD3Fr+ktFgspO3a+vrdVfNEulJ/NT4zWngCBYY1oqSghKI465fvYwW+VAatPX07IZmF7YfrC0uDE8emPmilOFkHYiBKxAxhmSRPlZVVa2FGOU2Ad2ap4zg92MDBXJZczFmdflx05VEcAZMGIIClZASdesS2cU/dcm4sTBArNzXTcNakiCb3/HLRsn4Fo2qyXh3WqDXzUlcgYnam3Dl4Hif82dbOiyiBGstSjg4majEpl8rpCNUQUjgkia0M5GVAlBEBFUwflEv12b/Hig6SmA1iDtzhcsE6eP7LIxAchAtwNVxc1MnhprN/+lh0txErxrPZVdFdRDEEzHT6LWpTbtq+HLSDDiOm2o1uqlyOT37bIhHdKaXoL6pqhq24Dzd96/tUYGwPSBVv7atFglaFIu5KLuPxeX/xsp7aR6AAAAAElFTkSuQmCC'
}

var gNoteData = [];

Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/FileUtils.jsm');
var dbFile;
var dbConn;

var tableStructure = ['id', 'type', 'url_regex', 'anchor_sensitive', 'body', 'style', 'caret_start', 'caret_end', 'scroll_x', 'scroll_y', 'attachment']; //NOTE: if i change the order or wording in table structure i need to update noteData in createNewNote function ALSO update the insert statement of createNewNote

//os.notifyObservers(null, 'myTopicID', 'someAdditionalInformationPassedAs\'Data\'Parameter');

var { Hotkey } = require("hotkeys");
 
var showHotKey = Hotkey({
  combo: "accel-shift-z",
  onPress: function() {
    toggleNoteVisibility();
  }
});
var hideHotKey = Hotkey({
  combo: "accel-shift-x",
  onPress: function() {
    createNewNote();
  }
});

function toggleNoteVisibility() {

    var win = wm.getMostRecentWindow('navigator:browser');
    
    var notes = win.gBrowser.contentDocument.querySelectorAll('.surfaceNote');
    if (notes.length == 0) {
        return;
    }
    var multiStates = false;
    var lastState = notes[0].style.display;
    for (var i=0; i<notes.length; i++) {
        if (notes[i].style.display != lastState) {
            multiStates = true;
        }
    }
    
    var newState;
    if (multiStates) {
        newState = '';
    } else {
        newState = lastState == '' ? 'none' : '';
    }
    



    for (var i=0; i<notes.length; i++) {
        notes[i].style.display = newState;
    }
}

function domInsertNote(domWin, noteData, initFocus) {
    //noteData must be object containing defaultRowStructure data
    var doc = domWin.document;
    var cont = doc.getElementById('surfaceNotesCont');
    //start - insert the note stuff
    var note = doc.createElement('div');
    var noteProps = {
        class: 'surfaceNote',
    	noteid: noteData.id,
		url_regex: escape(noteData.url_regex),
		anchor_sensitive: note.anchor_sensitive,
		style: noteData.style,
		caret_start: noteData.caret_start,
		caret_end: noteData.caret_end,
		scroll_x: note.scroll_x,
		scroll_y: note.scroll_y,
		attachment: note.attachment
    };
	
    for (var p in noteProps) {
        note.setAttribute(p, noteProps[p]);
    }
    
    var title = doc.createElement('span');
    var titleProps = {
        //innerHTML: 'X P ? -- Title'
    };
    for (var p in titleProps) {
        title.setAttribute(p, titleProps[p]);
    }
    
        var deleteIcon = doc.createElement('img');
        deleteIcon.setAttribute('src', images.delete);
        deleteIcon.addEventListener('click', deleteNote, false);
        deleteIcon.addEventListener('dragstart', function(e){e.preventDefault();e.returnValue = false;e.stopPropagation();return false;}, false);
    
        var sitesIcon = doc.createElement('img');
        sitesIcon.setAttribute('src', images.pages);
        sitesIcon.addEventListener('click', manageSites, false);
        sitesIcon.addEventListener('dragstart', function(e){e.preventDefault();e.returnValue = false;e.stopPropagation();return false;}, false);
        
        var lockIcon = doc.createElement('img');
        if (noteData.style.indexOf('fixed') > -1) {
            lockIcon.setAttribute('src', images.lock);
        } else {
            lockIcon.setAttribute('src', images.lock_open);
        }
        lockIcon.addEventListener('click', toggleLock, false);
        lockIcon.addEventListener('dragstart', function(e){e.preventDefault();e.returnValue = false;e.stopPropagation();return false;}, false);
        
        var connIcon = doc.createElement('img');
        if (noteData.attachment != '') {
            connIcon.setAttribute('src', images.disconnect);
        } else {
            connIcon.setAttribute('src', images.connect);
        }
        connIcon.setAttribute('draggable', 'true');
        connIcon.setAttribute('noteConnect', 'true');
        connIcon.addEventListener('click', disconnectNote, false);
        connIcon.addEventListener('dragstart', connectNoteStart, false);
        connIcon.addEventListener('dragend', connectNoteEnd, false);

    title.appendChild(sitesIcon);
    title.appendChild(lockIcon);
    title.appendChild(connIcon);
    title.appendChild(deleteIcon);

    var body = doc.createElement('div');
    if (initFocus) {
        var bodyProps = {
            contentEditable: 'true',
            designMode: 'on'
        };
        for (var p in bodyProps) {
            body.setAttribute(p, bodyProps[p]);
        }
    }
    body.innerHTML = noteData.body;
    
    note.addEventListener('click', noteClicked, true);
    note.addEventListener('dblclick', noteDblClicked, true);
    note.addEventListener('mousedown', noteDowned, true);
    note.addEventListener('mouseup', noteUpped, true);
    note.addEventListener('dragstart', noteDragStarted, true);
    note.addEventListener('dragend', noteDragEnded, true);
    
    body.addEventListener('click', bodyClicked, true);
    body.addEventListener('dblclick', bodyDblClicked, true);
    body.addEventListener('blur', bodyBlurred, true);
    body.addEventListener('mousedown', bodyDowned, true);
    body.addEventListener('mouseup', bodyUpped, true);
    body.addEventListener('keypress', bodyKeyed, true);
    
    note.appendChild(body);
    note.appendChild(title);
    
    if (!cont) {
        //domWin.alert('cont not found so creatinging and inserting')
        cont = doc.createElement('div');
        var contProps = {
            id: 'surfaceNotesCont'
        };
        for (var p in contProps) {
            cont.setAttribute(p, contProps[p]);
        }
        doc.body.insertBefore(cont, doc.body.childNodes[0]);
    }
    cont.appendChild(note);
    if (initFocus) {
        body.focus();
    }
}

function createNewNote(e) {
    var win = wm.getMostRecentWindow('navigator:browser');
    var doc = win.gBrowser.contentDocument;
    

        
        
        if (!e) { //if there is no e then we are coming from hotkey, if there is e it is coming from contextclick
            var xulRuntime = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime);
            //FOR WINDOWS ONLY
            if (xulRuntime.OS == 'WINNT') {
                Cu.reportError('IS WINDOWS');
                Cu.import("resource://gre/modules/ctypes.jsm");
                var lib = ctypes.open("user32.dll");
                const struct_lpPoint = new ctypes.StructType("lpPoint",[ { "x": ctypes.int },{ "y": ctypes.int } ]);
                var GetCursorPos = lib.declare('GetCursorPos', ctypes.winapi_abi, ctypes.bool, struct_lpPoint.ptr);
                var point = new struct_lpPoint;
                var ret = GetCursorPos(point.address());
                var noteLeft = point.x;
                var noteTop = point.y;
                var browserTop = win.gBrowser.boxObject.screenY;
                var browserBottom = win.gBrowser.boxObject.screenY + win.gBrowser.boxObject.height;
                var browserLeft = win.gBrowser.boxObject.screenX;
                var browserRight = win.gBrowser.boxObject.screenX + win.gBrowser.boxObject.width;
                
                if (point.x < browserLeft) {
                    point.x = browserLeft;
                }
                if (point.x > browserRight) {
                    point.x = browserRight;
                }
                if (point.y < browserTop) {
                    point.y = browserTop;
                }
                if (point.y > browserBottom) {
                    point.y = browserBottom;
                }
                var yInBrowser = point.y - browserTop + win.gBrowser.contentWindow.scrollY;
                var xInBrowser = point.x - browserLeft + win.gBrowser.contentWindow.scrollX;
                var xInBrowserNoScrollForElementFromPoint = point.x - browserLeft;
                var yInBrowserNoScrollForElementFromPoint = point.y - browserTop;
                var frameElementWin;
                var elemAtPoint = win.gBrowser.contentDocument.elementFromPoint(xInBrowserNoScrollForElementFromPoint, yInBrowserNoScrollForElementFromPoint);
                if (!elemAtPoint || !elemAtPoint.contentWindow) {
                    frameElementWin = doc.defaultView;
                } else {
                    Cu.reportError('frame element found so setting it!!');
                    frameElementWin = elemAtPoint.contentWindow;
                    var boxObject = elemAtPoint.getBoundingClientRect();
                    var frameTop = browserTop + boxObject.top;
                    var frameBottom = frameTop + boxObject.height;
                    var frameLeft = browserLeft + boxObject.left;
                    var frameRight = frameLeft + boxObject.width;
                    
                    if (point.x < frameLeft) {
                        point.x = frameLeft
                    }
                    if (point.x > frameRight) {
                        point.x = frameRight;
                    }
                    if (point.y < frameTop) {
                        point.y = frameTop;
                    }
                    if (point.y > frameBottom) {
                        point.y = frameBottom;
                    }
                    
                    var yInFrame = point.y - frameTop + frameElementWin.scrollY;
                    var xInFrame = point.x - frameLeft + frameElementWin.scrollX;
                    yInBrowser = yInFrame;
                    xInBrowser = xInFrame;
                    
                }
            } else { //END FOR WINDOWS ONLY
                var yInBrowser = win.gBrowser.contentWindow.scrollY;
                var xInBrowser = win.gBrowser.contentWindow.scrollX;
                var elemAtPoint = win.gBrowser.contentDocument.elementFromPoint(0, 0);
                var frameElementWin;
                if (!elemAtPoint || !elemAtPoint.contentWindow) {
                    frameElementWin = doc.defaultView;
                } else {
                    Cu.reportError('frame element found so setting it!!');
                    frameElementWin = frameElementWin.ownerDocument.defaultView;
                    var boxObject = elemAtPoint.getBoundingClientRect();
                    var frameTop = browserTop + boxObject.top;
                    var frameBottom = frameTop + boxObject.height;
                    var frameLeft = browserLeft + boxObject.left;
                    var frameRight = frameLeft + boxObject.width;
                    
                    if (point.x < frameLeft) {
                        point.x = frameLeft
                    }
                    if (point.x > frameRight) {
                        point.x = frameRight;
                    }
                    if (point.y < frameTop) {
                        point.y = frameTop;
                    }
                    if (point.y > frameBottom) {
                        point.y = frameBottom;
                    }
                    
                    var yInFrame = point.y - frameTop + frameElementWin.scrollY;
                    var xInFrame = point.x - frameLeft + frameElementWin.scrollX;
                    yInBrowser = yInFrame;
                    xInBrowser = xInFrame;
                }
            }
        }
        
    var cont = frameElementWin.document.getElementById('surfaceNotesCont');
        var maxZI = 0; //holds largest z-index out of all notes
        if (cont) {
            var notes = frameElementWin.document.querySelectorAll('.surfaceNote');
            for (var i=0; i<notes.length; i++) {
                var cZI = parseInt(notes[i].style.zIndex);
                if (cZI > maxZI) {
                    maxZI = cZI;
                }
            }
        }
        
        var noteData = {
            type: 0,
            url_regex: escapeRegExp(frameElementWin.document.location + ''),
            anchor_sensitive: 0,
            body: '',
            style: 'width:250px; height:225px; left:' + xInBrowser + 'px; top:' + yInBrowser + 'px; position:absolute; z-index:' + (maxZI + 1),
            caret_start: 0,
            caret_end: 0,
            scroll_x: 0,
            scroll_y: 0,
            attachment: null,
        }
        
        let s627474 = dbConn.createStatement('INSERT INTO main VALUES(NULL, 0, "' + noteData.url_regex + '", 0, "", "' + noteData.style + ';", 0, 0, 0, 0, NULL)');
        s627474.executeAsync({
            handleError: function (aError) {
                Cu.reportError('s627474 Error: ' + aError.message);
            },
            handleCompletion: function (aReason) {
                if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
            	    Cu.reportError('s627474 Query canceled or aborted!');
        		}
                noteData.id = dbConn.lastInsertRowID;
                domInsertNote(frameElementWin, noteData, true);
                
                      let windows = wm.getEnumerator("navigator:browser");
                      while (windows.hasMoreElements()) {
                        let browserWin = windows.getNext();
                        if (!browserWin.gBrowser) { continue }
                        var tabbrowser = browserWin.gBrowser;
                        var numTabs = tabbrowser.browsers.length;
                		for (var index = 0; index < numTabs; index++) {
        					var currentBrowser = tabbrowser.getBrowserAtIndex(index);
        					var win = currentBrowser.contentWindow;
        					var frames = win.frames;
        					var winArr = [];
        					winArr.push(win);
        					for (var i=0; i<frames.length; i++) {
        						winArr.push(frames[i].window);
        					}
							
							var fStrDump = 'Window = "' + win.document.location + '"\nTotal Frames = ' + frames.length + '\n\n';
        					for (var h=0; h<winArr.length; h++) {
        						if (h > 0) {fStrDump += 'Frame = "' + winArr[h].document.location + '"\n';}
                                if (winArr[h] != frameElementWin) {
        						//if url matches url_regex AND winArr[h] != frameElementWin then insert BUT with focus false
            						var cPatt = new RegExp(noteData.url_regex, 'im');
                                    var loc = winArr[h].document.location;
        							if (cPatt.test(loc)) {
        								//matches so insert note
        								Cu.reportError('match of location ' + loc + ' to patt of urlPatts[i] ' + noteData.url_regex);
        								if (h > 0) {Cu.reportError('INSERTED INTO FRAME!!!');}
        								domInsertNote(winArr[h], noteData);
        							}
                                } else {
                                    Cu.reportError('NOT INSERTING INTO THIS AS IT IS FRAMELEMENTWIN AND WE ARE CURRENTLY INSERTING HERE WITH FOCUS ALREADY!!!');
                                }
        					}
		                    /* NOTE: i programmed the frames stuff in above */
Cu.reportError(fStrDump);
                		}
                      }
        	}
        });
    
}

//start - note functions
function deleteNote(e) {
    var note = e.target;
    while (!note.hasAttribute('noteid')) {
      note = note.parentNode;
    }
    var noteid = note.getAttribute('noteid');
    
    let s874084 = dbConn.createStatement('DELETE FROM main WHERE id = ' + noteid);
    s874084.executeAsync({
        handleError: function (aError) {
            Cu.reportError('s874084 Error: ' + aError.message);
    	},
    	handleCompletion: function (aReason) {
    		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
        	    Cu.reportError('s874084 Query canceled or aborted!');
    		}
            
            //go through all windows/tabs and if finds this noteid then update its innerHTML
              let windows = wm.getEnumerator("navigator:browser");
              while (windows.hasMoreElements()) {
                let browserWin = windows.getNext();
                if (!browserWin.gBrowser) { continue }
                var tabbrowser = browserWin.gBrowser;
        		var numTabs = tabbrowser.browsers.length;
        		for (var index = 0; index < numTabs; index++) {
					var currentBrowser = tabbrowser.getBrowserAtIndex(index);
					var win = currentBrowser.contentWindow;
					var frames = win.frames;
					var winArr = [];
					winArr.push(win);
					for (var i=0; i<frames.length; i++) {
						winArr.push(frames[i].window);
					}
					
					var fStrDump = 'Window = "' + win.document.location + '"\nTotal Frames = ' + frames.length + '\n\n';
					for (var h=0; h<winArr.length; h++) {
						if (h > 0) {fStrDump += 'Frame = "' + winArr[h].document.location + '"\n';}
						var doc = winArr[h].document;
						var sameNote = doc.querySelector('div[noteid="' + noteid + '"]');
						if (sameNote) {
							if (h > 0) {Cu.reportError('DELED INTO FRAME!!!');}
							sameNote.parentNode.removeChild(sameNote);
						}
					}
                    /* NOTE: i programmed the frames stuff in above */
Cu.reportError(fStrDump);
        		}
              }
    	}
    });
}

function toggleLock(e) {
    var note = e.target;
    while (!note.hasAttribute('noteid')) {
      note = note.parentNode;
    }
    var noteid = note.getAttribute('noteid');
    
    if (note.style.position == 'absolute') {
        note.style.position = 'fixed';
        e.target.setAttribute('src', images.lock);
    } else {
        note.style.position = 'absolute';
        e.target.setAttribute('src', images.lock_open);
    }
    var style = note.getAttribute('style');
    let s540684 = dbConn.createStatement('UPDATE main SET style="' + style+ '"  WHERE id = ' + noteid);
    s540684.executeAsync({
        handleError: function (aError) {
            Cu.reportError('s540684 Error: ' + aError.message);
        },
    	handleCompletion: function (aReason) {
    		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
        	    Cu.reportError('s540684 Query canceled or aborted!');
    		}
            
            //go through all windows/tabs and if finds this noteid then update its innerHTML
              let windows = wm.getEnumerator("navigator:browser");
              while (windows.hasMoreElements()) {
                let browserWin = windows.getNext();
                if (!browserWin.gBrowser) { continue }
                var tabbrowser = browserWin.gBrowser;
        		var numTabs = tabbrowser.browsers.length;
        		for (var index = 0; index < numTabs; index++) {
					var currentBrowser = tabbrowser.getBrowserAtIndex(index);
					var win = currentBrowser.contentWindow;
					var frames = win.frames;
					var winArr = [];
					winArr.push(win);
					for (var i=0; i<frames.length; i++) {
						winArr.push(frames[i].window);
					}
					
					var fStrDump = 'Window = "' + win.document.location + '"\nTotal Frames = ' + frames.length + '\n\n';
					for (var h=0; h<winArr.length; h++) {
						if (h > 0) {fStrDump += 'Frame = "' + winArr[h].document.location + '"\n';}
						var doc = winArr[h].document;
						var sameNote = doc.querySelector('div[noteid="' + noteid + '"]');
						if (sameNote) {
							if (h > 0) {Cu.reportError('MODDED INTO FRAME!!!');}
							sameNote.setAttribute('style', style);
						}
					}
                    /* NOTE: i programmed the frames stuff in above */
Cu.reportError(fStrDump);
        		}
              }
    	}
    });
}

function disconnectNote() {
    
}

function connectNoteStart() {
    
}

function connectNoteEnd() {
    
}

function manageSites(e) {
    var note = e.target;
    while (!note.hasAttribute('noteid')) {
      note = note.parentNode;
    }
    var body = note.childNodes[0];
    var window = note.ownerDocument.defaultView;
    
    var promptfact = Cc['@mozilla.org/prompter;1'].getService(Ci.nsIPromptFactory);
    var prompt = promptfact.getPrompt(window, Ci.nsIPrompt);
    var promptbag = prompt.QueryInterface(Ci.nsIWritablePropertyBag2);
    promptbag.setPropertyAsBool('allowTabModal', true);
    
    var check = {value: note.getAttribute('anchor_sensitive') == 0 ? false : true};
    var input = {value: unescape(note.getAttribute('url_regex'))};
    try {
        var ok = prompt.prompt.apply(null, ['SurfaceNotes', 'Site Pattern', input, 'Anchor Sensitive', check]);
    } catch (ex) {
        //aborted
		ok = null;
    }
	
	if (ok) {
		
        var noteData = {
            url_regex: input.value, //possible new value
            anchor_sensitive: check.value ? 1 : 0, //possible new value
            body: body.innerHTML,
            style: note.getAttribute('style'),
            caret_start: note.getAttribute('caret_start'),
            caret_end: note.getAttribute('caret_end'),
            scroll_x: note.getAttribute('scroll_x'),
            scroll_y: note.getAttribute('scroll_y'),
            attachment: note.getAttribute('attachment')
        };
		
		check.value = check.value ? 1 : 0;
		input.value = escape(input.value);
		
		var updateStr = [];
		if (check.value != note.getAttribute('anchor_sensitive')) {
			updateStr.push('anchor_sensitive = ' + check.value);
		}
		if (input.value != note.getAttribute('url_regex')) {
			updateStr.push('url_regex = "' + input.value + '"');
			try {
				var testPatt = new RegExp(unescape(input.value), 'im');
			} catch (pattEx) {
				prompt.prompt.apply(null, ['SurfaceNotes - Error', 'Site Pattern Regex Failed']);
				return;
			}
		}
		if (updateStr.length > 0) {
			Cu.reportError('anchor AND/OR regex changed');
			updateString = updateStr.join(' AND ').replace(/"/g, '\"');
			let s141485 = dbConn.createStatement('UPDATE main SET ' + updateString + ' WHERE id = ' + noteid);
			s141485.executeAsync({
				handleError: function (aError) {
					Cu.reportError('s141485 Error: ' + aError.message);
				},
				handleCompletion: function (aReason) {
					if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
						Cu.reportError('s141485 Query canceled or aborted!');
					}
					
					//go through all windows/tabs and if finds this noteid then update its innerHTML
					  let windows = wm.getEnumerator("navigator:browser");
					  while (windows.hasMoreElements()) {
						let browserWin = windows.getNext();
						if (!browserWin.gBrowser) { continue }
						var tabbrowser = browserWin.gBrowser;
						var numTabs = tabbrowser.browsers.length;
						for (var index = 0; index < numTabs; index++) {
							var currentBrowser = tabbrowser.getBrowserAtIndex(index);
							var win = currentBrowser.contentWindow;
							var frames = win.frames;
							var winArr = [];
							winArr.push(win);
							for (var i=0; i<frames.length; i++) {
								winArr.push(frames[i].window);
							}
							
							var fStrDump = 'Window = "' + win.document.location + '"\nTotal Frames = ' + frames.length + '\n\n';
							for (var h=0; h<winArr.length; h++) {
								if (h > 0) {fStrDump += 'Frame = "' + winArr[h].document.location + '"\n';}
								var doc = winArr[h].document;
								var loc = winArr[h].location;
								
								var sameNote = doc.querySelector('div[noteid="' + noteid + '"]');
								if (sameNote) {
									if (h > 0) {Cu.reportError('MODDED IN FRAME!!!');}
									sameNote.setAttribute('anchor_sensitive', check.value);
									sameNote.setAttribute('url_regex', input.value);
									
									sameNote.querySelector('div').innerHTML = body.innerHTML;
									sameNote.setAttribute('style', style);
									
									var cPatt = new RegExp(unescape(input.value), 'im');
									if (!cPatt.test(loc)) {
										//does not match so remove note
										sameNote.parentNode.removeChild(sameNote);
									}
								} else {
									var cPatt = new RegExp(unescape(input.value), 'im');
									if (cPatt.test(loc)) {
										//url matches and we dont have this url here so insert it
										domInsertNote(win, noteData);
									}
								}
								
								
							}
							/* NOTE: i programmed the frames stuff in above */
		Cu.reportError(fStrDump);
						}
					  }
				}
			});
		}
	}


}

function acceptCommit(e) {
    var note = e.target;
    while (!note.hasAttribute('noteid')) {
      note = note.parentNode;
    }
    var body = note.childNodes[0];
    var noteid = note.getAttribute('noteid');
    Cu.reportError('noteid="' + noteid + '"');
    
        var style = note.getAttribute('style');
        var patt = / ?border\:.*;/;
        var origStyle = style;
        Cu.reportError('origStyle=' + style);
        if (note.scrollHeight > note.clientHeight) {
            //scrollbars are there
            if (!patt.test(style)) {
                style += ' border:0;';
                note.setAttribute('style', style);
            }
        } else {
            //NO scrollbars
            if (patt.test(style)) {
                style = style.replace(patt, '');
                note.setAttribute('style', style);
            }
        }
        if (origStyle != style) {
            Cu.reportError('style changed to:"' + style + '"');
        }
    
    //need to update value
    let s035014 = dbConn.createStatement('UPDATE main SET body="' + body.innerHTML.replace(/"/g, '\"') + '", style="' + style + '" WHERE id = ' + noteid);
    s035014.executeAsync({
        handleError: function (aError) {
        	Cu.reportError('s035014 Error: ' + aError.message);
    	},
    	handleCompletion: function (aReason) {
    		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
        	    Cu.reportError('s035014 Query canceled or aborted!');
    		}
            
            //go through all windows/tabs and if finds this noteid then update its innerHTML
              let windows = wm.getEnumerator("navigator:browser");
              while (windows.hasMoreElements()) {
                let browserWin = windows.getNext();
                if (!browserWin.gBrowser) { continue }
                var tabbrowser = browserWin.gBrowser;
        		var numTabs = tabbrowser.browsers.length;
        		for (var index = 0; index < numTabs; index++) {
					var currentBrowser = tabbrowser.getBrowserAtIndex(index);
					var win = currentBrowser.contentWindow;
					var frames = win.frames;
					var winArr = [];
					winArr.push(win);
					for (var i=0; i<frames.length; i++) {
						winArr.push(frames[i].window);
					}
					
					var fStrDump = 'Window = "' + win.document.location + '"\nTotal Frames = ' + frames.length + '\n\n';
					for (var h=0; h<winArr.length; h++) {
						if (h > 0) {fStrDump += 'Frame = "' + winArr[h].document.location + '"\n';}
						var doc = winArr[h].document;
						var sameNote = doc.querySelector('div[noteid="' + noteid + '"]');
						if (sameNote) {
							if (h > 0) {Cu.reportError('MODDED INTO FRAME!!!');}
							sameNote.querySelector('div').innerHTML = body.innerHTML;
							sameNote.setAttribute('style', style);
						}
					}
                    /* NOTE: i programmed the frames stuff in above */
Cu.reportError(fStrDump);
        		}
              }
    	}
    });
    
}

function cancelCommit(e) {
    var note = e.target;
    while (!note.hasAttribute('noteid')) {
      note = note.parentNode;
    }
    var body = note.childNodes[0];
    var noteid = note.getAttribute('noteid');
    Cu.reportError('noteid="' + noteid + '"');
    
    //is a saved note so revert changes
    //note.style.background = 'transparent url(' + selfPath + 'data/imgs/loading.gif) no-repeat center center;';
    let s823154 = dbConn.createStatement('SELECT body FROM main WHERE id = ' + noteid);
    s823154.executeAsync({
        handleResult: function(aResultSet) {
            //note.style.background = '';
            let row = aResultSet.getNextRow();
            body.innerHTML = row.getResultByName('body');
        },
        handleError: function (aError) {
    		Cu.reportError('s823154 Error: ' + aError.message);
    	},
    	handleCompletion: function (aReason) {
    		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
        	    Cu.reportError('s823154 Query canceled or aborted!');
    		}
    	}
    });
}

function noteClicked(e) {
    Cu.reportError('note clicked');
}

function noteUpped(e) {
    Cu.reportError('note upped');
    var note = e.target;
    while (!note.hasAttribute('noteid')) {
      note = note.parentNode;
    }
    var noteid = note.getAttribute('noteid');
    nowWidth = e.target.style.width;
    nowHeight = e.target.style.height;
    
    if (nowWidth != lastWidth[noteid] || nowHeight != lastHeight[noteid]) {
        Cu.reportError('noteid ' + noteid + ' was resized!');
        var style = note.getAttribute('style');
        var patt = / ?border\:.*;/;
        var origStyle = style;
        Cu.reportError('origStyle=' + style);
        if (note.scrollHeight > note.clientHeight) {
            //scrollbars are there
            if (!patt.test(style)) {
                style += ' border:0;';
                note.setAttribute('style', style);
            }
        } else {
            //NO scrollbars
            if (patt.test(style)) {
                style = style.replace(patt, '');
                note.setAttribute('style', style);
            }
        }
        if (origStyle != style) {
            Cu.reportError('style changed to:"' + style + '"');
        }
        let s321082 = dbConn.createStatement('UPDATE main SET style="' + style + '"  WHERE id = ' + noteid);
        s321082.executeAsync({
            handleError: function (aError) {
                Cu.reportError('s321082 Error: ' + aError.message);
            },
            handleCompletion: function (aReason) {
        		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
            	    Cu.reportError('s321082 Query canceled or aborted!');
        		}
                
                //go through all windows/tabs and if finds this noteid then update its innerHTML
                  let windows = wm.getEnumerator("navigator:browser");
                  while (windows.hasMoreElements()) {
                    let browserWin = windows.getNext();
                    if (!browserWin.gBrowser) { continue }
                    var tabbrowser = browserWin.gBrowser;
            		var numTabs = tabbrowser.browsers.length;
            		for (var index = 0; index < numTabs; index++) {
						var currentBrowser = tabbrowser.getBrowserAtIndex(index);
						var win = currentBrowser.contentWindow;
						var frames = win.frames;
						var winArr = [];
						winArr.push(win);
						for (var i=0; i<frames.length; i++) {
							winArr.push(frames[i].window);
						}
						
						var fStrDump = 'Window = "' + win.document.location + '"\nTotal Frames = ' + frames.length + '\n\n';
					for (var h=0; h<winArr.length; h++) {
						if (h > 0) {fStrDump += 'Frame = "' + winArr[h].document.location + '"\n';}
							var doc = winArr[h].document;
							var sameNote = doc.querySelector('div[noteid="' + noteid + '"]');
							if (sameNote) {
								if (h > 0) {Cu.reportError('MODDED INTO FRAME!!!');}
								sameNote.setAttribute('style', style);
							}
						}
                    /* NOTE: i programmed the frames stuff in above */
Cu.reportError(fStrDump);
            		}
                  }
        	}
        });
    }
}

var lastWidth = {}; //used for detecting resized
var lastHeight = {}; //used for detecting resized
function noteDowned(e) {
    Cu.reportError('note downed');
    var note = e.target.parentNode.hasAttribute('noteid') ? e.target.parentNode : e.target;
    var noteid = note.getAttribute('noteid');
    lastWidth[noteid] = e.target.style.width;
    lastHeight[noteid] = e.target.style.height;
    
    var note = e.target;
    while (!note.hasAttribute('noteid')) {
      note = note.parentNode;
    }
    var body = note.childNodes[0];
    var noteid = note.getAttribute('noteid');
}

function noteDblClicked(e) {
    Cu.reportError('note dblclicked');
}

function bodyClicked(e) {
    Cu.reportError('body click');

    
}
function bodyDblClicked(e) {
    Cu.reportError('body dbl click');
    
    return;
    //set caret position and scroll position of body to what is in db, body should already be editable in designmode because noteclicked should have already fired
    var note = e.target;
    while (!note.hasAttribute('noteid')) {
      note = note.parentNode;
    }
    var body = note.childNodes[0];
    //note.style.background = 'transparent url(' + selfPath + 'data/imgs/loading.gif) no-repeat center center;';
    let s095555 = dbConn.createStatement('SELECT caret_start,caret_end,scroll_x,scroll_y FROM main WHERE id = ' + noteid);
    s095555.executeAsync({
        handleResult: function(aResultSet) {
            //note.style.background = '';
            let row = aResultSet.getNextRow();
            body.innerHTML = row.getResultByName('body');
            //for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
            //    let value = row.getResultByName("column_name");
            //}
        },
        handleError: function (aError) {
            Cu.reportError('s095555 Error: ' + aError.message);
        },
        handleCompletion: function (aReason) {
    		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
        	    Cu.reportError('s095555 Query canceled or aborted!');
    		}
    	}
    });
}

function bodyBlurred(e) {
    Cu.reportError('body blurred');
    
    var note = e.target;
    while (!note.hasAttribute('noteid')) {
      note = note.parentNode;
    }
    var body = note.childNodes[0];
    
    if (body.contentEditable == 'true') {
        body.contentEditable = false;
        body.designMode = 'off';
        acceptCommit(e);
    }
    
}

function bodyDowned(e) {
    Cu.reportError('body downed');
    var note = e.target;
    while (!note.hasAttribute('noteid')) {
      note = note.parentNode;
    }
    var body = note.childNodes[0];
    var noteid = note.getAttribute('noteid');
    if (e.ctrlKey) {
        note.setAttribute('draggable', 'true');
        return;
    }
}

function bodyUpped(e) {
    Cu.reportError('body upped');
        
    var note = e.target;
    while (!note.hasAttribute('noteid')) {
      note = note.parentNode;
    }
    var body = note.childNodes[0];
    
    var win = note.ownerDocument.defaultView;

    if (note.getAttribute('draggable') == 'true') {
        note.setAttribute('draggable', 'false');
        return;

    }
    if (e.button == 0 && body.contentEditable != 'true') {
        body.contentEditable = true;
        body.designMode = 'on';
        body.focus();
    }
}

function noteDragStarted(e) {
    Cu.reportError('noteDragStarted');
    //if (e.target.tagName != 'div') { e.preventDefault(); e.stopPropagation(); e.returnValue = false; return false}
    if (!e.ctrlKey) { return }
      e.dataTransfer.setData('text/plain', e.screenX + ',' + e.screenY); // required otherwise doesn't work
  e.dataTransfer.effectAllowed = 'move';
      this.addEventListener('drag', noteDragged, false);
}

function noteDragged(e) {
    Cu.reportError('noteDragged');
    this.classList.add('inDrag');
	this.removeEventListener('drag', noteDragged, false);
}

function noteDragEnded(e) {
    this.setAttribute('draggable', 'false');
    Cu.reportError('noteDragEnded');
    //this.style.opacity = '1';  // this / e.target is the source node.
    this.classList.remove('inDrag')
	var start_coords = e.dataTransfer.getData('text/plain').split(',')
	var offset_x = e.screenX - parseInt(start_coords[0]);
	var offset_y = e.screenY - parseInt(start_coords[1]);
	this.style.left = (parseInt(this.style.left) + offset_x) + 'px';
	this.style.top = (parseInt(this.style.top) + offset_y) + 'px';
    
    
    var note = this;
    var noteid = note.getAttribute('noteid');
    var style = note.getAttribute('style');
    let s048248 = dbConn.createStatement('UPDATE main SET style="' + style + '" WHERE id = ' + noteid);
    s048248.executeAsync({
        handleError: function (aError) {
            Cu.reportError('s048248 Error: ' + aError.message);
        },
        handleCompletion: function (aReason) {
    		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
        	    Cu.reportError('s048248 Query canceled or aborted!');
    		}
            
            //go through all windows/tabs and if finds this noteid then update its innerHTML
              let windows = wm.getEnumerator("navigator:browser");
              while (windows.hasMoreElements()) {
                let browserWin = windows.getNext();

                if (!browserWin.gBrowser) { continue }
                var tabbrowser = browserWin.gBrowser;
        		var numTabs = tabbrowser.browsers.length;
        		for (var index = 0; index < numTabs; index++) {
        			var currentBrowser = tabbrowser.getBrowserAtIndex(index);
					var win = currentBrowser.contentWindow;
					var frames = win.frames;
					var winArr = [];
					winArr.push(win);
					for (var i=0; i<frames.length; i++) {
						winArr.push(frames[i].window);
					}
					
					var fStrDump = 'Window = "' + win.document.location + '"\nTotal Frames = ' + frames.length + '\n\n';
					for (var h=0; h<winArr.length; h++) {
						if (h > 0) {fStrDump += 'Frame = "' + winArr[h].document.location + '"\n';}
						var doc = winArr[h].document;
						var sameNote = doc.querySelector('div[noteid="' + noteid + '"]');
						if (sameNote) {
							if (h > 0) {Cu.reportError('MODDED INTO FRAME!!!');}
							sameNote.setAttribute('style', style);
						}
					}
                    /* NOTE: i programmed the frames stuff in above */
Cu.reportError(fStrDump);
        		}
              }
    	}
    });
    
    
}

function bodyKeyed(e) {
    var note = e.target;
    while (!note.hasAttribute('noteid')) {
      note = note.parentNode;
    }
    var body = note.childNodes[0];
    if (!body.contentEditable) { return }
    if (e.keyCode == 13 && e.ctrlKey) {
        Cu.reportError('ACCEPTCOMMIT');
        body.blur();
        acceptCommit(e);
    } else if (e.keyCode == 27) {
        Cu.reportError('CANCELCOMMIT');
            var win = e.target.ownerDocument.defaultView;
            var doc = e.target.ownerDocument;
            var sel = win.getSelection();
            if (sel.focusNode.parentNode == body) {
                Cu.reportError('yes in body');
                sel.removeAllRanges();
            }
        body.contentEditable = false;
        body.designMode = 'off';
        body.blur();
        cancelCommit(e);
    }
}
//end - note functions

function pageLoad(e) {
//no need to check for frame elements (LIKE WE DO ON STARTUP) because pageLoad fires for tabs and frames within tabs
Cu.reportError('page loaded');
    //if (e.originalTarget instanceof Ci.HTMLDocument) {
        var win = e.originalTarget.defaultView;
        if (win.frameElement) {
            //var parent = win.top;
        } else {
            
        }
        
        //substart - lets first get all the url match rules for existing notes IF no notes in database no need to go through tabs and match urls as there are no urls/notes
    	var noteData = [];
    	Cu.reportError('fetching all notes');
        let s320669 = dbConn.createStatement('SELECT * FROM main');
        s320669.executeAsync({
            handleResult: function(aResultSet) {
                var rowStructure = tableStructure.slice(0); //this depends on the select statement of s320669; since it matches tableStructure im just splicing
                for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
                    let value = row.getResultByName("url_regex");
                    var noteObj = {};
                    for (var i=0; i<rowStructure.length; i++) {
                        noteObj[rowStructure[i]] = row.getResultByName(rowStructure[i]);
                    }
                    noteData.push(noteObj);
                }
            },
            handleError: function (aError) {
                Cu.reportError('s320669 Error: ' + aError.message);
        	},
        	handleCompletion: function (aReason) {
        		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
            	    Cu.reportError('s320669 Query canceled or aborted!');
        		}
                Cu.reportError('s320669 succesfull');
                Cu.reportError('totalnotes=' + noteData.length);
                if (noteData.length > 0) {
                    var loc = win.location;
            		for (var i=0; i<noteData.length; i++) {
                        var cPatt = new RegExp(noteData[i].url_regex, 'im');
            		    if (cPatt.test(loc)) {
                	        //matches so insert note
                            Cu.reportError('match of location ' + loc + ' to patt of urlPatts[i] ' + noteData[i].url_regex);
                            domInsertNote(win, noteData[i]);
            		    }
        			}
            	}
                
        	}
        });
        
    
    	//subend - lets first get all the url match rules for existing notes IF no notes in database no need to go through tabs and match urls as there are no urls/notes
    
    	//end - go through all tabs and find and remove surfaceNotesCont
        
    //} else {
    //    Cu.reportError('NOTE instanceOf HTMLDocument');
    //}
}

var progListener = {
	onLocationChange: function (aProgress, aRequest, aURI, aFlags) {
		Cu.reportError('location changed!');
        //cDump(aURI, 'aURI');
        //cDump(aRequest, 'aRequest');
        //DO NOT CDUMP APROGRESS ELSE IT WILL DO THAT WEIRD STUFF WHERE IT RESETS THE TAB LOCATION AND YOU CANT CLICK LINKS OR ANYTHING, AND IT LOADS BLANK FOR A PAGE, RIDCIOULUS
        if (aFlags & Ci.nsIWebProgressListener.LOCATION_CHANGE_SAME_DOCUMENT) {
            Cu.reportError('anchor clicked!');
        } else {
            return
        }
        var domWin = aProgress.DOMWindow;
        var domDoc = domWin.document;
        if(!domDoc) {
            Cu.reportError('document not loaded yet');
            return;
        }
        var snLocChCnt = domDoc.getElementById('snLocChCnt');
        if (!snLocChCnt) {
            var newEl = domDoc.createElement('div');
            newEl.setAttribute('style', 'font-size:24px; background-color:steelblue; width:100px; height:100px; position:fixed; top:0; left:0; z-index:2010000000');
            newEl.setAttribute('id', 'snLocChCnt');
            newEl.innerHTML = '1';
            domDoc.body.insertBefore(newEl, domDoc.body.childNodes[0]);
        } else {
            snLocChCnt.innerHTML = parseInt(snLocChCnt.innerHTML) + 1;
        }
	}
}

exports.onUnload = function (reason) {
	//Cu.reportError('onUnload reason: "' + reason + '"');
    
    var cssURI = ios.newURI(selfPath + 'data/style/global.css', null, null);
    sss.unregisterSheet(cssURI, sss.USER_SHEET);
    if (sss.sheetRegistered(cssURI, sss.USER_SHEET)) {
        Cu.reportError('BAD: still registered');
    } else {
        Cu.reportError('GOOD: no longer regged');
	}

  // Stop listening for new windows
  wm.removeListener(windowListener);
 
  // Unload from any existing windows
  let windows = wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
	let browserWin = windows.getNext();
    let domWindow = browserWin.QueryInterface(Ci.nsIDOMWindow);
    unloadFromWindow(domWindow, browserWin);
  }
    
    //do this on uninstall
    dbConn.asyncClose({
        complete: function() {
            Cu.reportError('SUCCESFULLY CLOSED dbConn');
        }
    });
    //end do this on uninstall
}

var cDump = function(obj, name) {
    if (!name) { name = '' }
    var bstr = name + '\nbstr:\n';
    var fstr = '';
    for (var b in obj) {
        try{
            bstr += b+'='+obj[b]+'\n';
        } catch (e) {
                fstr += b+'='+e+'\n';
        }
    }
    if (fstr != '') { console.log(bstr + '\n\n\n\nfstr:\n' + fstr) } else { console.log(bstr) }
};

function stripTags(text) {
	return text.replace(/<\/?[^>]+>/gi, '');
}

function escapeRegExp(text) {
	if (!arguments.callee.sRE) {
		var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
		arguments.callee.sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
	}
	return text.replace(arguments.callee.sRE, '\\$1');
}

exports.main = function (options, callbacks) {
    
    dbFile = FileUtils.getFile('ProfD', ['surfacenotes.sqlite']);
    dbConn = Services.storage.openDatabase(dbFile); // Will also create the file if it does not exist
    
    let s610520 = dbConn.createStatement('CREATE TABLE IF NOT EXISTS main (id INTEGER PRIMARY KEY, type INTEGER NOT NULL, url_regex TEXT NOT NULL, body TEXT, style TEXT, caret_start INTEGER, caret_end INTEGER, scroll_x INTEGER, scroll_y INTEGER, attachment TEXT);'); //NOTE: if i change order or naming here I need to update tableStructure const at top
    s610520.executeAsync({
    	handleError: function (aError) {
    		Cu.reportError('s610520 Error: ' + aError.message);
    	},
    	handleCompletion: function (aReason) {
    		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
        	    Cu.reportError('s610520 Query canceled or aborted!');
    		} else {
                Cu.reportError('s610520 completed succesfully: ' + aReason);
    		}
    	}
    });
    
    var cssURI = ios.newURI(selfPath + 'data/style/global.css', null, null);
    sss.loadAndRegisterSheet(cssURI, sss.USER_SHEET);
	if (sss.sheetRegistered(cssURI, sss.USER_SHEET)) {
		Cu.reportError('GOOD: registered now');
	} else {
		Cu.reportError('BAD: NOT regged');
	}
        

	// Load into any existing windows
	let windows = wm.getEnumerator("navigator:browser"); //THIS GETS ALL BROWSER TYPE WINDOWS (MEANING IT HAS GBROWSER)
	while (windows.hasMoreElements()) {
		let browserWin = windows.getNext();
		let domWindow = browserWin.QueryInterface(Ci.nsIDOMWindow);
		loadIntoWindow(domWindow, browserWin);
	}
 
	// Load into any new windows
	wm.addListener(windowListener);

};


function loadIntoWindow(domWindow, browserWin) {
	if (!browserWin) { return; }
    if (!browserWin.gBrowser) { return; }
    
    //DO YOUR STUFF TO THE WINDOW HERE
	browserWin.gBrowser.addEventListener('DOMContentLoaded', pageLoad, true);
    browserWin.gBrowser.addProgressListener(progListener);
    
	//start - go through all tabs and check all frames in each tab to see if a note should be in there
	
	//substart - lets first get all the url match rules for existing notes IF no notes in database no need to go through tabs and match urls as there are no urls/notes
	var noteData = [];
	Cu.reportError('fetching all notes');
    let s541864 = dbConn.createStatement('SELECT * FROM main');
    s541864.executeAsync({
        handleResult: function(aResultSet) {
            var rowStructure = tableStructure.slice(0); //this depends on the select statement of s541864; since it matches tableStructure im just splicing
            for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
                let value = row.getResultByName("url_regex");
                var noteObj = {};
                for (var i=0; i<rowStructure.length; i++) {
                    noteObj[rowStructure[i]] = row.getResultByName(rowStructure[i]);
                }
                noteData.push(noteObj);
            }
        },
        handleError: function (aError) {
            Cu.reportError('s541864 Error: ' + aError.message);
    	},
    	handleCompletion: function (aReason) {
    		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
        	    Cu.reportError('s541864 Query canceled or aborted!');
    		}
            Cu.reportError('s541864 succesfull');
            Cu.reportError('totalnotes=' + noteData.length);
            if (noteData.length > 0) {
            	var tabbrowser = browserWin.gBrowser;
        		var numTabs = tabbrowser.browsers.length;
        		for (var index = 0; index < numTabs; index++) {
        			var currentBrowser = tabbrowser.getBrowserAtIndex(index);
					var win = currentBrowser.contentWindow;
					var frames = win.frames;
					var winArr = [];
					winArr.push(win);
					for (var i=0; i<frames.length; i++) {
						winArr.push(frames[i].window);
					}
					
					var fStrDump = 'Window = "' + win.document.location + '"\nTotal Frames = ' + frames.length + '\n\n';
					for (var h=0; h<winArr.length; h++) {
						if (h > 0) {fStrDump += 'Frame = "' + winArr[h].document.location + '"\n';}
						var loc = winArr[h].document.location;
						for (var i=0; i<noteData.length; i++) {
							var cPatt = new RegExp(noteData[i].url_regex, 'im');
							if (cPatt.test(loc)) {
								//matches so insert note
								Cu.reportError('match of location ' + loc + ' to patt of urlPatts[i] ' + noteData[i].url_regex);
								if (h > 0) {Cu.reportError('INSERTED INTO FRAME!!!');}
								domInsertNote(winArr[h], noteData[i]);
							}
						}
					}
                    /* NOTE: i programmed the frames stuff in above */
Cu.reportError(fStrDump);
        		}
        	}
            
    	}
    });
    

	//subend - lets first get all the url match rules for existing notes IF no notes in database no need to go through tabs and match urls as there are no urls/notes

	//end - go through all tabs and find and remove surfaceNotesCont
}
 
function unloadFromWindow(domWindow, browserWin) {
	if (!browserWin) { return; }
    if (!browserWin.gBrowser) { return; }
    Cu.reportError('in unloadFromWindow');
    //DO YOUR STUFF TO THE WINDOW HERE
	browserWin.gBrowser.removeEventListener('DOMContentLoaded', pageLoad, true);
	browserWin.gBrowser.removeProgressListener(progListener);
	//start - go through all tabs and find and remove surfaceNotesCont
	var tabbrowser = browserWin.gBrowser;
	var numTabs = tabbrowser.browsers.length;
            	for (var index = 0; index < numTabs; index++) {
        			var currentBrowser = tabbrowser.getBrowserAtIndex(index);
					var win = currentBrowser.contentWindow;
					var frames = win.frames;
					var winArr = [];
					winArr.push(win);
					for (var i=0; i<frames.length; i++) {
						winArr.push(frames[i].window);
					}
					
					var fStrDump = 'Window = "' + win.document.location + '"\nTotal Frames = ' + frames.length + '\n\n';
					for (var h=0; h<winArr.length; h++) {
						if (h > 0) {fStrDump += 'Frame = "' + winArr[h].document.location + '"\n';}
                    	var cont = winArr[h].document.getElementById('surfaceNotesCont');
                		if (cont) {
                			//browserWin.focus();
                			//browserWin.alert('found');
                			//tabbrowser.selectedTab = tabbrowser.tabContainer.childNodes[index];
                			cont.parentNode.removeChild(cont);
                		}
					}
                    /* NOTE: i programmed the frames stuff in above */
Cu.reportError(fStrDump);
        		}
	//end - go through all tabs and find and remove surfaceNotesCont
}

var windowListener = {
  onOpenWindow: function(aWindow) {
    // Wait for the window to finish loading
    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
    domWindow.addEventListener("load", function() {
      domWindow.removeEventListener("load", arguments.callee, false);
      loadIntoWindow(domWindow, aWindow);
    }, false);
  },
   
  onCloseWindow: function(aWindow) {
  },
   
  onWindowTitleChange: function(aWindow, aTitle) {
  }
};
// End - For builer testing

/*
//for bootsrap.js
function startup(aData, aReason) {
	SurfaceNotes.startup(aData, aReason);
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) return;
	SurfaceNotes.shutdown(aData, aReason);
}

function install() {}

function uninstall() {}
*/
//end for bootstrap.js