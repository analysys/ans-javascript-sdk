import Util from '../../../../../lib/common/index.js'
// var rootNodeRE = /^(?:body|html)$/i

function domParentList (ele) {
  var list = []
  var parent = ele
  while (parent != null) {
    var eleNodeType = parent.nodeType
    if (eleNodeType !== 1) {
      parent = parent.parentNode
      continue
    }
    var tagName = parent.tagName.toLowerCase()
    var parentID = parent.id ? ('#' + parent.id) : ''
    var classNameList = Util.paramType(parent.className) !== 'String' ? [] : parent.className.split(' ')
    if (classNameList.length > 0) {
      var classPath = ''
      for (var i = 0; i < classNameList.length; i++) {
        if (classNameList[i] && classNameList[i].indexOf('ARK') < 0) {
          classPath += '.' + classNameList[i]
        }
      }
      list.push(tagName + parentID + classPath)
    } else {
      list.push(tagName + parentID)
    }

    parent = parent.parentNode
  }
  return list.join('<')
}
function gGetRect (element) {

  var rect = element.getBoundingClientRect();

  var top = document.documentElement.clientTop;

  var left = document.documentElement.clientLeft;

  return {

    top: rect.top - top,

    bottom: rect.bottom - top,

    left: rect.left - left,

    right: rect.right - left

  }

}
function cssContrast (clickPathList, eventPathList) {
  for (var i = 0; i < clickPathList.length; i++) {
    if (clickPathList[i] && eventPathList[i] && i < 3) {
      var clickEleCssList = clickPathList[i].split('.').slice(1)
      var eventCssList = eventPathList[i].split('.').slice(1)
      for (var y = 0; y < eventCssList.length; y++) {
        if (clickEleCssList.indexOf(eventCssList[y]) < 0) {
          return false
        }
      }
    }
  }
  // if (clickEleCss === eventCss || (clickEleCss && eventCss && clickEleCss.indexOf(eventCss) > -1)) {
  //   return true
  // }
  return true
}
function parentContrast (clickPathList, eventPathList) {
  for (var i = 0; i < clickPathList.length; i++) {
    if (clickPathList[i].split('.')[0] !== eventPathList[i].split('.')[0]) {
      return false
    }
  }
  return true
}
function pathContrast (clickEleObj, eventEleObj) {
  var clickPath = clickEleObj.path
  var eventPath = eventEleObj.path
  var clickIndex = clickEleObj.index || 0
  var eventIndex = eventEleObj.index || 0
  var clickEle = clickEleObj.ele || null
  if (clickPath === eventPath && clickIndex === eventIndex) {
    return true
  }
  var clickPathArray = clickPath.split('<')
  var eventPathArray = eventPath.split('<')

  if (clickPathArray.length < eventPathArray.length) {
    return false
  }

  if (clickPathArray.length > eventPathArray.length) {
    var lengthNum = clickPathArray.length - eventPathArray.length
    clickPathArray = clickPathArray.splice(lengthNum)
    // 点击的为子节点则不校验点击元素位置
    // clickIndex = eventIndex
    var parentEle = clickEle
    while (lengthNum > 0 && parentEle) {
      parentEle = parentEle.parentNode
      lengthNum--
    }
    if (!parentEle) {
      return false
    }
    clickIndex = setIndex(parentEle, clickPathArray.join('<'))
  }
  if (parentContrast(clickPathArray, eventPathArray) && cssContrast(clickPathArray, eventPathArray) && clickIndex === eventIndex) {
    return true
  }

  return false
}

