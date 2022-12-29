import { eventAgent } from 'event-agent'
import { heatConfig, displayConfig } from '../store'
import { heatSwitch, emptySelected, setSelected, navOpen, toolDisplay, displayDepth } from '../view/nav'
import { displayLines } from '../view/webstay/index'
import { heatmapDisplay } from '../view/heatmap'
import { arkcontent, setArkcontent } from '../store/arkContent'
import { emptyElement, elementDisplay } from '../view/heatElement'
import { render, renderLinesData } from '../view'
import { globalWindow } from "../../../constant/index"

// 控制器列表
const controllerList = {

  // 刷新
  refresh () {
    arkcontent.useCache = false
    render()
    arkcontent.useCache = true
  },

  // 热图类型切换
  heatmapTab (e?, attrs?) {
    emptySelected()
    const type = attrs['heat-type']
    heatConfig.heatMapType = type
    setSelected()
    toolDisplay()

    heatmapDisplay()
    elementDisplay()
    displayLines()
    
    render()
  },

  // 热图显示
  heatmapSwitch () {
    heatConfig.heatMapShow = !heatConfig.heatMapShow
    heatSwitch()
    heatmapDisplay()
    elementDisplay()
  },

  // 深度线显示与隐藏
  displayDepth () {
    displayConfig.lineShow = !displayConfig.lineShow
    displayDepth()
    displayLines()
    renderLinesData()
  },

  // 展开收起
  navOpen () {
    heatConfig.isOpen = !heatConfig.isOpen
    navOpen()
  }
}


export default function() {
  document.getElementById('arkHeadmapBody').addEventListener('click', function(event) {
    eventAgent(event, (e, attrs) => {
      const controllerName = attrs['controller-name']
      controllerList[controllerName](e, attrs, event)
    })
  })
}