import { temp } from '../../lib/mergeRules/index.js'
import { fillField, checkPrivate, resetCode } from '../../lib/fillField/index.js'
import baseConfig from '../../lib/baseConfig/index.js'
import { upLog } from '../../lib/upload/index.js'
import Util from '../../lib/common/index.js'
import Storage from '../../lib/storage/index.js'
import { transporter, backParamsArray } from '../../lib/upload/hybrid.js'
import { successLog } from '../../lib/printLog/index.js'
function alias (aliasId, callback) {
  baseConfig.status.FnName = '$alias'
  resetCode()
  if (aliasId === Storage.getLocal('ARK_LOGINID')) {
    baseConfig.status.successCode = '20013'
    successLog()
    Util.paramType(callback) === 'Function' && callback.call(callback)
    return false
  }
  if (baseConfig.base.isHybrid === true) {
    var backParams = backParamsArray(aliasId, '', callback)
    var paramArray = backParams.argArray
    transporter('alias', paramArray, backParams.callback)
    return
  }
  // 检测aliasId
  var status = checkPrivate(aliasId, '$alias', true)

  if (!status) {
    Util.paramType(callback) === 'Function' && callback.call(callback)
    return
  }
  // if (distinctId) {
  //     //检测distinctId
  //     status = checkPrivate(distinctId, '$alias', true)
  //     if (status) {
  //         Storage.setLocal('ARK_TRACKID', distinctId)
  //     }
  // }

  Storage.setLocal('ARK_LOGINID', aliasId)

  var aliasTemp = temp('$alias')
  var aliasLog = fillField(aliasTemp)

  // 去除空数据后上传数据
  upLog(Util.delEmpty(aliasLog), callback)

  if (baseConfig.base.autoProfile === true) {
    baseConfig.status.FnName = '$profile_set_once'
    var profileSetOnceTemp = temp('$profile_set_once')

    var profileSetOnceObj = fillField(profileSetOnceTemp)
    var time = Storage.getLocal('ARKFRISTPROFILE') || Util.format(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
    var obj = {
      $first_visit_time: time,
      $first_visit_language: (navigator.language || navigator.browserLanguage).toLowerCase()
    }
    var profileSetOnceLog = Util.objMerge(profileSetOnceObj, {
      xcontext: obj
    })
    // 去除空数据后上传数据
    upLog(Util.delEmpty(profileSetOnceLog))
    Storage.setLocal('ARKFRISTPROFILE', time)
  }
}
export {
  alias
}
