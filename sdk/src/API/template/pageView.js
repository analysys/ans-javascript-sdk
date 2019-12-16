import {
    temp
} from '../../lib/mergeRules/index.js'
import {
    fillField,
    checkPrivate,
    resetCode
} from '../../lib/fillField/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import {
    upLog
} from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'

function pageView(pageName, obj) {
    /** 
     * 判断黑白名单
     * 符合黑名单，不上报
     * 有白名单，且不符合白名单，不上报
     */
    if (Util.checkTypeList(baseConfig.base.pageViewBlackList) || (baseConfig.base.pageViewWhiteList && !Util.checkTypeList(baseConfig.base.pageViewWhiteList))) return

    baseConfig.status.FnName = '$pageview'
    resetCode()
    var nameObj = {}
    if (arguments.length > 0) {
        nameObj = {
            '$title': pageName
        }

        checkPrivate(nameObj)
    }

    var userProp = {}

    if (Util.paramType(obj) == "Object") {
        //检测distinctId
        checkPrivate(obj)
        userProp = {
            'xcontext': obj || {}
        }
    }

    var arkSuper = Storage.getLocal('ARKSUPER') || {}

    /**
     * 超级属性与用户自定义属性合并
     */
    var xcontext = Util.objMerge({
        'xcontext': arkSuper
    }, userProp)

    /**
     * 与$pagename属性合并
     */
    xcontext = Util.objMerge(xcontext, {
        'xcontext': nameObj
    })

    var pageViewTemp = temp('$pageview')
    var pageViewObj = Util.delEmpty(fillField(pageViewTemp))

    /**
     * 自动采集与个性化属性合并
     */
    var pageViewLog = Util.objMerge(pageViewObj, xcontext)

    //去除空数据后上传数据
    upLog(pageViewLog)


}

var pageUrl = window.location.href

function hashPageView() {
    Util.changeHash(function () {
        if (pageUrl !== window.location.href) {
            pageUrl = window.location.href
            pageView()
        }
    })
}
export {
    pageView,
    hashPageView
}