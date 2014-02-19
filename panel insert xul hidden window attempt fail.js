//var {classes: Cc, interfaces: Ci, utils: Cu} = Components;
//Cu.import('resource://gre/modules/Services.jsm');

//if (!hiddenWin || hiddenWin.closed) {
    //alert('here')
    var hiddenWin; //insert panel into hiddenWin, will destory this hiddenWin on exit of firefox (if addon is not uninstalled)
    //hiddenWin = Services.ww.openWindow(null, 'about:blank', "aboutMyExtension", "width=100,height=1,titlebar=0", null);
hiddenWin = Services.ww.openWindow(null, 'http://www.bing.com/', "aboutMyExtension", "chrome=0,titlebar=0,scrollbar=0", null);
//    hiddenWin.close();
//}

var panel = hiddenWin.document.createElement('panel');
var elProps = {
    noautohide: true,
    noautofocus: false,
    draggable: true,
    type: 'arrow',
    style: 'padding:0; margin:0; background-color:black'
}
var el = panel;
for (var prop in elProps) {
    el.setAttribute(prop, elProps[prop]);
}
hiddenWin.document.firstChild.appendChild(panel);
alert(panel.parentNode)
//panel.openPopup(null, 'overlap', 0, 0);
