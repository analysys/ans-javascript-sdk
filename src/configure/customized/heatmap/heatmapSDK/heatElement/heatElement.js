import Util from '../../../../../lib/common/index.js'
import LogAjax from '../../../../../lib/upload/ajax.js'
import { parseEvent, addObserver, eleIsHidden, offset } from './../common/index.js'
import { getElementContent } from '../../lib/elementContent.js'
import { heatmapConfig, showMapConfig, backParam } from '../common/config.js'
import { loadingStatus, noDataStatus, setElementMap } from '../head/index.js'
var elementMapDatas = {}

var colors = ['63,81,181', '33,150,243', '0,188,212', '87,201,92', '205,220,57', '255,235,59', '255,152,0', '255,87,34', '229,57,53', '183,28,28']

function thousands (num) {
  var str = num.toString()
  var reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
}

function setElementBox (ele, index, pv, pvPercent) {
  var eleOffsetParent = ele.offsetParent || document.body
  var mouseElePosition = offset(ele)
  var parentPostion = offset(eleOffsetParent)
  var y = mouseElePosition.top - parentPostion.top
  var x = mouseElePosition.left - parentPostion.left
  if (mouseElePosition.eleTable !== null) {
    parentPostion = offset(mouseElePosition.eleTable.offsetParent)
    x = mouseElePosition.left - parentPostion.left
    y = mouseElePosition.top - parentPostion.top
  }
  // var elePorint = ele
  var eleWidth = ele.offsetWidth + 10
  var eleHeight = ele.offsetHeight + 10
  // var elePosition = elementPostion(elePorint)
  // if (elePosition.hidden === true) {
  //   return
  // }
  var parent = ele.parentNode || document.body

  // var ele_parent_position = elementPostion(parent)


  // var top = elePorint.offsetTop - 5 // ele_position.y - ele_parent_position.y
  // var left = elePorint.offsetLeft - 5 // ele_position.x - ele_parent_position.x
  // if (pvPercent != 1) {
  var colorIndex = Math.ceil((pv / max) * 10) - 1
  // }
  if (eleWidth < 55) {
    eleWidth = 55
  }
  var color = colors[colorIndex]

  var eleDiv = document.createElement('div')
  // var ele_css = 'top: ' + top + 'px;left: ' + left + 'px;background-color:rgba(' + color + ',.8);width:' + ele_width + 'px;height:' + ele_height + 'px;line-height:' + ele_height + 'px;text-align:center;' //'
  eleDiv.style.top = y - 5 + 'px'
  eleDiv.style.left = x - 5 + 'px'
  eleDiv.style.backgroundColor = 'rgba(' + color + ',.8)'
  eleDiv.style.width = eleWidth + 'px'
  eleDiv.style.height = eleHeight + 'px'
  eleDiv.style.lineHeight = eleHeight + 'px'
  eleDiv.style.textAlign = 'center'
  eleDiv.id = 'ARK' + index
  var classList = 'ARK_HEAT_ELEMENT_POINT'
  if (index > 19) {
    classList += ' ARK_OPACITY'
  }
  eleDiv.className = classList
  var pageHeight = document.body.offsetHeight
  var status = ''
  var topPorint = 'top:' + (eleHeight + 6) + 'px;'
  if (pageHeight < (eleWidth + y + 78)) {
    status = 'up'
    topPorint = 'top: -82px;'
  }
  var chlidHtml = '<span>' + pvPercent + `%</span>
                <div class="ARK_HEAT_ELEMENT_POINT_MSG ` + status + '" style="' + topPorint + `">
                    <div class="ARROWLIST"></div>
                    <table>
                        <thead>
                            <td>点击数</td>
                            <td>点击占比</td>
                        </thead>
                        <tbody>
                            <tr>
                                <td>` + thousands(pv) + `</td>
                                <td>` + pvPercent + `%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
    `
  eleDiv.innerHTML = chlidHtml
  eleDiv.onclick = function (event) {
    window.event ? window.event.cancelBubble = true : event.stopPropagation()
    event.preventDefault()
    return false
  }
  parent.appendChild(eleDiv)

  var hoverCallback = (function () {
    return function () {
      var top = this.offsetTop - 5 // ele_position.y - ele_parent_position.y
      var left = this.offsetLeft - 5 // ele_position.x - ele_parent_position.x
      eleDiv.style.top = top
      eleDiv.style.left = left
      // ele_div.style = 'top: ' + top + 'px;left: ' + left + 'px;background-color:rgba(' + color + ',.7);width:' + ele_width + 'px;height:' + ele_height + 'px;line-height:' + ele_height + 'px;text-align:center;'
    }
  })()
  Util.addEvent(ele, 'mouseover', hoverCallback)
}
function removeElementBox (ele, index) {
  var parent = ele.parentNode || document.body
  var boxEle = document.getElementById('ARK' + index)
  if (boxEle) {
    parent.removeChild(boxEle)
  }
}
function buildElemetMap (ele, elementObj, index) {
  var uv = elementObj.uv
  var pv = elementObj.clickNum
  var pvPercent = Math.round(elementObj.clickNumPercent * 10000) / 100
  var eleContext = getElementContent(ele)
  elementObj.clickNumPercent = pvPercent
  elementObj.content = (eleContext || '-')

  if (eleIsHidden(ele) === false) {
    setElementBox(ele, index, pv, pvPercent)
  } else {
    addObserver(ele, function () { setElementBox(ele, index, pv, pvPercent) }, function () {
      removeElementBox(ele, index)
    })
  }

  return `<tr>
                <td title="` + eleContext + '" ' + (eleContext ? '' : 'style="color:#BBBBBB"') + '>' + (eleContext || '-') + `</td>
                <td>` + elementObj.type + `</td>
                <td>` + uv + `</td>
                <td>` + thousands(pv) + `</td>
                <td>` + pvPercent + `%</td>
            </tr>`
}
var max = 0

