import Storage from '../../../../lib/storage/index.js'
import Util from '../../../../lib/common/index.js'
import {
    isEmbedded,
    pipParam,
    isElmentReady
} from './common/index.js'
import {
    visualConfig
} from './common/config.js'
import {
    sendMsg,
    getMsg
} from './common/iframeMsg.js'
import {
    addVisualListener,
    removeVisualListener,
    showVisualEvent,
    delVisualEvent,
    hiddenVisualEvent,
    openVisualEvent
} from './visual/index.js'
import {
    addDebugListener,
    removeDebugListener,
    openDebugBox,
    hiddenDebugEvent,
    delDebugBox
} from './debug/index.js'

var isVisaulInit = true
var visualStatus = true

function processMsg(msg) {
    if (!isVisaulInit) {
        return
    }
    var type = msg.type
    var url = location.protocol + '//' + location.host + location.pathname + location.hash
    switch (type) {
        case 'INIT': //初始化验证
            if (msg.appid !== visualConfig.appid) {
                sendMsg({
                    code: 400,
                    type: 'INIT',
                    msg: 'appkey不相同'
                })
                isVisaulInit = false
                return
            }
            sendMsg({
                code: 200,
                type: 'INIT'
            })
            // var obj = {
            //     type: 'checkUrl',
            //     code: 200,
            //     url: url,
            //     skip: true
            // }
            // sendMsg(obj)
            break
        case 'point_list': //所有已埋点元素绑定debug模式
            var list = msg.data || []
            if (!list) {
                console.log('无埋点列表')
            }
            showVisualEvent(list)
            break
        case 'EVENT_URL':
            //验证埋点元素是否为当前页元素

            var obj = {
                type: 'checkUrl',
                code: 200,
                url: url,
                skip: msg.url == url ? true : false
            }
            sendMsg(obj)
            break
        case 'VISUAL':
            if (msg.visual == true) {
                removeDebugListener()
                visualStatus = true
                //开始初始化可视化埋点
                addVisualListener()

            } else if (msg.debugmode == true) {
                removeVisualListener()
                visualStatus = false
                //开始初始化debug模式
                addDebugListener()
            }
            break
        case 'change_update':
            if (msg.path && msg.path.length > 0) {
                if (url != msg.path[0].url) {
                    sendMsg({
                        type: "change_page",
                        code: 200,
                        msg: "跳转埋点页面",
                        path: msg.path,
                        url: msg.path[0].url
                    })
                    return
                } else {

                    openVisualEvent(msg.path[0])

                }
            }
            break
        case 'change_delete':
            if (visualStatus == false) {
                delDebugBox()
            }
            if (msg.path && msg.path.length > 0) {
                delVisualEvent(msg.path[0])
                sendMsg({
                    code: 200,
                    type: "change_delete"
                })
            } else {
                sendMsg({
                    code: 400,
                    type: "change_delete",
                    msg: "删除失败"
                })
            }
            break
        case 'add_success':
            sendMsg({
                code: 200,
                type: 'add_success',
                msg: '添加成功'
            })
            break
        case 'success_update':
            if (msg.path && msg.path.length > 0) {
                showVisualEvent(msg.path)
            }
            break
        case 'debug':
            openDebugBox(msg)
            break
        case 'highlight':
            var highlight = msg.highlight
            if (visualStatus) {
                hiddenVisualEvent(highlight)

            } else {
                hiddenDebugEvent(highlight)
            }
            break

    }

}
/**
 * [initHeatmap description]初始化可视化并建立通讯
 * @return {[type]} [description]
 */
function initVisual() {
    if (isElmentReady()) {
        if (isEmbedded("visual")) {
            getMsg(processMsg)
        }
    } else {
        setTimeout(initVisual, 200)
    }
}
initVisual()