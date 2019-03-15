import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate, resetCode } from '../../lib/fillField/index.js'
import { errorLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function pageView(pageName, obj) {
    resetCode()

    var status = true
    if (arguments.length > 0) {
        status = checkPrivate(pageName, '$pageview')
    }

    if (obj && status) {
        //检测distinctId
        status = checkPrivate(obj)
        if (!status) {
            errorLog()
            return
        }
    }

    obj = { 'xcontext': obj || {} }



    baseConfig.status.FnName = '$pageview'

    if (!status) {
        errorLog()
        return
    }

    var arkSuper = Storage.getLocal('ARKSUPER') || {}

    obj = Util.objMerge({ 'xcontext': arkSuper }, obj)

    obj = Util.objMerge({ 'xcontext': { '$page_name': pageName || '' } }, obj)

    var pageViewTemp = temp('$pageview')
    var pageViewObj = fillField(pageViewTemp)

    var pageViewLog = Util.objMerge(pageViewObj, obj)


    //如字段中有不合法内容则打印错误日志
    if (!pageViewLog) {
        errorLog()
        return
    }
    //去除空数据后上传数据
    upLog(Util.delEmpty(pageViewLog))


}

function hashPageView() {
    if ('onpopstate' in window) {
        if (!('onpushState' in window)) {
            window.history.pushState = Util.addWindowEvent('pushState');
        }
        if (!('onreplaceState' in window)) {
            window.history.replaceState = Util.addWindowEvent('replaceState');
        }
        Util.addEvent(window, 'popstate', function() {
            pageView()
        })
        Util.addEvent(window, 'pushState', function() {
            pageView()
        })
        Util.addEvent(window, 'replaceState', function() {
            pageView()
        })
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            if ('onhashchange' in window) {
                Util.addEvent(window, 'hashchange', pageView())
            }
        }
    } else if ('onhashchange' in window) {
        if (document.addEventListener) {
            Util.addEvent(window, 'hashchange', function() {
                pageView()
            })
        }
    }
}
export { pageView, hashPageView }