function setElmentMap (data) {
  if (showMapConfig.type !== 'element') return
  loadingStatus(false)
  elementMapDatas = data.datas
  if (data.code === 0 && (!elementMapDatas || (elementMapDatas.detail && elementMapDatas.detail.length === 0))) {
    noDataStatus(0)
    setElementMap()
    return
  }
  // return
  if (data.code === 201) {
    noDataStatus(201)
    setElementMap()
    return
  }
  if (data.code === 100) {
    noDataStatus(100)
    setElementMap()
    return
  }
  var elementList = elementMapDatas.detail
  // var uv = data.datas.uv

  if (!elementList || elementList.length === 0) {
    noDataStatus(0)
    setElementMap()
    return
  }

  var maxList = 0
  var eleList = []
  var eleMsg = []
  max = 0
  for (var i = 0; i < elementList.length; i++) {
    var path = elementList[i].path
    if (!path) {
      continue
    }
    var elePorint = parseEvent(path)
    if (elePorint) {
      if (eleList.indexOf(elePorint) > -1) {
        eleMsg[eleList.indexOf(elePorint)].clickNum += Number(elementList[i].clickNum) || 0
        eleMsg[eleList.indexOf(elePorint)].uv += Number(elementList[i].uv) || 0
        eleMsg[eleList.indexOf(elePorint)].clickNumPercent += Number(elementList[i].pvPercent) || 0
        eleMsg[eleList.indexOf(elePorint)].uvPercent += Number(elementList[i].uvPercent) || 0
        if (eleMsg[eleList.indexOf(elePorint)].clickNum > max) {
          max = eleMsg[eleList.indexOf(elePorint)].clickNum
        }
      } else {
        eleList.push(elePorint)
        eleMsg.push({
          clickNum: Number(elementList[i].clickNum) || 0,
          uv: Number(elementList[i].uv) || 0,
          clickNumPercent: Number(elementList[i].clickNumPercent) || 0,
          uvPercent: Number(elementList[i].uvPercent) || 0,
          type: elementList[i].type
        })
      }
      if (elementList[i].clickNum > max) {
        max = elementList[i].clickNum
      }
    }
  }

  if (eleList.length > 0) {
    eleList.sort(function (a, b) {
      return a.clickNum - b.clickNum
    })
  } else {
    noDataStatus(0)
    setElementMap()
    return
  }
  var eleMessageList = []
  var elementListHtml = ''
  for (var index = 0; index < eleList.length; index++) {
    var listHtml = buildElemetMap(eleList[index], eleMsg[index], maxList)
    if (!listHtml) {
      continue
    }
    if (maxList < 20) {
      elementListHtml += listHtml
      eleMessageList.push(eleMsg[index])
    }
    maxList++
  }
  setElementMap(elementListHtml)
  if (eleMessageList.length > 0) {
    window.parent.postMessage(JSON.stringify({
      code: 'ark/elementList',
      elementList: eleMessageList
    }), '*')
  }
}

function showElementMap () {
  loadingStatus(true)
  var param = backParam()
  if (heatmapConfig.uploadURL.charAt(heatmapConfig.uploadURL.length - 1) !== '/') {
    heatmapConfig.uploadURL += '/'
  }
  var option = {
    url: heatmapConfig.uploadURL + 'ark/sdk/heatmap/element/analysis',
    data: param,
    success: setElmentMap,
    error: function () {
      noDataStatus(402)
    }
  }
  new LogAjax().post(option)
}

function getClassNames (classStr, tagName) {
  if (document.getElementsByClassName) {
    return document.getElementsByClassName(classStr)
  } else {
    var nodes = document.getElementsByTagName(tagName)
    var ret = []
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i] && nodes[i].className.indexOf(classStr) > -1) {
        ret.push(nodes[i])
      }
    }
    return ret
  }
}

function delElementMap () {
  var elementEleList = getClassNames('ARK_HEAT_ELEMENT_POINT', 'div')
  if (elementEleList.length > 0) {
    while (elementEleList.length > 0) {
      elementEleList[0].parentNode.removeChild(elementEleList[0])
    }
  }
  noDataStatus(200)
  loadingStatus(false)
}

export { showElementMap, delElementMap }
