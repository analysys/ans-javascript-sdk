var debugTemp = `<div id="ARK_DEBUG_BOX" class="debugLog" style="top:{TOP}px;left:{LEFT}px;position:absolute;">` +
    `<div class="bg"></div>` +
    `<div class="l-list">{LOGLIST}</div>` +
     `<img class="cha" id="ARK_DEBUG_CHA" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDcwM0Y3NzQ3MzJEMTFFODhFNDFEQjRCQTQ3NDU1ODYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDcwM0Y3NzU3MzJEMTFFODhFNDFEQjRCQTQ3NDU1ODYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NTlBNDc3RjcyQzgxMUU4OEU0MURCNEJBNDc0NTU4NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1NTlBNDc4MDcyQzgxMUU4OEU0MURCNEJBNDc0NTU4NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtVAdZIAAACKSURBVHjadI/dDcMwCIRxxD5Jn6N0gqRdpMvlZ4NUeU08ETkqkJDlIh3G5jPikoh8iOgLXVSPFhoapB2aoO4P9IYORsr2+LLTJ3c2YIVOtkeFkzU8tN4U0guHxhUAipBGU+yUQi2xESc+oBFaws7iHrgC5fDZDWY2SPeaC8gN/iYr2Feg0uDzFmAA00Ef4tAWMJcAAAAASUVORK5CYII="/>` +
    `</div>`

function setDebugTemp(config) {
    if (!config) return

    var list = ''
    for (var i = 0; i < config.list.length; i++) {
        list += `<div>` + config.list[i].title + `:` + config.list[i].val + `<br></div>`
    }
    var temp = debugTemp.replace('{TOP}', config.top)
        .replace('{LEFT}', config.left)
        .replace('{LOGLIST}', list)
    return temp
}
export { setDebugTemp }