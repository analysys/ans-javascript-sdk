import Util from '../common/index.js'
import baseConfig from '../baseConfig/index.js'
import Storage from '../storage/index.js'
import { errorLog, successLog } from '../printLog/index.js'
import checkRule from '../checkField/index.js'
import { fieldRules } from '../../configure/index.js'
import sessionId from './sessionId.js'

import { removeAliasId, removeIdentifyId } from './id.js'

function check (value, checkList) {
  for (var i = 0; i < checkList.length; i++) {
    var checkStatus = checkRule[checkList[i]](value)
    if (!checkStatus) {
      return false
    }
  }
  return true
}

function checkFields (key, value, rule) {
  var checkRule = rule.check
  var status = true
  if (!checkRule) {
    return status
  }

  var checkKey = checkRule.key
  var checkValue = checkRule.value || fieldRules.xcontextCommonRule.value

  if (checkKey) {
    baseConfig.status.code = 200
    status = check(key, checkKey)
    baseConfig.status.key = key
    if (!status) {
      baseConfig.status.code = 400
      errorLog()
    }
  }

  if (checkValue) {
    baseConfig.status.code = 200
    status = check(value, checkValue)
    if (Util.paramType(value) !== 'Array') {
      baseConfig.status.value = value
    }
    if (!status) {
      baseConfig.status.code = 400
      errorLog()
    }
  }

  // if (status && checkRule.successCode) {
  //     baseConfig.status.successCode = checkRule.successCode
  // }
  return status
}

function resetCode () {
  baseConfig.status = {
    code: 200,
    FnName: baseConfig.status.FnName,
    key: '',
    value: '',
    errorCode: '',
    successCode: ''
  }
}

function fillField (feilds, rules) {
  var rulesList = rules || fieldRules
  var obj = {}
  for (var key in feilds) {
    var feild = feilds[key]
    var rule = rulesList[key]
    if (!rule) {
      continue
    }
    var feildValue = ''

    if (Util.paramType(feild) === 'Object') {
      var content = fillField(feild, rule)
      obj[key] = content
    } else {
      if (Util.objHasKay(rule, 'valueType')) {
        if (rule.valueType === 0) {
          feildValue = rule.value()
          if (Util.paramType(feildValue) === 'String' && feildValue.length > 500) {
            obj[key] = Util.stringSlice(feildValue, 499) + '$'
          } else {
            obj[key] = feildValue
          }
          //     }
          // }
        }

        if (rule.valueType === 1) {
          feildValue = rule.value

          // if (checkFields(key, feildValue, rule)) {
          //     obj[key] = feildValue
          // } else {
          //     if (baseConfig.status.errorCode === '600019') {
          if (Util.paramType(feildValue) === 'String' && feildValue.length > 500) {
            obj[key] = Util.stringSlice(feildValue, 499) + '$'
          } else {
            obj[key] = feildValue
          }
          // }
          // }
        }
      }
    }
  }
  return obj
}
/**
 * [reset description]检测是否重置初始化状态
 * @return {[type]} [description] true：需初始化 false：无需初始化
 */
function clearCache (resetStatus) {
  resetStatus = resetStatus || false
  if (!resetStatus) {
    var config = baseConfig.base
    for (var key in config) {
      if (Util.paramType(config[key]) !== 'Object') {
        if (key === '$debug' || key === 'appid' || key === 'uploadURL') {
          var keyStorage = Storage.getLocal('ANS' + key.toUpperCase())
          if (keyStorage !== config[key]) {
            resetStatus = true
          }
          if (resetStatus) {
            Storage.setLocal('ANS' + key.toUpperCase(), config[key])
          }
        }
      }
    }
  }
  if (resetStatus) {
    removeAliasId()
    removeIdentifyId()
    Storage.removeLocal('ARKSUPER')
    Storage.removeSession('STARTUP')
    Storage.setLocal('FRISTDAY', Util.format(new Date(), 'yyyyMMdd'))
    Storage.setLocal('FRISTIME', true)
    Storage.removeLocal('POSTDATA')
    Storage.removeLocal('ANSSERVERTIME')
    Storage.removeLocal('ARKFRISTPROFILE')
  }
  return resetStatus
}
/**
 * [isStartUp description]检测启动状态
 * @return {Boolean} [description] true：已启动，false：未启动
 */
function isStartUp () {
  var startUpStatus = Storage.getSession('STARTUP') || false
  var cookieStartup = Storage.getCookie('ARK_STARTUP')
  if (document.referrer !== '' && cookieStartup && baseConfig.base.cross_subdomain === true) {
    var cookieObj = JSON.parse(Util.decode(decodeURIComponent(cookieStartup)))
    var cookieStartUpStatus = cookieObj['STARTUP']
    var cookieStartUpTime = cookieObj['STARTUPTIME']
    Storage.setSession('STARTUP', cookieStartUpStatus)
    Storage.setSession('STARTUPTIME', cookieStartUpTime)
    // Storage.removeCookie('ARK_STARTUP', baseConfig.base.cross_subdomain, 'session')
    startUpStatus = Storage.getSession('STARTUP') || false
  }
  if (startUpStatus === false) {
    var startUpTime = Util.format(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
    Storage.setSession('STARTUP', true)
    Storage.setSession('STARTUPTIME', startUpTime)
    sessionId.setId()
    if (baseConfig.base.cross_subdomain === true) {
      Storage.setCookie('ARK_STARTUP', encodeURIComponent(Util.encode(JSON.stringify({ 'STARTUP': true, 'STARTUPTIME': startUpTime }))), 'session')
    }
  }
  return startUpStatus
}

function checkBase () {
  for (var key in baseConfig.base) {
    resetCode()
    // baseConfig.status.FnName = 'AnalysysAgentInit'
    baseConfig.status.key = key
    var rule = fieldRules[key]
    if (key === '$debug') {
      rule = fieldRules.xcontext[key]
    }
    if (key === '$lib_version') {
      rule = fieldRules.xcontext[key]
    }
    var checkValue = rule

    if (checkValue && !checkFields(key, baseConfig.base[key], checkValue)) {
      baseConfig.base[key] = ''
      return false
    }

    successLog()
  }
  return true
}

function checkPrivate (obj, ruleName, isKey) {
  resetCode()
  var rule = fieldRules[ruleName] || fieldRules.xcontextCommonRule
  if (Util.paramType(obj) !== 'Object' || isKey === true) {
    var checkKey = rule.check.key
    var status = check(Util.trim(obj), checkKey)
    baseConfig.status.key = obj
    if (!status) {
      errorLog()
      return false
    }
  } else {
    for (var key in obj) {
      var valueStatus = checkFields(key, obj[key], rule)
      if (!valueStatus) {
        if (baseConfig.status.errorCode === '600019') {
          if (Util.paramType(obj[key]) === 'String' && obj[key].length > 500) {
            obj[key] = Util.stringSlice(obj[key], 499) + '$'
          }
        }
      }
    }
  }
  return true
}

export { fillField, clearCache, isStartUp, checkBase, checkPrivate, resetCode }
