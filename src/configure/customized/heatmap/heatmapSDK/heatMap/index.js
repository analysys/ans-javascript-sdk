import Util from '../../../../../lib/common/index.js'
import LogAjax from '../../../../../lib/upload/ajax.js'
import plugInHeatmap from '../lib/heatmap.js'
import ColorRangeMaker from '../lib/colorRange.js'
import { heatmapConfig, showMapConfig, backParam } from '../common/config.js'
import {
  loadingStatus,
  noDataStatus,
  headBtnMap
} from '../head/index.js'
import { elementPostion, parseEvent, getConstantStyle, eleScroll } from '../common/index.js'

var heat = null
var radius = 15
var diffRadius = 5
var plugInHeatmapConfig = {
  radius: radius,
  // opacity: .65,
  blur: 1,
  gradient: {
    0: '#3023ae',
    0.2: '#53a0fd',
    0.41: '#b4ec51',
    0.81: '#ffa301',
    1: '#fb0000'
  },
  backgroundColor: 'rgba(0,0,0,0.7)',
  maxOpacity: 0.65,
  minOpacity: 0.2
}

function _heat (config) {
  config = config || {}
  this.pointsList = []

  var ele = Util.addEleLable('div', 'ARK_HEATMAP_AREA', 'ARK_HEATMAP_AREA')
  ele.style.width = document.documentElement.scrollWidth + 'px'
  ele.style.height = document.documentElement.scrollHeight + 'px'

  var childEle = Util.addEleLable('div', 'ARK_HEATMAP_HEAT', '', ele)

  this.config = Util.objMerge({
    container: childEle
  }, config)
  this.heatObj = plugInHeatmap.create(this.config)
  return this
}

_heat.prototype.setData = function (pointsList) {
  this.pointsList = pointsList
  this.heatObj.setData(pointsList)
}

_heat.prototype.refresh = function () {
  this.heatObj.repaint()
}
_heat.prototype.configure = function (config) {
  this.heatObj.configure(config)
}
_heat.prototype.clear = function () {
  this.pointsList = []
}

function getPoints () {
  loadingStatus(true)
  var success = function (data) {
    if (!data || showMapConfig.type !== 'heatmap') return
    var list = data.datas
    var code = data.code
    if (!list || list.length === 0) {
      noDataStatus(0)
      return
    }
    if (code === 201) {
      noDataStatus(201)
      return
    }
    if (code === 100) {
      noDataStatus(100)
      return
    }
    noDataStatus(200)
    var max = 0

    var len = list.length
    var points = []
    for (var i = 0; i < len; i++) {
      var eleX = list[i].$element_x
      var eleY = list[i].$element_y
      var elePath = list[i].$element_path

      if (Util.paramType(elePath) !== 'String' || Util.paramType(eleX) !== 'Number' || Util.paramType(eleY) !== 'Number') {
        continue
      }

      var elePorint = parseEvent(elePath)
      if (!elePorint) {
        continue
      }
      var eleXPostion = elementPostion(elePorint)
      if (eleXPostion.hidden === true) {
        continue
      }
      var eleScrollPostion = eleScroll(elePorint)
      var elePostion = {
        left: eleXPostion.left - eleScrollPostion.scrollLeft,
        top: eleXPostion.top - eleScrollPostion.scrollTop
      }
      var point = {
        x: elePostion.left + eleX,
        y: elePostion.top + eleY,
        value: 1
      }
      if (eleX < 0 || eleX > elePostion.left + elePorint.offsetWidth) {
        point.x = elePostion.left + elePorint.offsetWidth / 2
      }
      if (eleY < 0 || eleY > elePostion.top + elePorint.offsetHeight) {
        point.y = elePostion.top + elePorint.offsetHeight / 2
      }

      point.x = parseInt(point.x)
      point.y = parseInt(point.y)
      points.push(point)
    }
    for (var index = 0; index < points.length; index++) {
      for (var z = 0; z < points.length; z++) {
        if (z !== index && radiusPoint(points[index], points[z])) {
          points[index].value += 1
        }
        max = Math.max(points[index].value, max)
      }
    }
    if (max < showMapConfig.max) {
      max = showMapConfig.max
    }
    showMapConfig.max = max
    var pointsObj = {
      max: max,
      min: 0,
      data: points
    }
    heat.setData(pointsObj)
    if (rightDataMax !== 0) {
      heat.heatObj.setDataMax(showMapConfig.max * rightDataMax / 100)
    }
  }
  var param = backParam()
  if (heatmapConfig.uploadURL.charAt(heatmapConfig.uploadURL.length - 1) !== '/') {
    heatmapConfig.uploadURL += '/'
  }
  var url = heatmapConfig.uploadURL + 'ark/sdk/heatmap/click/analysis'
  var option = {
    url: url,
    data: param,
    success: success,
    error: function () {
      loadingStatus(false)
      noDataStatus(402)
    }
  }
  new LogAjax().post(option)
}

