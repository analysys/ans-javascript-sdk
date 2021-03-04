import { domParentList } from '../../lib/getField.js'
import Util from '../../../../../lib/common/index.js'
import 'intersection-observer'
var rootNodeRE = /^(?:body|html)$/i

function pathContrast (eventPath, elePath) {
  eventPath = eventPath.split('<body')[0]
  elePath = elePath.split('<body')[0]
  var eventPathArray = eventPath.split('<')
  var elePathArray = elePath.split('<')
  if (eventPathArray[0] === elePathArray[0]) {
    for (var i = 1; i < eventPathArray.length; i++) {
      if (eventPathArray[i].indexOf('|') > -1 && elePathArray[i].indexOf('|') > -1) {
        var eventPathIndex = eventPathArray[i].split('|')[1]
        var elePathIndex = elePathArray[i].split('|')[1]
        if (eventPathIndex !== elePathIndex) {
          return false
        }
      }

      if (eventPathArray[i].split('.')[0] !== elePathArray[i].split('.')[0]) {
        return false
      }
    }
    return true
  }
  return false
}

function parseEvent (path) {
  var eleObj = parserDom(path)
  if (eleObj.length === 0) {
    return
  }
  var baseEle = eleObj[0].elePath
  try {
    if (baseEle.indexOf('#') > -1) {
      baseEle = '#' + baseEle.split('#')[1]
    }
    var eleList = Util.selectorAllEleList(baseEle) // document.querySelectorAll(baseEle)
    for (var i = 0; i < eleList.length; i++) {
      var ele = eleList[i]
      if (rootNodeRE.test(ele.nodeName)) {
        return document.body
      }
      var elePath = domParentList(ele)
      var eleIndex = parserDom(elePath).index
      if (elePath === path || (pathContrast(elePath, path) === true && eleObj.index === eleIndex)) {
        return eleList[i]
      }
    }
  } catch (e) { }
  return null
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
      elePath: path.split('|')[0],
      index: path.split('|')[1]
    }]
  }
  var pathObj = path.split('<')
  for (var i = 0; i < pathObj.length; i++) {
    var elelPath = pathObj[i].split('|')[0]
    var eleIndex = pathObj[i].split('|')[1]
    eleList.push({
      elePath: elelPath,
      index: eleIndex
    })
  }
  return eleList
}

/**
 * [eleCss description]根据元素对应css列表获取对应属性
 * @param  {[type]} element  [description]元素dom
 * @param  {[type]} property [description]css名称
 * @return {[type]} value [description]css名称对应值
 */
function eleCss (element, property) {
  var len1, prop, props, q
  if (!element) {
    return
  }
  if (typeof property === 'string') {
    return getConstantStyle(element, property)
  } else if (Array.isArray(property)) {
    props = {}
    for (q = 0, len1 = property.length; q < len1; q++) {
      prop = property[q]
      props[prop] = getConstantStyle(element, prop)
    }
    return props
  }
}
function eleScroll (ele) {
  var scrollTop = 0
  var scrollLeft = 0
  while (ele != null && ele !== document.body) {
    if (ele.nodeType === 1) {
      scrollTop += ele.scrollTop
      scrollLeft += ele.scrollLeft
    }
    ele = ele.parentNode
  }
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
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
    hidden: elemHidden,

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
  var position = {
    top: 0,
    left: 0,
    hidden: true
  }

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
    hidden: elePosition.hidden,
    scrollLeft: elePosition.scrollLeft,
    scrollTop: elePosition.scrollTop
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
  if (document && document.documentElement && document.getElementsByTagName && document.getElementById && document.body && document.documentElement.scrollWidth !== 0) {
    return true
  } else {
    return false
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
  while (ele && ele.tagName.toUpperCase() !== 'BODY' && ele.tagName.toUpperCase() !== 'HTML') {
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
/**
 * addObserver
 * 添加元素展示监听
 * @param {*} ele 
 * @param {*} callback 显示或隐藏时,回调函数
 */
function addObserver (ele, callbackFn, removeFn) {
  var callback = function (entries) {
    for (var i = 0; i < entries.length; i++) {
      var entriesEle = entries[i].target || entries[i].srcElement
      if (entriesEle === ele && entries[i].intersectionRatio > 0) {
        callbackFn.call(callbackFn, entries)
      } else if (entries[i].intersectionRatio <= 0) {
        removeFn.call(removeFn, entries)
      }
    }
  }
  var io = new IntersectionObserver(callback, {
    threshold: [0.01]
  });
  io.observe(ele)
}
function eleIsHidden (ele) {
  if (eleCss(ele, 'display') === 'none' || eleCss(ele, 'width') === '0px' || eleCss(ele, 'height') === '0px') {
    return true
  }
  return false
}
function offset (curEle) {
  var totalLeft = null, totalTop = null, par = curEle;
  var eleTable = null
  //首先加自己本身的左偏移和上偏移
  // totalLeft += curEle.offsetLeft;
  // totalTop += curEle.offsetTop
  //只要没有找到body，我们就把父级参照物的边框和偏移也进行累加
  while (par) {
    if (par.tagName === 'TABLE') {
      eleTable = par
    }
    if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
      //累加父级参照物的边框
      totalLeft += par.clientLeft;
      totalTop += par.clientTop
    }
    //累加父级参照物本身的偏移
    totalLeft += par.offsetLeft;
    totalTop += par.offsetTop
    par = par.offsetParent;
  }

  return {
    left: totalLeft,
    top: totalTop,
    eleTable: eleTable
  }
}
export { elementPostion, eleCss, parseEvent, parserDom, domParentList, isEmbedded, isElmentReady, isParent, getConstantStyle, pipParam, addObserver, eleIsHidden, offset, eleScroll, eleOffset }
