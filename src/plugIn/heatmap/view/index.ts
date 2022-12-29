import heatmap from './heatmap/index'
import nav from './nav/index'
import loading from './loading/index'
import tips from './tips/index'
import { createElement } from '../utils/index'
import { renderHeatmap } from './heatmap'
import { getHeatmapData, getLinesData } from '../store/heatmap'
import { heatConfig } from '../store'
import { arkcontent, getUrlArkcontentText } from '../store/arkContent'
import { renderElement } from './heatElement'
import { renderLines } from './webstay'

// 创建视图
export function createView () {

  createElement('div', {
    id: 'arkHeadmapBody',
    class: 'ark-headmap-body'
  })
  
  if (window.top === window.self) {
    getUrlArkcontentText()
    nav()
  }

  heatmap()
  loading()
  tips()

  render()
}

// 渲染深度线数据
export function renderLinesData () {
  getLinesData((res) => {
    renderLines(res.datas)
  })
}

// 渲染热图
export function render () {
  if (!arkcontent) {
    return
  }

  if (heatConfig.heatMapType === 'lines') {
    renderLinesData()
  } else {
    // 获取热图数据
    getHeatmapData((res) => {
      
      if (heatConfig.heatMapType === 'location') {
        // 渲染热图
        renderHeatmap(res.datas)
      }
      if (heatConfig.heatMapType === 'element') {
        renderElement(res.datas)
      }
    })
  }
}