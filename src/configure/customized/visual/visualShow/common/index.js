import Util from '../../../../../lib/common/index.js'
import { getElementContent } from '../../../heatmap/lib/elementContent.js'
import { HybridAns } from '../../../hybrid/lib/hybrid.js'
import baseConfig from '../../../../../lib/baseConfig/index.js'
// var rootNodeRE = /^(?:body|html)$/i
function getPath (ele) {
  var tagName = ele.tagName.toLowerCase()
  var classPath = ''
  var classNameList = Util.paramType(ele.className) !== 'String' ? [] : ele.className.split(' ')
  for (var i = 0; i < classNameList.length; i++) {
    if (classNameList[i] && classNameList[i].indexOf('ARK') < 0) {
      classPath += '.' + classNameList[i]
    }
  }
  return {
    className: classPath,
    id: ele.id || '',
    tagName: tagName
  }
}
function domParentList (ele, status) {
  var list = []
  var newPath = []
  var parent = ele
  while (parent != null) {
    var eleNodeType = parent.nodeType
    if (eleNodeType !== 1) {
      parent = parent.parentNode
      continue
    }
    var elePath = getPath(parent)
    var pathIndex = null
    if (status !== true) {
      pathIndex = getEleIndex(parent)
    }

    // if (!status) {
    list.push(elePath.tagName + (elePath.id ? '#' + elePath.id : '') + elePath.className)
    // } else {
    var path = {
      // className: elePath.className || '',
      id: elePath.id,
      tagName: elePath.tagName,
    }
    if (elePath.row !== null) {
      path['row'] = pathIndex.row
    } else {
      path['index'] = pathIndex.index
    }
    newPath.push(Util.delEmpty(path))
    // }

    parent = parent.parentNode
  }
  return {
    path: list.join('<'),
    newPath: newPath
  }
}

