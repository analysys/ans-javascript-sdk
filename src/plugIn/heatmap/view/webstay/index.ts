import { isNumber } from "../../../../utils/type"
import { createElement } from '../../utils/index'
import { displayConfig, heatConfig } from '../../store/index'
import './index.scss'

const lineTpl = function (value) {
  return `<div class="ark-page-line-value">${value}%</div>`
}

const mouseLineTpl = `<div id="arkMouseLineValue" class="ark-page-line-value ark-page-mouse-line-value"></div>`

// 显示或隐藏深度线
export function displayLines () {
  const body = document.querySelector('body')
  const className = body.className
  if (displayConfig.lineShow || heatConfig.heatMapType === 'lines') {
    body.className = className.replace(/ ark-headmap-body-line-none/g, '')
  } else {
    if (className.indexOf('ark-headmap-body-line-none') === -1) {
      body.className = className + ' ark-headmap-body-line-none'
    }
  }
}

let linesData = null

/**
 * 渲染深度线
 */

 function setMouseLine (event) {
  const e = event || window.event
  const scrollY = document.documentElement.scrollTop || document.body.scrollTop
  const y = e.pageY || e.clientY + scrollY
  const num = y

  const lineNum = Math.floor(num / 10)

  const detail = linesData.detail || []
  if (detail.length === 0) {
    return
  }
  const uv = linesData.uv
  let value = 0
  if (lineNum < detail.length) {
    value = Math.ceil(detail[lineNum] / uv * 10000) / 100
  }
  let mouseLineEle = document.getElementById('arkMouseLine')
  if (!mouseLineEle) {
    mouseLineEle = createElement('div', {
      id: 'arkMouseLine',
      class: 'ark-page-line ark-mouse-lines',
      content: mouseLineTpl
    })
  }
  document.getElementById('arkMouseLineValue').innerHTML = value + '% 的人浏览到了这里'
  mouseLineEle.style.top = y + 5 + 'px'
}

export function renderLines (data) {
  linesData = data
  const uv = data.uv
  const pageHeight = document.documentElement.scrollHeight || document.body.scrollTop

  // 切割成n块
  const blockNum = Math.ceil(pageHeight / 10)

  for (let i = 0; i < blockNum; i++) {
    const value = data.detail[i] ? ((data.detail[i] / uv) * 100).toFixed(2) : 0
    const top = i * 10
    if (top > 500 && ((i % 20 === 0))) {
      createElement('div', {
        class: 'ark-page-line',
        content: lineTpl(value),
        style: {
          top: top + 'px'
        }
      })
    }
  }
  document.removeEventListener('mousemove', setMouseLine)
  document.addEventListener('mousemove', setMouseLine)
}