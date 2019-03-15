
import * as base from './base/index.js'
import Util from '../lib/common/index.js'

var plugList = []
var fieldRules = base["fieldRules"] || {}
var fieldTemplate = base["fieldTemplate"] || {}
var lifecycle = base["lifecycle"] || {}
for (var i = 0; i < plugList.length; i++) {
    if (plugList[i]["fieldRules"]) {
        fieldRules = Util.objMerge(fieldRules, plugList[i].fieldRules)
    }
    if (plugList[i]["fieldTemplate"]) {
        fieldTemplate = Util.objMerge(fieldTemplate, plugList[i].fieldTemplate)

    }
    if (plugList[i]["lifecycle"]) {
        lifecycle = Util.fnMerge(lifecycle, plugList[i].lifecycle)
    }
}

// console.log('fieldRules===>', fieldRules)
// console.log('fieldTemplate===>', fieldTemplate)
// console.log('lifecycle===>', lifecycle)
export {
    fieldRules,
    fieldTemplate,
    lifecycle
}