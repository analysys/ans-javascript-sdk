import Util from '../../../../lib/common/index.js'
import { getRelated, domParentList, eleOffset, getConstantStyle } from '../../visual/visualShow/common/index.js'
import { getElementContent } from '../../heatmap/lib/elementContent.js'
import { successLog } from '../../../../lib/printLog/index.js'
var androidModel = {
  hashCode: '',
  width: 0,
  height: 0,
  aleft: 0,
  atop: 0,
  classes: [],
  clickable: false,
  alpha: 1,
  hidden: 0,
  text: '',
  subviews: [],
  new_path: [],
  url: ''
}
var iosModel = {
  id: '',
  class: [],
  properties: {
    alpha: {
      values: [
        {
          value: 1
        }
      ]
    },
    userInteractionEnabled: {
      values: [
        {
          value: true
        }
      ]
    },
    enabled: {
      values: [
        {
          value: true
        }
      ]
    },
    hidden: {
      values: [
        {
          value: false
        }
      ]
    },
    subviews: {
      values: [
        {
          value: []
        }
      ]
    },
    superview: {
      values: [
        {
          value: 0
        }
      ]
    },
    frame: {
      values: [
        {
          value: {
            AX: 0,
            AY: 0,
            Height: 0,
            Width: 0
          }
        }
      ]
    }
  },
  new_path: [],
  url: '',
  controlEvent: '64'
}
var id = 0
var rootId = 0
var eleList = []

function getDomList (ele, parentId, isEnable) {
  var eleNodeType = ele.nodeType
  if (eleNodeType !== 1) {
    return null
  }
  var eleId = 'web' + (id === 0 ? rootId : (rootId + '' + id))
  var parentELe = ele
  var childIdList = []
  var positionIDList = []
  var clickableElementList = ['a', 'button', 'input', 'select', 'textarea']
  var tagName = ele.tagName.toLowerCase()
  var eleEnable = true
  if (clickableElementList.indexOf(tagName) > -1) {
    eleEnable = false
  }

  while (parentELe !== null) {

    var child = parentELe.children
    if (!child) {
      break
    }
    if (child.length > 0) {

      for (var i = 0; i < child.length; i++) {
        id++
        if (child[i].nodeType === 1 && child[i].tagName && ['canvas', 'svg', 'use', 'script', 'meta', 'style'].indexOf(child[i].tagName.toLowerCase()) < 0) {
          if (child[i].tagName === 'TABLE') {
            var tableChild = child[i].children

            for (var y = 0; y < tableChild.length; y++) {
              id++
              var tableId = getDomList(tableChild[y], eleId, eleEnable)
              var tablePosition = getConstantStyle(tableChild[y], 'position')
              if (tableId) {
                if (tablePosition === 'absolute') {
                  positionIDList.push(tableId)
                } else {
                  childIdList.push(tableId)
                }
              }
            }
          } else {

            var childId = getDomList(child[i], eleId, eleEnable)
            var position = getConstantStyle(child[i], 'position')
            if (childId) {
              if (position === 'absolute') {
                positionIDList.push(childId)
              } else {
                childIdList.push(childId)
              }

            }
          }
        }
      }
    }
    childIdList = Util.arrayMerge(childIdList, positionIDList)
    parentELe = parentELe.children
  }
  var model = {}

  if (Util.isiOS === true) {
    model = setiOSModel(ele, eleId, parentId, childIdList, isEnable)

  } else {
    model = setAndroidModel(ele, eleId, parentId, childIdList, isEnable)
  }
  model.url = Util.getUrlPath()
  model.root_id = 'web' + rootId
  if (ele.tagName !== 'TABLE') {
    eleList.push(model)
  }
  return eleId
}