function radiusPoint (p1, p2) {
  return (p1.x - radius - diffRadius <= p2.x && p2.x <= p1.x + radius - diffRadius) &&
    (p1.y - radius - diffRadius <= p2.y && p2.y <= p1.y + radius - diffRadius)
}

function resetGradient (max, min) {
  var colorRange = new ColorRangeMaker({
    color: [
      [48, 35, 174],
      [83, 160, 253],
      [180, 236, 81],
      [255, 163, 1],
      [251, 0, 0]
    ],
    value: [0, 100]
  })
  var rangeArea = [0, 0.2, 0.41, 0.81, 1]
  var color = {}
  var DValue = max - min
  for (var i = 0; i < rangeArea.length; i++) {
    var colorList = colorRange.make(min + rangeArea[i] * DValue)
    var rgb = 'rgb(' + colorList.join(',') + ')'
    color[rangeArea[i]] = rgb
  }
  return color
}

function setColorRange () {
  var colorList = resetGradient(changeMaxNum, changeMinNum)
  heat.heatObj.configure({
    gradient: colorList
  })
}
var rightDataMax = 0
var changeMaxNum = 100
var changeMinNum = 0

function rightColorRange (e) {
  e = e || window.event
  e.stopPropagation()
  // e.preventDefault();
  // e.stopPropagation();
  var clickX = (e || window.event).clientX
  var leftX = parseInt(getConstantStyle(headBtnMap.leftBtn, 'left'))
  var rightX = parseInt(getConstantStyle(headBtnMap.rightBtn, 'left'))
  var rangeWidth = headBtnMap.rangeEle.offsetWidth
  var leftWidth = headBtnMap.leftBtn.offsetWidth
  var rightWidth = headBtnMap.rightBtn.offsetWidth
  var minRightX = leftX + leftWidth
  var rangMax = 100

  function moveRightBtn (e) {
    e.preventDefault()
    e.stopPropagation()

    var moveX = (e || window.event).clientX
    var right = rightX + moveX - clickX
    var positionX = Math.max(minRightX, Math.min(right, rangeWidth - rightWidth))
    headBtnMap.rightBtn.style.left = positionX + 'px'
    headBtnMap.rightBg.style.width = rangeWidth - positionX + 'px'
    headBtnMap.rangeBg.style.width = positionX + 'px'
    rangMax = parseInt(positionX / (rangeWidth - rightWidth) * 100) / 100 * 100
  }

  function upRightBtn (e) {
    e = e || window.event
    e.stopPropagation()
    Util.removeEvent(document, 'mousemove', moveRightBtn)
    Util.removeEvent(document, 'mouseup', upRightBtn)
    // setColorRange()
    //
    rightDataMax = (rangMax - changeMinNum)

    heat.heatObj.setDataMax(showMapConfig.max * rightDataMax / 100)
    headBtnMap.rightBtn.releaseCapture && headBtnMap.rightBtn.releaseCapture()

    return false
  }

  Util.addEvent(document, 'mousemove', moveRightBtn)
  Util.addEvent(document, 'mouseup', upRightBtn)

  this.setCapture && this.setCapture()
  return false
}

function leftColorRange (e) {
  e = e || window.event
  e.stopPropagation()
  // e.preventDefault();
  // e.stopPropagation();
  var clickX = (e || window.event).clientX
  var leftX = parseInt(getConstantStyle(headBtnMap.leftBtn, 'left'))
  var rightX = parseInt(getConstantStyle(headBtnMap.rightBtn, 'left'))
  var rangeWidth = headBtnMap.rangeEle.offsetWidth
  var leftWidth = headBtnMap.leftBtn.offsetWidth
  var rightWidth = headBtnMap.rightBtn.offsetWidth
  var maxLeftX = Math.min(rightX, rangeWidth - rightWidth)

  function moveLeftBtn (e) {
    e.preventDefault()
    e.stopPropagation()

    var moveX = (e || window.event).clientX
    var left = leftX ? (leftX + moveX - clickX) : (moveX - clickX)
    var positionX = Math.max(0, Math.min(maxLeftX - rightWidth, left + leftWidth))
    headBtnMap.leftBtn.style.left = positionX + 'px'
    headBtnMap.leftBg.style.width = positionX + 'px'
    if (changeMaxNum === 0) {
      changeMaxNum = 100
    }
    changeMinNum = parseInt(positionX / (rangeWidth - rightWidth) * 100) / 100 * 100
  }

  function upLeftBtn (e) {
    e = e || window.event
    e.stopPropagation()
    Util.removeEvent(document, 'mousemove', moveLeftBtn)
    Util.removeEvent(document, 'mouseup', upLeftBtn)
    headBtnMap.leftBtn.releaseCapture && headBtnMap.leftBtn.releaseCapture()
    setColorRange()
  }

  Util.addEvent(document, 'mousemove', moveLeftBtn)
  Util.addEvent(document, 'mouseup', upLeftBtn)

  this.setCapture && this.setCapture()
  return false
}

