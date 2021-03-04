import Util from '../../../../../lib/common/index.js'
import LogAjax from '../../../../../lib/upload/ajax.js'
import './webStayLine.css'
import { heatmapConfig, showMapConfig, backParam } from '../common/config.js'
import { loadingStatus, noDataStatus } from '../head/index.js'
import { getConstantStyle } from '../common/index.js'

import { webStayPageLineTemp, webStayMouseLineTemp } from './webStayDom.js'
var webStayDatas = {}
var isRootEle = true
function getChildEle (ele) {
  var parentEle = ele || document.body
  var childList = parentEle.childNodes
  var scrollEle = document.body
  for (var i = 0; i < childList.length; i++) {
    if (childList[i].nodeType === 1) {
      if (hasScrollbar(childList[i]) === true) {
        isRootEle = false
        return childList[i]
      } else {
        scrollEle = getChildEle(childList[i])
      }
    }
  }
  return scrollEle
}
function hasScrollbar (ele) {

  var scrollHeight = 0
  var innerHeight = 0
  var baseHeight = document.body.scrollHeight
  if (ele) {
    scrollHeight = ele.scrollHeight
    innerHeight = ele.clientHeight
  } else {
    scrollHeight = document.body.scrollHeight
    innerHeight = window.innerHeight || document.documentElement.clientHeight
  }
  return scrollHeight > innerHeight && scrollHeight > baseHeight
}
function getRootEle () {
  var webstayRootEleConfig = heatmapConfig.webstayRootEle
  var userEle = null
  if (Util.paramType(webstayRootEleConfig) === 'String') {
    var eleList = Util.selectorAllEleList(webstayRootEleConfig)
    if (eleList.length > 0) {
      userEle = eleList[0]
    }
  } else if (Util.paramType(webstayRootEleConfig) === 'Function') {
    userEle = webstayRootEleConfig.call(webstayRootEleConfig) || null
  } else if (typeof webstayRootEleConfig === 'object' && webstayRootEleConfig.nodeType === 1) {
    userEle = webstayRootEleConfig
  }
  if (userEle) {
    isRootEle = false
  } else {
    userEle = getChildEle()
  }
  if (userEle === document.body || !userEle) {
    userEle = document.body
  }
  return userEle
}
function setMouseLine (event) {
  var e = event || window.event
  var scrollY = document.documentElement.scrollTop || document.body.scrollTop
  var y = e.pageY || e.clientY + scrollY
  var num = y
  if (isRootEle === false) {
    var rootEle = getRootEle()
    num = y + rootEle.scrollTop
  }

  var lineNum = Math.floor(num / 10)

  var detail = webStayDatas.detail || []
  if (detail.length === 0) {
    return
  }
  var uv = webStayDatas.uv
  var value = 0
  if (lineNum < detail.length) {
    value = Math.ceil(detail[lineNum] / uv * 10000) / 100
  }
  var mouseLineEle = document.getElementById('ARKMOUSELINE')
  if (!mouseLineEle) {
    mouseLineEle = Util.addEleLable('div', 'ARK_PAGE_LINE_BOX', 'ARKMOUSELINE', document.body)
    mouseLineEle.innerHTML = webStayMouseLineTemp
  }
  document.getElementById('ARK_MOUSE_LINE_VALUE').innerHTML = value + '%的人浏览到了这里'
  mouseLineEle.style.top = y + 5 + 'px'
  mouseLineEle.style.display = 'block'
  if (!webStayLineStatus) {
    mouseLineEle.style.display = 'none'
  }

}
// var noDataStatus = false
var isDepth = false

