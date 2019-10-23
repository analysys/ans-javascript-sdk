 import Util from '../../../../lib/common/index.js'
import initVisual from './initVisual.js'
import msg from './iframeMsg.js'
import { upLog ,setEventList} from './initDebug.js'
var win = window
var loc = win.location
var url = loc.protocol + '//' + loc.host + loc.pathname + loc.hash
var host = loc.protocol + '//' + loc.host


function changeEvent(path) {
    var ele = initVisual.parseEvent(path)
    if(!ele.allEleList[ele.index])return
    initVisual.changeEvent(ele.allEleList[ele.index], ele.obj)
}

function changeEventSuccess(path) {
    var ele = initVisual.parseEvent(path)
    if(!ele.allEleList[ele.index])return
    initVisual.changeEventSuccess(ele.allEleList[ele.index], ele.obj)
}

function delEvent(path) {
    var ele = initVisual.parseEvent(path)
    if(!ele.allEleList[ele.index])return
    initVisual.delClickBox(ele.allEleList[ele.index], ele.obj)
}

function getShowEvent(list) {
    var eventList = list
    initVisual.clearEvent()
    for (var i = 0; i < eventList.length; i++) {
        var obj = initVisual.parseEvent(eventList[i])
        if (obj.allEleList.length === 0 ||obj.allEleList.length < obj.index) {
            continue
        }
        var ele = obj.allEleList[obj.index]
        initVisual.addClickBox(ele, obj.obj)
        Util.removeEvent(ele, "click", upLog)
        Util.addEvent(ele, "click", upLog)
        
    }
    setEventList(eventList)
}
export { getShowEvent, changeEvent, changeEventSuccess, delEvent }