function parseEvent (path) {
  var eleObj = parserDom(path)
  if (eleObj.length === 0) {
    return
  }
  var baseEle = eleObj[0]
  if (baseEle.elePath.indexOf('#') > -1) {
    baseEle.elePath = '#' + baseEle.elePath.split('#')[1]
  }
  var eleList = Util.selectorAllEleList(baseEle.elePath) // document.querySelectorAll(baseEle.elePath)
  // var anchors = [];
  // for (var y = 0; y < eleList.length; y++) {
  //   anchors.push(eleList[y]);
  // }
  // anchors = anchors.sort(function (x, y) {
  //   return eleOffset(x).left - eleOffset(y).left && eleOffset(x).top - eleOffset(y).top
  // })
  // eleList = anchors
  var allEleList = []
  for (var i = 0; i < eleList.length; i++) {
    if (pathContrast({
      path: domParentList(eleList[i])
    }, {
      path: path
    }) === true) {
      allEleList.push(eleList[i])
    }
  }
  return allEleList
}
/**
 * [parserDom description]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function parserDom (path) {
  var eleList = []
  if (path.indexOf('<') < 0) {
    return [{
      elePath: path,
    }]
  }
  var pathObj = path.split('<')
  for (var i = 0; i < pathObj.length; i++) {
    var elelPath = pathObj[i]
    eleList.push({
      elePath: elelPath
    })
  }
  return eleList
}

var camelize = function (str) {
  return str.replace(/-+(.)?/g, function (match, chr) {
    if (chr) {
      return chr.toUpperCase()
    } else {
      return ''
    }
  })
}
/**
 * [eleCss description]根据元素对应css列表获取对应属性
 * @param  {[type]} element  [description]元素dom
 * @param  {[type]} property [description]css名称
 * @return {[type]} value [description]css名称对应值
 */
function eleCss (element, property) {
  var computedStyle, len1, prop, props, q
  if (!element) {
    return
  }
  computedStyle = window.getComputedStyle(element, '')
  if (typeof property === 'string') {
    return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
  } else if (Array.isArray(property)) {
    props = {}
    for (q = 0, len1 = property.length; q < len1; q++) {
      prop = property[q]
      props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop)
    }
    return props
  }
}

/**
 * [parserDom description]根据元素及其上层元素获取元素位置及显示/隐藏
 * @param  {[type]} ele [description] 元素Dom对象
 * @return {[type]} obj [description] 元素对应位置与显示/隐藏
 */
function eleOffset (ele) {
  var realTop = 0
  var realLeft = 0
  var elemHidden = false
  var isFixed = false
  while (ele != null) {
    realTop += ele.offsetTop
    realLeft += ele.offsetLeft
    if (!elemHidden) {
      elemHidden = !!(eleCss(ele, 'display') === 'none' || eleCss(ele, 'width') === '0px' || eleCss(ele, 'height') === '0px')
    }
    if (eleCss(ele, 'position') === 'fixed') {
      isFixed = true
    }
    ele = ele.offsetParent
  }
  if (isFixed === true) {
    realTop += document.documentElement.scrollTop || document.body.scrollTop
    realLeft += document.documentElement.scrollLeft || document.body.scrollLeft
  }
  return {
    top: realTop,
    left: realLeft,
    hidden: elemHidden
  }
}

/**
 * [offsetParent description] 获取父元素
 * @return {[type]} [description]
 */
// function eleOffsetParent (elem) {
//   var parent
//   while (elem && !elem.offsetParent) {
//     elem = elem.parentNode
//     if (elem === document.body) {
//       break
//     }
//   }
//   if (!elem) return document.body
//   parent = elem.offsetParent || document.body
//   while (parent && !rootNodeRE.test(parent.nodeName) && eleCss(parent, 'position') === 'static') {
//     parent = parent.offsetParent
//   }
//   return parent
// }
/**
 * [elementPostion description] 返回标签元素坐标及是否隐藏
 * @param  {[type]} elem [description]标签元素
 * @return {[type]}     [description]x-横坐标 number y-纵坐标 number hidden-是否隐藏隐藏 Bloon
 */
function elementPostion (elem) {
  // var t
  var position = {
    top: 0,
    left: 0,
    hidden: true
  }
  // var elemHidden = false

  if (!elem) {
    return position
  }
  var elePosition = eleOffset(elem)
  if (!elePosition) {
    return position
  }
  position = {
    top: elePosition.top,
    left: elePosition.left,
    hidden: elePosition.hidden
  }

  if (!position) {
    return {
      top: 0,
      left: 0,
      hidden: true
    }
  }
  return position
}
/**
 * [isEmbedded description] 判断是否为嵌入式
 * @return {Boolean} [description] true - 嵌入式 false - 交互式
 */
function isEmbedded (key) {
  var urlParam = pipParam(pipParam(Util.GetUrlParam(key), '/'), '#')
  if (window.top !== window.self && urlParam === 'true') {
    return true
  }
  return false
}

