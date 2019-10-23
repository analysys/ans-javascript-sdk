import Storage from '../../../../lib/storage/index.js'
import Util from '../../../../lib/common/index.js'

// 获取浏览器窗口的可视区域的宽度
function getViewPortWidth() {
    return document.documentElement.clientWidth || document.body.clientWidth;
}

// 获取浏览器窗口的可视区域的高度
function getViewPortHeight() {
    return document.documentElement.clientHeight || document.body.clientHeight;
}


// 获取浏览器窗口垂直滚动条的位置
function getScrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop;
}

var startDate = +new Date() + (Storage.getLocal("ANSSERVERTIME") ? Number(Storage.getLocal("ANSSERVERTIME")) : 0)

function getDuration() {
    var nowTime = +new Date() + (Storage.getLocal("ANSSERVERTIME") ? Number(Storage.getLocal("ANSSERVERTIME")) : 0)
    var duration = nowTime - startDate
    startDate = nowTime
    return duration
}
function getDeviceType(){
	return Util.deviceType()
}
export { getViewPortWidth, getViewPortHeight, getScrollTop, getDuration ,getDeviceType}