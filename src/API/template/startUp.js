import { temp } from '../../lib/mergeRules/index.js'
import { fillField, isStartUp, checkBase } from '../../lib/fillField/index.js'
import { errorLog } from '../../lib/printLog/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import { hashPageView } from './pageView.js'
import Storage from '../../lib/storage/index.js'
import { pageViewLog } from './pageView.js'

function startUp () {
  var log = []
  // 启动前检测appkey、debugModel、uploadURL参数是否合法
  if (baseConfig.base.isHybrid === false && !checkBase()) {
    errorLog()
    return
  }
  var arkSuper = Storage.getLocal('ARKSUPER') || {}
  // 检测启动前状态,appid，debugModel,uploadURL是否存在修改
  // 判断是否是已启动
  // 如已启动则不发送启动日志
  if (baseConfig.base.isHybrid === false && isStartUp() === false) {
    var startUpStatus = true
    if (Util.checkTypeList(baseConfig.base.startUpBlackList) || (baseConfig.base.startUpWhiteList && !Util.checkTypeList(baseConfig.base.startUpWhiteList))) {
      startUpStatus = false
    }
    if (startUpStatus === true) {
      baseConfig.status.FnName = '$startup'
      // 更新当前所在事件
      // baseConfig.status.FnName = '$startup'

      // 获取事件日志模板
      var startUpTemp = temp('$startup')
      // 验证及填充日志模板中字段内容
      // 如未通过验证则返回值为fasle
      var startUpLog = fillField(startUpTemp)

      /**
           * 超级属性优先于自动采集属性
           */
      startUpLog = Util.objMerge(startUpLog, {
        xcontext: arkSuper
      })
      log.push(Util.delEmpty(startUpLog))
    }
  }

  // 自动采集首次用户属性
  var fristProfile = Storage.getLocal('ARKFRISTPROFILE') || false
  if (baseConfig.base.isHybrid === false && baseConfig.base.autoProfile === true && !fristProfile) {
    baseConfig.status.FnName = '$profile_set_once'
    var profileSetOnceTemp = temp('$profile_set_once')

    var profileSetOnceObj = fillField(profileSetOnceTemp)
    var time = Storage.getLocal('ARKFRISTPROFILE') || Util.format(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
    var obj = {
      $first_visit_time: time,
      $first_visit_language: (navigator.language || navigator.browserLanguage).toLowerCase()
    }
    /**
         * 自定义属性优先于自动采集属性
         */
    var profileSetOnceLog = Util.objMerge(profileSetOnceObj, {
      xcontext: obj
    })
    log.push(Util.delEmpty(profileSetOnceLog))
    Storage.setLocal('ARKFRISTPROFILE', time)
  }

  // 自动采集页面
  if (baseConfig.base.auto === true) {
    /**
     * 判断黑白名单
     * 符合黑名单，不上报
     * 有白名单，且不符合白名单，不上报
     */
    var listStatus = false
    if (baseConfig.base.pageViewWhiteList && Util.checkTypeList(baseConfig.base.pageViewWhiteList)) {
      listStatus = true
    } else if (!Util.checkTypeList(baseConfig.base.pageViewBlackList)) {
      listStatus = true
    }
    if (listStatus === true) {
      var pageLog = pageViewLog(baseConfig.base.pageProperty)

      log.push(pageLog)
    }
    // 开启hash跳转
    if (baseConfig.base.hash === true || baseConfig.base.singlePage === true) {
      hashPageView()
    }
  }
  if (log.length > 0) {
    upLog(log)
  }
  // 校准时间
}
export { startUp }
