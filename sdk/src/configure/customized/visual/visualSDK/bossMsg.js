 import initVisual from './initVisual.js'
 import msg from './iframeMsg.js'
 import { checkPageUrl } from './checkPageUrl.js'
 import { getShowEvent, changeEvent, delEvent, changeEventSuccess } from './parse.js'
 import Storage from '../../../../lib/storage/index.js'
 import { showDebug, setShowLog, removeDebug } from './initDebug.js'
 var visualType = true;
 var config = {}

 function mergeConfig() {
     config = window.ARK_VISUAL.config
 }
 mergeConfig()

 var win = window
 var loc = win.location

 var callback = function(e) {
     var url = loc.protocol + '//' + loc.host + loc.pathname + loc.hash;
     var msgObj = e
     console.log('获取消息===>', msgObj)
     if (!visualType) {
         msg.postMsg({
             code: 400,
             type: 'INIT'
         })
         return
     }
     try {
         msgObj = JSON.parse(msgObj.data)
     } catch (e) {
         return
     }

     // showLog('获取消息==>', msgObj)
     if (msgObj.type === 'INIT') {
         if (msgObj.boss && msgObj.orgin) {
             msg.boss = msgObj.boss
             msg.orgin = msgObj.orgin
             msg.appid = msgObj.appid
         }
         if (!msgObj || msgObj.appid !== config.appid) {
             msg.postMsg({
                 code: 400,
                 type: 'INIT',
                 msg: 'appkey不相同'
             })
             visualType = false
             return
         }

         msg.postMsg({
             code: 200,
             type: 'INIT'
         })
         checkPageUrl(url)
         Storage.setSession("visual", "true")
     }
     if (msg.appid !== config.appid) {
         return
     }
     if (msgObj.type === "point_list") {
         var list = msgObj.data
         getShowEvent(list)
     }
     if (msgObj.type === "EVENT_URL") {
         checkPageUrl(msgObj.url)
         return
     }
     if (msgObj.type === 'VISUAL') {
         if (msgObj.visual === true) {
             setShowLog(false)
             removeDebug()
             initVisual.init()
         }
         if (msgObj.debugmode === true) {
             initVisual.delclickLister()
             setShowLog(true)
         }
     }
     if (msgObj.type === 'change_update') {
         if (msgObj.path && msgObj.path.length > 0) {
             if (url.indexOf(msgObj.path[0].url) < 0) {
                 msg.postMsg({
                     type: "change_page",
                     code: 200,
                     msg: "跳转埋点页面",
                     path: msgObj.path,
                     url: msgObj.path[0].url
                 })
                 return
             }
             changeEvent(msgObj.path[0])

         }
     }
     if (msgObj.type === 'change_delete') {
         if (msgObj.path && msgObj.path.length > 0) {
             delEvent(msgObj.path[0])
             msg.postMsg({
                 code: 200,
                 type: "change_delete"
             })
         } else {
             msg.postMsg({
                 code: 400,
                 type: "change_delete",
                 msg: "删除失败"
             })
         }
     }
     if (msgObj.type === "add_success") {
         msg.postMsg({
             code: 200,
             type: 'add_success',
             msg: '添加成功'
         })
     }
     if (msgObj.type === "success_update") {
         if (msgObj.path && msgObj.path.length > 0) {
             changeEventSuccess(msgObj.path[0])
         }
     }
     //上传日志，生成字典后返回展示内容
     if (msgObj.type === "debug") {
         showDebug(msgObj)
     }
     //高亮OR非高亮
     if (msgObj.type === "highlight") {
         var highlight = msgObj.highlight
         initVisual.highlight(highlight)
     }
 }
 if (window.ARK_VISUAL.visual) {
     callback(window.ARK_VISUAL.visual)
 }
 msg.getMsg(callback)