var detect = Util.detectZoom()
function setiOSModel (ele, eleId, parentId, childIdList, isEnable) {
  var ios = JSON.parse(JSON.stringify(iosModel))

  var postion = eleOffset(ele)
  ios.id = eleId
  // 宽高及坐标
  ios.properties.frame.values[0].value.Width = (ele.offsetWidth || ele.scrollWidth || ele.clientWidth) * detect
  ios.properties.frame.values[0].value.Height = (ele.offsetHeight || ele.offsetHeight || ele.clientHeight) * detect
  ios.properties.frame.values[0].value.AX = postion.left * detect
  ios.properties.frame.values[0].value.AY = postion.top * detect
  var pathObj = domParentList(ele)
  ios.new_path = pathObj.newPath
  // 类名 
  ios.class = (ele.className && Util.paramType(ele.className) === 'String') ? ele.className.split(' ') : []
  //如可触控元素 类名中添加UIControl用来通过后端校验是否为可点击元素
  ios.eg_text = getElementContent(ele)
  ios.properties.enabled.values[0].value = true
  ios.properties.subviews.values[0].value = childIdList
  ios.properties.superview.values[0].value = parentId
  ios.bodyWidth = (window.innerWidth || document.body.offsetWidth || document.body.scrollWidth || document.body.clientWidth) * detect
  ios.bodyHeight = (window.innerHeight || document.body.offsetHeight || document.body.scrollHeight || document.body.clientHeight) * detect
  ios.bodyScrollTop = postion.bodyScrollTop * detect
  ios.bodyScrollLeft = postion.bodyScrollLeft * detect
  ios.eleScrollTop = postion.eleScrollTop * detect
  ios.eleScrollLeft = postion.eleScrollLeft * detect
  var alpha = (ele.style.filter !== '' ? (ele.style.filter.match(/opacity:[/S/s]*?\)/)[0]) : ele.style.opacity) || 1
  ios.properties.alpha.values[0].value = alpha
  if (isEnable === false) {
    ios.properties.userInteractionEnabled.values[0].value = false
    ios.properties.enabled.values[0].value = false
  }

  return ios
}
function setAndroidModel (ele, eleId, parentId, childIdList, isEnable) {
  var android = JSON.parse(JSON.stringify(androidModel))
  var postion = eleOffset(ele)
  var pathObj = domParentList(ele)
  android.new_path = pathObj.newPath
  android.hashCode = eleId
  android.parentid = parentId
  android.bodyWidth = (window.innerWidth || document.body.offsetWidth || document.body.scrollWidth || document.body.clientWidth) * detect
  android.bodyHeight = (window.innerHeight || document.body.offsetHeight || document.body.scrollHeight || document.body.clientHeight) * detect
  android.innerHeight = {
    innerHeight: window.innerHeight,
    scrollHeight: document.body.scrollHeight,
    offsetHeight: document.body.offsetHeight,
    clientHeight: document.body.clientHeight,
  }
  android.width = (ele.offsetWidth || ele.scrollWidth || ele.clientWidth) * detect
  android.height = (ele.offsetHeight || ele.scrollHeight || ele.clientHeight) * detect
  android.aleft = (postion.left - postion.eleScrollLeft) * detect
  android.atop = (postion.top - postion.eleScrollTop) * detect
  android.bodyScrollTop = 0//postion.bodyScrollTop * detect
  android.bodyScrollLeft = 0//postion.bodyScrollLeft * detect
  android.eleScrollTop = postion.eleScrollTop * detect
  android.eleScrollLeft = postion.eleScrollLeft * detect
  android.clickable = isEnable === false ? false : true
  android.text = getElementContent(ele)
  android.alpha = (ele.style.filter !== '' ? (ele.style.filter.match(/opacity:[/S/s]*?\)/)[0]) : ele.style.opacity) || 1
  android.classes = ele.className && Util.paramType(ele.className) === 'String' ? ele.className.split(' ') : []
  android.subviews = childIdList
  return android
}

function HybridVisual (ID) {

  eleList = []
  rootId = ID || +new Date()
  getDomList(document.body, id)
  id = 0
  if (Util.isiOS === true) {
    return JSON.stringify(eleList)
  } else {
    window.AnalysysAgentHybrid.onVisualDomList(JSON.stringify(eleList))
  }
}

var HybridAns = {
  visitorEventList: [],
  visitorProperties: {},
  /**
     * 可视化状态下获取Dom结构
     */
  getVisualDomList: function (webViewPathIdx) {
    // console.log('===APP 请求 可视化数据')
    // console.log('当前页面缩放比' + Util.detectZoom())
    return HybridVisual(webViewPathIdx)
  },
  /**
     * 获取埋点
     */
  onEventList: function (list) {
    list = list || []
    if (Util.paramType(list) === 'String') {
      list = JSON.parse(list)
    }

    var eventList = []
    var listName = []
    for (var i = 0; i < list.length; i++) {
      if (list[i].isAll === 1 || !list[i].target_page || list[i].target_page === Util.getUrlPath()) {
        list[i].bindings = list[i].props_binding
        eventList.push(list[i])
        var listNameObj = {
          'eventID': list[i].event_id,
          'eventName': list[i].event_name || ''
        }

        listName.push(listNameObj)
      }
    }
    HybridAns.visitorEventList = eventList
    successLog('Get Visual Event List from app')
    successLog(JSON.stringify(listName, null, 2))

  },
  getProperty: function (related) {
    if (Util.paramType(related) === 'String') {
      related = JSON.parse(related)
    }
    var pros = []
    var pro = getRelated(related)
    pros.push(pro)
    if (Util.isiOS === true) {
      return JSON.stringify(pro)
    }
    window.AnalysysAgentHybrid.onProperty(JSON.stringify(pro))
  },
  onProperty: function (obj, callbackId) {
    if (Util.paramType(HybridAns.visitorProperties[callbackId]) === 'Function') {
      if (Util.paramType(obj) === 'String') {
        obj = JSON.parse(obj)
      }
      if (Util.paramType(obj) === 'Array') {
        var param = {}
        for (var i = 0; i < obj.length; i++) {
          param = Util.objMerge(param, obj[i])
        }
        obj = param
      }
      HybridAns.visitorProperties[callbackId].call(HybridAns.visitorProperties[callbackId], obj)
      delete HybridAns.visitorProperties[callbackId]
      return true
    }
    return false
  }
}

export { HybridAns }
