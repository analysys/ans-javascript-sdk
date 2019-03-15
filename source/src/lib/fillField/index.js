import Util from '../common/index.js'
import baseConfig from '../baseConfig/index.js'
import Storage from '../storage/index.js'

import checkRule from '../checkField/index.js'
import { fieldRules } from '../../configure/index.js'
import sessionId from './sessionId.js'
import { successLog } from '../printLog/index.js'
import {
    getId,
    setUUId,
    getUUId,
    removeUUId,
    setAliasId,
    getAliasId,
    removeAliasId,
    setIdentifyId,
    getIdentifyId,
    removeIdentifyId
} from './id.js'

function check(value, checkList) {
    for (var i = 0; i < checkList.length; i++) {

        var checkStatus = checkRule[checkList[i]](value)
        if (!checkStatus) {
            return false
        }
    }
    return true
}

function checkFields(key, value, rule) {
    var checkRule = rule.check
    var status = true
    var valueStatus = true
    if (!checkRule) {
        return status
    }

    var checkKey = checkRule.key
    var checkValue = checkRule.value

    if (checkKey) {
        status = check(key, checkKey)
        baseConfig.status.key = key
    }

    if (checkValue && status) {
        status = check(value, checkValue)
        valueStatus = status
        baseConfig.status.value = value
    }
    if (!status) {
        baseConfig.status.code = 400
        if (!valueStatus && checkRule.errorCode) {
            baseConfig.status.errorCode = checkRule.errorCode
        }
    }

    if (status && checkRule.successCode) {
        baseConfig.status.successCode = checkRule.successCode
    }
    return status
}

function resetCode() {
    baseConfig.status = {
        "code": 200,
        "FnName": "",
        "key": "",
        "value": "",
        "errorCode": "",
        "successCode": ""
    }
}

function fillField(feilds, rules) {
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
            if (content) {
                obj[key] = content
            } else {
                return false
            }
        } else {

            if (Util.objHasKay(rule, 'valueType')) {
                if (rule.valueType === 0) {

                    feildValue = rule.value()

                    if (checkFields(key, feildValue, rule)) {
                        obj[key] = feildValue
                    } else {
                        return false
                    }

                }

                if (rule.valueType === 1) {
                    feildValue = rule.value

                    if (checkFields(key, feildValue, rule)) {
                        obj[key] = feildValue
                    } else {
                        return false
                    }
                }
            }
        }
    }
    return obj
}
var resetKeywords = fieldRules.resetKeywords
/**
 * [reset description]检测是否重置初始化状态
 * @return {[type]} [description] true：需初始化 false：无需初始化
 */
function clearCache() {
    var resetStatus = false
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
    if (resetStatus) {
        removeAliasId()
        removeIdentifyId()
        Storage.removeLocal('ARKSUPER')
        Storage.removeSession('STARTUP')
        Storage.setLocal("FRISTDAY", Util.format(new Date(), 'yyyyMMdd'))
        Storage.setLocal("FRISTIME", true)
        Storage.removeLocal("POSTDATA")
        Storage.removeLocal("ANSSERVERTIME")
    }
    return resetStatus
}
/**
 * [isStartUp description]检测启动状态
 * @return {Boolean} [description] true：已启动，false：未启动
 */
function isStartUp() {
    var startUpStatus = Storage.getSession('STARTUP') || false
    if (startUpStatus === false) {
        Storage.setSession('STARTUP', true)
        Storage.setSession('STARTUPTIME', Util.format(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS'))
        sessionId.setId()

    }
    return startUpStatus
}

function checkBase() {
    for (var key in baseConfig.base) {
        resetCode()
        baseConfig.status.FnName = 'AnalysysAgentInit'
        baseConfig.status.key = key
        var rule = fieldRules[key]
        if (key === '$debug') {
            rule = fieldRules['xcontext'][key]
        }
        if (key === '$lib_version') {
            rule = fieldRules['xcontext'][key]
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

function checkPrivate(obj, ruleName) {
    resetCode()
    var rule = fieldRules[ruleName] || fieldRules.xcontextCommonRule
    if (Util.paramType(obj) !== 'Object') {
        var checkKey = rule.check.key
        var status = check(obj, checkKey)
        baseConfig.status.key = obj
        if (!status) {
            return false
        }
    } else {
        for (var key in obj) {
            var status = checkFields(key, obj[key], rule)
            if (!status) {
                return false
            }
        }
    }
    return true
}
export { fillField, clearCache, isStartUp, checkBase, checkPrivate, resetCode }