var opacityNum = 0.3

function setHeatmapOpacity (num) {
  if (Util.paramType(num) === 'Number') {
    opacityNum = num
  }
  if (opacityNum > 1) {
    opacityNum = opacityNum / 100
  }
  var opacity = (1 - opacityNum)
  var backgroundColor = opacity !== 0 ? 'rgba(0,0,0,' + opacity + ')' : 'transparent'
  heat.heatObj.configure({
    backgroundColor: backgroundColor
  })
}

function bgColorRange (e) {
  e = e || window.event
  e.stopPropagation()
  var clickX = (e || window.event).clientX
  var sliderBtnX = parseInt(getConstantStyle(headBtnMap.sliderBtn, 'left'))
  var rangeWidth = headBtnMap.opacityBtn.offsetWidth
  var sliderWidth = headBtnMap.sliderBtn.offsetWidth
  var numWidth = headBtnMap.numEle.offsetWidth
  var minLeftX = 0

  function moveBtn (e) {
    e.preventDefault()
    e.stopPropagation()
    var moveX = (e || window.event).clientX
    var right = sliderBtnX + moveX - clickX
    var positionX = Math.max(minLeftX, Math.min(right, rangeWidth - sliderWidth))
    headBtnMap.sliderBtn.style.left = positionX + 'px'
    headBtnMap.sliderBg.style.width = rangeWidth - positionX + 'px'
    headBtnMap.numEle.style.left = positionX - numWidth / 2 + sliderWidth / 2 + 'px'
    opacityNum = parseInt(positionX / (rangeWidth - sliderWidth) * 100) / 100
    headBtnMap.numEle.innerHTML = parseInt(opacityNum * 100) + '%'
  }

  function upBtn (e) {
    e = e || window.event
    e.stopPropagation()
    Util.removeEvent(document, 'mousemove', moveBtn)
    Util.removeEvent(document, 'mouseup', upBtn)
    headBtnMap.sliderBtn.releaseCapture && headBtnMap.sliderBtn.releaseCapture()
    setHeatmapOpacity()
  }

  Util.addEvent(document, 'mousemove', moveBtn)
  Util.addEvent(document, 'mouseup', upBtn)

  this.setCapture && this.setCapture()
  return false
}

function createColorRange () {
  Util.addEvent(headBtnMap.leftBtn, 'mousedown', leftColorRange)
  Util.addEvent(headBtnMap.rightBtn, 'mousedown', rightColorRange)
  Util.addEvent(headBtnMap.sliderBtn, 'mousedown', bgColorRange)
  // Util.addEvent(leftBtn, 'mouseup', upLeftBtn)

  // Util.addEvent(rightBtn, 'mousemove', moveLeftBtn)
  // Util.addEvent(rightBtn, 'mouseup', upLeftBtn)

  // Util.addEvent(opacityBtn, 'mousemove', moveLeftBtn)
  // Util.addEvent(opacityBtn, 'mouseup', upLeftBtn)
}

function heatmap () {
  heat = new _heat(plugInHeatmapConfig)
  if (!Util.isEmptyObject(showMapConfig.content)) {
    getPoints()
  } else {
    noDataStatus(400)
  }
}

function clearHeatmap () {
  var dom = document.getElementById('ARK_HEATMAP_AREA')
  if (dom) {
    dom.parentNode.removeChild(dom)
    heat.clear()
    heat = null
  }
  noDataStatus(200)
  loadingStatus(false)
}

function changeColorRange (dataObj) {
  changeMinNum = Util.paramType(dataObj.min) !== 'Number' ? changeMinNum : dataObj.min
  setColorRange()
  var maxValue = Util.paramType(dataObj.max) !== 'Number' ? rightDataMax : dataObj.max
  if (maxValue) {
    heat.heatObj.setDataMax(showMapConfig.max * maxValue / 100)
  }
}
export {
  heatmap,
  clearHeatmap,
  createColorRange,
  changeColorRange,
  setHeatmapOpacity
}