function getEleIndex (ele) {
  var parent = ele.parentNode
  var index = 0
  var parnetStatus = true
  var row = null
  while (parent !== null && parnetStatus === true) {
    var eleNodeType = parent.nodeType
    if (eleNodeType !== 1) {
      parent = parent.parentNode
      continue
    }
    var childEles = parent.children
    var childElesPath = []
    var elePath = {}
    for (var i = 0; i < childEles.length; i++) {
      var childElePath = getPath(childEles[i])
      childElesPath.push(childElePath)
      if (ele === childEles[i]) {
        elePath = childElePath
        index = i
      }
    }
    var isRow = false
    for (var y = 0; y < childEles.length; y++) {
      // if (newPathContrast({ newPath: childElesPath[y] }, elePath) === true) {
      if (childElesPath[y].tagName === elePath.tagName) {
        isRow = true
      }
    }
    if (isRow === true) {
      row = index
    }
    parnetStatus = false
  }
  return {
    row: row,
    index: index
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
function delPathRow (pathList) {
  var copyPathList = Util.arrayMerge([], pathList)
  for (var i = 0; i < copyPathList.length; i++) {
    delete copyPathList[i].row
  }
  return copyPathList
}
/**
 * 拥有new_path时，点击元素是否符合可视化元素列表中的元素
 *
 * @param {*} clickEleObj 点击元素
 * @param {*} eventEleObj 可视化元素
 * @returns {Boolean} 是否符合
 */
function newPathContrast (clickObj, eventNewPath, isNotDeep) {
  var clickNewPath = clickObj.newPath
  var clickNewPathList = Util.arrayMerge([], clickNewPath)
  var eventNewPathList = Util.arrayMerge([], eventNewPath)
  var newPath = Util.arrayMerge([], clickNewPath)
  var ele = clickObj.ele

  if (clickNewPathList === eventNewPathList) {
    return true
  }
  if (clickNewPathList.length < eventNewPathList.length) {
    return false
  }
  if (clickObj.ele && clickNewPathList.length > eventNewPathList.length) {
    if (isNotDeep === true) {
      return false
    }
    var num = clickNewPathList.length - eventNewPathList.length
    clickNewPathList.splice(0, num)
    for (var i = 0; i < num; i++) {
      ele = ele.parentNode || document.body
    }

    newPath = Util.arrayMerge([], clickNewPathList)
  }
  var status = true
  var startNum = 0
  while (startNum < eventNewPathList.length) {
    var eventPath = eventNewPathList[startNum]
    var clickPath = clickNewPathList[startNum]

    if (Util.objHasKay(clickPath, 'row') === true && Util.objHasKay(eventPath, 'row') === false && Util.objHasKay(clickPath, 'index') === false) {
      delete clickPath.row
    }
    if ((eventPath.id && eventPath.id !== clickPath.id) ||
      eventPath.tagName !== clickPath.tagName || clickPath.index !== eventPath.index ||
      clickPath.row !== eventPath.row) {
      status = false
      break
    }
    startNum++
  }
  if (status === true) {
    clickObj.newPath = newPath
    clickObj.ele = ele
  }
  return status
}
function isClassContrast (clickEle, eventClass) {
  var clickClass = clickEle ? clickEle.className : null
  if (Util.paramType(clickClass) === 'String' && Util.paramType(eventClass) === 'String') {
    clickClass = Util.trim(clickClass) || null
    eventClass = Util.trim(eventClass) || null
    if (clickClass && eventClass && clickClass.indexOf(eventClass) > -1) {
      return true
    }
  }
  return false
}
function bindingContrast (ele, bindings) {
  for (var i = 0; i < bindings.length; i++) {
    var binding = bindings[i]
    if (binding.prop_name === 'text') {
      var eleText = getElementContent(ele)
      if (eleText !== binding.value) {
        return false
      }
    } else if (binding.prop_name === 'class') {
      if (!isClassContrast(ele, binding.value)) {
        return false
      }
    }
  }
  return true
}
/**
 * 点击元素是否符合可视化元素列表中的元素
 * @param {JSON} clickEleObj 点击元素
 * @param {JSON} eventEleObj 可视化元素
 * @returns {Boolean} 是否符合
 */
function pathContrast (clickEleObj, eventEleObj, isNotDeep) {
  var status = true
  var isNewPath = false
  eventEleObj.bindings = eventEleObj.bindings || eventEleObj.props_binding

  if (clickEleObj.newPath && eventEleObj.newPath) {
    isNewPath = true
    status = newPathContrast(clickEleObj, eventEleObj.newPath, isNotDeep)
  }
  if (status === true && eventEleObj.bindings && eventEleObj.bindings.length > 0) {
    isNewPath = true
    status = bindingContrast(clickEleObj.ele, eventEleObj.bindings)
  }
  if (isNewPath) {
    return status
  }
  var clickPath = clickEleObj.path || clickEleObj.link
  var eventPath = eventEleObj.path || eventEleObj.link
  var clickIndex = clickEleObj.index || 0
  var eventIndex = eventEleObj.index || 0
  var clickEle = clickEleObj.ele || null
  var isText = eventEleObj.isText || ''
  if (isText !== '') {
    var eleText = getElementContent(clickEle)
    if (isText !== eleText) {
      return false
    }
  }
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
  if (parentContrast(clickPathArray, eventPathArray) && clickIndex === eventIndex) {
    return true
  }

  return false
}
/**
 * 通过new_path 查找元素
 * @param {JSON} path
 * @returns {Element} ele 解析到的元素
 */

function parseNewPath (path, step, parentTarger) {
  var stepPaths = null

  if (!parentTarger) {
    parentTarger = document
    stepPaths = path
  } else {
    if (step === 0) {
      if (path.length === 1) {
        return parentTarger
      } else {
        stepPaths = path.slice(0, path.length - step)
        parentTarger = parentTarger.parentNode
      }
    } else {
      stepPaths = path.slice(0, path.length - 1)
      while (step > 0) {
        parentTarger = parentTarger.parentNode
        if (!parentTarger) {
          return null
        }
        step--
      }
    }
  }
  var childNode = parentTarger
  var stepPathLen = stepPaths.length - 1

  while (stepPathLen >= 0) {
    var stepPath = stepPaths[stepPathLen]
    var tagName = stepPath.tagName

    var index = Util.paramType(stepPath.row) === 'Number' ? stepPath.row : stepPath.index
    var id = stepPath.id || ''
    if (tagName === 'html') {
      index = 0
    }
    if (Util.paramType(index) !== 'Number') {
      return null
    }
    var childrenList = childNode.children
    if (childrenList.length < index) {
      return null
    }
    childNode = childrenList[index]
    if (!childNode || (id && childNode.id !== id) || (Util.paramType(childNode.tagName) === 'String' && tagName !== childNode.tagName.toLowerCase())) {
      return null
    }
    stepPathLen--
  }
  return childNode
}
/**
 * 通过Path查找元素
 *
 * @param {String} path 元素Path
 * @returns
 */
function parseEvent (path) {
  var eleObj = parserDom(path)
  if (eleObj.length === 0) {
    return
  }
  var baseEle = eleObj[0]
  if (baseEle.elePath.indexOf('#') > -1) {
    baseEle.elePath = '#' + baseEle.elePath.split('#')[1]
  }
  var eleList = Util.selectorAllEleList(baseEle.elePath)
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
    var pathObj = domParentList(eleList[i], 'noIndex')
    if (pathContrast({
      path: pathObj.path
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

function camelize (str) {
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
function getEleScroll (ele) {
  var scrollTop = 0
  var scrollLeft = 0
  while (ele != null && ele !== document.body) {

    scrollTop += (ele.scrollTop || 0)
    scrollLeft += (ele.scrollLeft || 0)
    ele = ele.parentNode
  }

  return {
    scrollTop: scrollTop,
    scrollLeft: scrollLeft
  }
}
// function getMargin (ele) {
//   var parentEle = ele.parentNode
//   var marginBase = {
//     top: 0,
//     right: 0,
//     bottom: 0,
//     left: 0,
//   }
//   if (parentEle) {
//     var clildEle = parentEle.childNodes
//     var num = 0
//     var eleTop = ele.offsetTop
//     var eleLeft = ele.offsetLeft
//     while (num < clildEle.length) {
//       if (clildEle[num].nodeType !== 1) {
//         num++
//         continue
//       }
//       if (ele === clildEle[num]) {
//         break
//       }
//       var margin = getConstantStyle(clildEle[num], 'margin').replace(/px/g, '')
//       var marginList = margin.split(' ')
//       var top = 0
//       var left = 0
//       var right = 0
//       var bottom = 0
//       if (eleTop === clildEle[num].offsetTop) {
//         left = marginList[3] ? Number(marginList[3]) : 0
//         right = marginList[1] ? Number(marginList[1]) : 0
//       }
//       if (eleLeft === clildEle[num].offsetLeft) {
//         top = marginList[0] ? Number(marginList[0]) : 0
//         bottom = marginList[2] ? Number(marginList[2]) : 0
//       }
//       marginBase.top += top + bottom
//       marginBase.left += left + right
//       num++
//     }
//   }
//   return marginBase
// }
/**
 * [parserDom description]根据元素及其上层元素获取元素位置及显示/隐藏
 * @param  {[type]} ele [description] 元素Dom对象
 * @return {[type]} obj [description] 元素对应位置与显示/隐藏
 */
function eleOffset (ele) {
  var realTop = 0
  var realLeft = 0
  var eleScroll = getEleScroll(ele)
  var eleScrollTop = eleScroll.scrollTop
  var eleScrollLeft = eleScroll.scrollLeft
  var isFixed = false
  while (ele && ele.tagName && ['canvas', 'svg', 'use', 'script', 'meta', 'style'].indexOf(ele.tagName.toLowerCase()) < 0) {
    realTop += ele.offsetTop
    realLeft += ele.offsetLeft

    try {
      var translates = getConstantStyle(ele, 'transform')
      if (translates && translates !== 'none') {
        realLeft += parseFloat(translates.substring(6).split(',')[4])
        realTop += parseFloat(translates.substring(6).split(',')[5])
      }
    } catch (e) { }
    try {
      var elePosition = getConstantStyle(ele, 'position')
      if (elePosition && elePosition === 'fixed') {
        isFixed = true
      }
    } catch (e) { }
    ele = ele.offsetParent
  }

  if (isFixed === true) {
    realTop += eleScrollTop
    realLeft += eleScrollLeft
    realTop += (document.body.scrollTop || document.documentElement.scrollTop || 0)
    realLeft += (document.body.scrollLeft || document.documentElement.scrollLeft || 0)
  }


  return {
    top: realTop,
    left: realLeft,
    hidden: false,
    bodyScrollTop: document.documentElement.scrollTop || document.body.scrollTop || 0,
    bodyScrollLeft: document.documentElement.scrollLeft || document.body.scrollLeft || 0,
    eleScrollTop: eleScrollTop,
    eleScrollLeft: eleScrollLeft
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
function elePCOffset (ele) {
  var boxPosition = ele.getBoundingClientRect()
  // var realTop = 0
  // var realLeft = 0
  // var elemHidden = false
  // // var isFixed = false

  // while (ele != null) {
  //   realTop += ele.offsetTop
  //   realLeft += ele.offsetLeft

  //   // if (!elemHidden) {
  //   //   elemHidden = !!(eleCss(ele, 'display') === 'none' || eleCss(ele, 'width') === '0px' || eleCss(ele, 'height') === '0px')
  //   // }

  //   // if (eleCss(ele, 'position') === 'fixed') {
  //   //   isFixed = true
  //   // }
  //   ele = ele.offsetParent
  // }
  // if (isFixed === true) {
  //   realTop += document.documentElement.scrollTop || document.body.scrollTop
  //   realLeft += document.documentElement.scrollLeft || document.body.scrollLeft
  // }
  return {
    top: boxPosition.top,
    left: boxPosition.left,
    hidden: false,

  }
}
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
  var elePosition = elePCOffset(elem)
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
var openTime = +new Date()
function isElmentReady () {
  if (!document.documentElement || document.documentElement.scrollWidth === 0 || document.readyState !== 'complete') {
    if (+new Date() - openTime > 5000) {
      return true
    }
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
  } else if (el.currentStyle) {
    return el.currentStyle[pelStr]
  } else {
    return 0
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
  var eleList = Util.selectorAllEleList(baseEle.elePath) // document.
  var index = 0
  for (var i = 0; i < eleList.length; i++) {
    var pathObj = domParentList(eleList[i])
    if (pathContrast({
      path: pathObj.path
    }, {
      path: link
    }) === true) {
      if (eleList[i] === ele) {
        return index
      }
      index++
    }
  }
  return 0
}

function boxPosition (ele, blo) {
  var boxW = 435
  var boxH = 482
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
function getAttr (ele) {
  var eleClass = []
  if (ele.className) {
    var classArray = ele.className.split(' ')
    for (var i = 0; i < classArray.length; i++) {
      if (Util.trim(classArray[i]) !== '') {
        eleClass.push(classArray[i])
      }
    }
  }
  eleClass = eleClass.join('.')
  var id = ele.id
  var name = ele.getAttribute('name') || ''
  if (name.length > 10) {
    name = Util.stringSlice(name, 10) + '...'
  }
  var title = ele.getAttribute('title') || ''
  if (name.length > 10) {
    title = Util.stringSlice(title, 10) + '...'
  }
  var eleTagName = ele.tagName
  var eleAtrr = []
  if (Util.paramType(id) === 'String' && id !== '') {
    eleAtrr.push({
      prop_name: 'id',
      name: 'ID',
      prop_type: 'string',
      value: id,
      isChoice: false
    })
  }
  if (Util.paramType(eleTagName) === 'String' && eleTagName !== '') {
    eleAtrr.push({
      prop_name: 'tag',
      name: '标签名',
      prop_type: 'string',
      value: eleTagName,
      isChoice: false
    })
  }
  if (Util.paramType(eleClass) === 'String' && eleClass !== '') {
    if (eleClass.length > 10) {
      eleClass = Util.stringSlice(eleClass, 10) + '...'
    }
    eleAtrr.push({
      prop_name: 'class',
      name: '类名',
      prop_type: 'string',
      value: eleClass,
      isChoice: false
    })
  }
  if (Util.paramType(name) === 'String' && name !== '') {
    eleAtrr.push({
      prop_name: 'mane',
      name: '名称',
      prop_type: 'string',
      value: name,
      isChoice: false
    })
  }
  if (Util.paramType(title) === 'String' && title !== '') {
    eleAtrr.push({
      prop_name: 'title',
      name: 'title',
      prop_type: 'string',
      value: title,
      isChoice: false
    })
  }
  return eleAtrr
}
function backH5PathProPath (clickPath, related) {

  // var clickPathCopy = Util.arrayMerge([], clickPath)
  var relatedPathCopy = Util.arrayMerge([], related.h5_path)
  // var step = related.step
  // if (step !== 0) {
  //   clickPathCopy.splice(0, step)
  // }
  // relatedPathCopy.splice(relatedPathCopy.length - 1, 1)
  // for (var i = 0; i < clickPathCopy.length; i++) {
  //   relatedPathCopy.push(clickPathCopy[i])
  // }
  // var proPath = Util.arrayMerge(relatedPathCopy, clickPathCopy)
  return relatedPathCopy
}
function getRelated (relateds, callback, timeId, clickEle) {
  if (!relateds) {
    return {}
  }
  if (Util.paramType(relateds) === 'Object') {
    relateds = [relateds]
  }
  var pros = {}
  var appRelateds = []
  var appPro = {}
  for (var i = 0; i < relateds.length; i++) {
    var related = relateds[i]
    var path = related.target.h5_path
    var step = related.target.step
    if (path) {
      var ele = parseNewPath(path, step, clickEle)
      var value = ele ? getElementContent(ele, true) : ''
      var proList = getProperties(related.properties, value)
      pros = Util.objMerge(pros, proList)
    } else {
      appRelateds.push(related)
    }
  }
  if (appRelateds.length > 0) {
    if (Util.isiOS === false) {
      appPro = window.AnalysysAgentHybrid.getProperty(JSON.stringify(appRelateds))
      if (Util.paramType(appPro) === 'String') {
        appPro = JSON.parse(appPro)
      }
    } else {
      HybridAns.visitorProperties[timeId] = (function (pros) {
        return function (p) {
          pros = Util.objMerge(pros, p)
          callback(pros)
        }
      })(pros)
      if (window.AnalysysModule && window.AnalysysModule.moduleStatus === true) {
        window.AnalysysModule.getPro(appRelateds, timeId)
      } else {
        window.webkit.messageHandlers.AnalysysAgentGetProperty.postMessage([JSON.stringify(appRelateds), timeId]);
      }
      // window.AnalysysAgentHybrid.getProperty(appRelateds, timeId)
      return
    }
    pros = Util.objMerge(pros, appPro)
  } else if (Util.isiOS === true && baseConfig.base.isHybrid === true && callback) {
    callback(pros)
  }

  return pros
}
function getProperties (properties, value) {
  var pros = {}
  for (var i = 0; i < properties.length; i++) {
    var property = properties[i]
    var valueType = property.prop_type
    value = Util.objHasKay(property, 'value') === true ? property.value : value
    var regex = property.regex
    var key = property.key
    if (regex) {
      try {
        regex = Util.decode(regex)
        value = new RegExp(regex).exec(value)
      } catch (e) { }
    }
    if (valueType === "number") {
      try {
        value = Number(value)
      } catch (e) { }
    } else if (valueType === "bool") {
      if (Util.paramType(value) !== 'Boolean') {
        if (value === "true" || value === "1") {
          value = true
        } else if (value === "false" || value === "0") {
          value = false
        }
      }
    } else {
      try {
        value = value.toString()
      } catch (e) { }
    }
    pros[key] = value
  }
  return pros
}
/**
 * 根据查找元素
 * @param {Map} pageEvents 埋点列表
 * @param {Map} ele 元素列表
 * @returns {Map} eleList 命中元素
 */
function parserPageEvents (pageEvents, ele) {
  var eleList = []
  var parentEle = ele || document.body
  var childEles = parentEle.childNodes
  for (var i = 0; i < childEles.length; i++) {
    var childEle = childEles[i]
    var eleClassName = Util.paramType(childEle.className) === 'String' ? childEle.className : ''
    if (childEle.nodeType === 1 && eleClassName.indexOf('ARK_') < 0) {
      var pathObj = domParentList(childEle)
      var clickEleObj = {
        newPath: pathObj.newPath,
        ele: childEle,
        path: pathObj.path
      }
      for (var y = 0; y < pageEvents.length; y++) {
        var eventEleObj = pageEvents[y]
        if (checkNewPathBase(clickEleObj.newPath, eventEleObj.newPath) == true && pathContrast(clickEleObj, eventEleObj, true) === true) {
          eleList.push({
            config: eventEleObj,
            ele: childEle,
            newPath: pathObj.newPath
          })
          pageEvents[y]['inPage'] = true
        }
      }
      var eles = childEle.childNodes || []
      if (eles.length > 0) {
        var childEleList = parserPageEvents(pageEvents, childEle)
        if (childEleList.length > 0) {
          eleList = Util.arrayMerge(eleList, childEleList)
        }
      }
    }

    // }
  }
  return eleList
}
function backEasyPath (pathList) {
  var path = []
  for (var i = 0; i < pathList.length; i++) {
    path.push(pathList[i].tagName)
  }
  return path.join('>')
}
function checkNewPathBase (clickPathList, eventPathList) {
  if (!eventPathList) {
    if (clickPathList) {
      return true
    }
    return false
  }
  var clickCopy = JSON.parse(JSON.stringify(clickPathList))//Util.arrayMerge([], clickPathList)
  var eventCopy = JSON.parse(JSON.stringify(eventPathList))//Util.arrayMerge([], eventPathList)
  clickCopy.reverse()
  eventCopy.reverse()
  var clickPath = backEasyPath(clickCopy)
  var eventPath = backEasyPath(eventCopy)
  if (clickPath.indexOf(eventPath) > -1) {
    return true
  }
  return false
}
export { elementPostion, eleCss, parseEvent, parserDom, domParentList, isEmbedded, isElmentReady, isParent, getConstantStyle, pipParam, setIndex, boxPosition, pathContrast, eleOffset, getAttr, parseNewPath, getRelated, getProperties, newPathContrast, cssContrast, parentContrast, delPathRow, parserPageEvents, backH5PathProPath, checkNewPathBase }
