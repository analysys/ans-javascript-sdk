/**
 * SDK 基础字段定义表
 * base.outer：上报日志基础结构定义
 * base.xcontext:上报报文找中xcontext下的共有字段定义
 * $开头的字段为各个事件特殊拥有字段
 */
var temp = {}
var event = ['$startup', '$track', '$pageview', '$webstay', '$web_click', '$errorLog', '$getPresetProperties']
var common = {
  xcontext: [
    '$model',
    '$os',
    '$os_version',
    '$browser',
    '$browser_version',
    '$brand'
  ]
}
for (var i = 0; i < event.length; i++) {
  temp[event[i]] = common
}
export default temp