function setline (data) {
  var rootEle = getRootEle()

  webStayDatas = data.datas
  if (showMapConfig.type === 'depth') {
    loadingStatus(false)
  }

  if (showMapConfig.type === 'depth') {
    if (data.code === 0 && (!webStayDatas || (webStayDatas.detail && webStayDatas.detail.length === 0))) {
      noDataStatus(0)
      return
    }
    // return
    if (data.code === 201 && isDepth) {
      noDataStatus(201)
      return
    }
    if (data.code === 100) {
      noDataStatus(100)
      return
    }
    if (data.code === 1302) {
      noDataStatus(1302)
      return
    }
  }

  var pageHeight = rootEle.scrollHeight
  var baseHeight = document.documentElement.scrollHeight
  var lineList = webStayDatas.detail
  var uv = webStayDatas.uv
  var max = 0
  // var notOverNumber = parseInt(pageHeight / 10) - lineList.length
  // lineList.push()
  for (var i = 0; i < parseInt(pageHeight / 10); i++) {
    // var value = Math.ceil(lineList[i] / uv * 100)
    var value = 0
    if (Util.paramType(lineList[i]) === 'Number') {
      value = Math.ceil(lineList[i] / uv * 10000) / 100
    }
    var lineEle = null
    max = Math.max(max, value)
    if (i * 10 > pageHeight) {
      break
    }
    var top = i * 10
    if (i * 10 < 600) {
      if (i > 0 && value !== 100 && lineList[i - 1] === uv) {
        lineEle = Util.addEleLable('div', 'ARK_PAGE_LINE_BOX', '', document.body)
        // var lineNum = i - 1 < 0 ? 0 : (i - 1)
        lineEle.style.top = top + 'px'
        if (!webStayLineStatus) {
          lineEle.style.display = 'none'
        }
        lineEle.innerHTML = webStayPageLineTemp.replace('{LINENUM}', 100)
      }
    } else if (i * 10 % 200 === 0) {
      lineEle = Util.addEleLable('div', 'ARK_PAGE_LINE_BOX', '', document.body)
      // var lineNum = i - 1 < 0 ? 0 : (i - 1)
      lineEle.style.top = top + 'px'
      if (!webStayLineStatus) {
        lineEle.style.display = 'none'
      }
      lineEle.innerHTML = webStayPageLineTemp.replace('{LINENUM}', value)
    }
    if (lineEle) {
      lineEle.setAttribute('ARK_TOP', top)
      if (top > baseHeight) {
        lineEle.style.display = 'none'
      }
    }
  }
  Util.removeEvent(document, 'mousemove', setMouseLine)
  Util.addEvent(document, 'mousemove', setMouseLine)
  if (isRootEle === false) {
    Util.removeEvent(rootEle, 'scroll', setEleScroll)
    Util.addEvent(rootEle, 'scroll', setEleScroll)
  }
}
function setEleScroll () {
  var rootEle = getRootEle()
  var scrollY = rootEle.scrollTop
  var lineEles = Util.selectorAllEleList('.ARK_PAGE_LINE_BOX')
  var baseHeight = document.documentElement.scrollHeight
  for (var i = 0; i < lineEles.length; i++) {
    if (lineEles[i].id !== 'ARKMOUSELINE') {
      var top = lineEles[i].getAttribute('ARK_TOP')
      var eleTop = top - scrollY
      if (eleTop > baseHeight) {
        lineEles[i].style.display = 'none'
      } else {
        lineEles[i].style.display = 'block'
      }
      lineEles[i].style.top = eleTop + 'px'
    } else {
      lineEles[i].style.display = 'none'
    }
  }
}
function removeLineEvent () {
  Util.removeEvent(document, 'mousemove', setMouseLine)
}

function removeLine () {
  var lineEleList = document.getElementsByClassName('ARK_PAGE_LINE_BOX')
  if (lineEleList.length > 0) {
    while (lineEleList.length > 0) {
      lineEleList[0].parentNode.removeChild(lineEleList[0])
    }
  }
}

function clearWebStay () {
  removeLine()
  removeLineEvent()
  if (showMapConfig.type === 'depth') {
    noDataStatus(200)
    loadingStatus(false)
  }
}
var webStayLineStatus = true

function toggleWebStay () {
  var webStayLineList = Util.selectorAllEleList('.ARK_PAGE_LINE_BOX')
  for (var i = 0; i < webStayLineList.length; i++) {
    if (getConstantStyle(webStayLineList[i], 'display') === 'block' ||
      getConstantStyle(webStayLineList[i], 'display') === '') {
      webStayLineStatus = false
      webStayLineList[i].style.display = 'none'
    } else {
      webStayLineStatus = true
      webStayLineList[i].style.display = 'block'
    }
  }
}

// function hiddenWebStay () {
//   webStayLineStatus = false
//   var webStayLineList = document.querySelectorAll('.ARK_PAGE_LINE_BOX')
//   for (var i = 0; i < webStayLineList.length; i++) {
//     if (getConstantStyle(webStayLineList[i], 'display') === 'block' ||
//             getConstantStyle(webStayLineList[i], 'display') === '') {
//       webStayLineList[i].style.display = 'none'
//     }
//   }
// }

function showWebStay () {
  webStayLineStatus = true
  var webStayLineList = Util.selectorAllEleList('.ARK_PAGE_LINE_BOX') // document.querySelectorAll('.ARK_PAGE_LINE_BOX')
  for (var i = 0; i < webStayLineList.length; i++) {
    webStayLineStatus = true
  }
}

function initWebStay () {
  if (showMapConfig.type === 'depth') {
    loadingStatus(true)
  }
  var param = backParam()
  if (heatmapConfig.uploadURL.charAt(heatmapConfig.uploadURL.length - 1) !== '/') {
    heatmapConfig.uploadURL += '/'
  }
  var option = {
    url: heatmapConfig.uploadURL + 'ark/sdk/heatmap/scrollreach/analysis',
    data: param,
    success: setline,
    error: function () {
      loadingStatus(false)
      if (showMapConfig.type === 'depth') {
        noDataStatus(402)
      }
    }
  }
  new LogAjax().post(option)
}

export { initWebStay, toggleWebStay, clearWebStay, showWebStay }