/**
 * [isElmentReady description] 页面dom是否渲染成功
 * 仅判断dom列表是否渲染完毕，不保证img加载完毕
 * img加载完触发window.resize进行兼容
 * @return {Boolean} [description]
 */
function isElmentReady () {
  if (!document.documentElement || document.documentElement.scrollWidth === 0) {
    return false
  } else {
    return true
  }
}

/**
 * [isParent description] 判断是当前元素否为指定元素的子元素
 * @param  {[type]}  ele       [description] 当前元素
 * @param  {[type]}  parentEle [description] 指定元素
 * @return {Boolean}           [description]
 */
function isParent (ele, parentEle) {
  // 任何元素都为BODY的子元素
  while (ele && ['BODY', 'HTML'].indexOf(ele.tagName.toUpperCase()) < 0) {
    if (Util.paramType(parentEle) === 'Array') {
      for (var i = 0; i < parentEle.length; i++) {
        if (ele === parentEle[i]) {
          return true
        }
      }
    } else {
      if (ele === parentEle) {
        return true
      }
    }
    ele = ele.parentNode
  }
  return false
}
/**
 * [getConstantStyle description] 返回元素对应的样式值
 * @param  {[type]} el     [description] 元素
 * @param  {[type]} pelStr [description] 样式名称
 * @return {[type]}        [description]
 */
function getConstantStyle (el, pelStr) {
  var w = document.defaultView
  if (w && w.getComputedStyle) {
    return document.defaultView.getComputedStyle(el, null)[pelStr]
  } else {
    return el.currentStyle[pelStr]
  }
}
/**
 * [pipParam description] 去除字符串后面最后一位
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
function pipParam (param, str) {
  if (param.charAt(param.length - 1) === str) {
    param = param.substr(0, param.length - 1)
  }
  if (param.charAt(param.length - 1) === str) {
    param = param.substr(0, param.length - 1)
  }
  return param
}

function setIndex (ele, link) {

  // var link = domParentList(ele)
  var eleObj = parserDom(link)
  if (eleObj.length === 0) {
    return 0
  }
  var baseEle = eleObj[0]
  if (baseEle.elePath.indexOf('#') > -1) {
    baseEle.elePath = '#' + baseEle.elePath.split('#')[1]
  }
  var eleList = Util.selectorAllEleList(baseEle.elePath) // document.querySelectorAll(baseEle.elePath)
  // var anchors = [];
  // for (var y = 0; y < eleList.length; y++) {
  //   anchors.push(eleList[y]);
  // }
  // anchors = anchors.sort(function (x, y) {
  //   return eleOffset(x).left - eleOffset(y).left && eleOffset(x).top - eleOffset(y).top
  // })
  // eleList = anchors
  var allEleList = []
  var index = 0
  for (var i = 0; i < eleList.length; i++) {
    if (pathContrast({
      path: domParentList(eleList[i])
    }, {
      path: link
    }) === true) {
      allEleList.push(eleList[i])
      if (eleList[i] === ele) {
        return index
      }
      index++
    }
  }
  return 0
}

function boxPosition (ele, blo) {
  var boxW = 420
  var boxH = 330
  var num = 4

  if (blo === 'debug') {
    boxW = 260
    boxH = 270
    num = 4
  }
  var postion = elementPostion(ele)
  var top = postion.top
  var left = postion.left
  var width = ele.offsetWidth
  var height = ele.offsetHeight
  var bodyW = document.body.offsetWidth
  var bodyH = document.body.offsetHeight
  var boxLeft = left
  var boxTop = top - boxH - num
  if (boxLeft + boxW > bodyW) {
    boxLeft = left - boxW + width
    if (boxLeft < 0) {
      boxLeft = num
    }
  }
  if (boxTop + boxH + num > bodyH) {
    boxTop = top - boxH - num
  }
  if (boxTop < 0) {
    boxTop = top + height + num
  }
  return {
    top: boxTop,
    left: boxLeft
  }
}

export { elementPostion, eleCss, parseEvent, parserDom, domParentList, isEmbedded, isElmentReady, isParent, getConstantStyle, pipParam, setIndex, boxPosition, pathContrast, eleOffset, gGetRect }
