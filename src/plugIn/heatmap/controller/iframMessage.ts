import { globalWindow } from "../../../constant/index"
import { arkcontent, setArkcontent  } from '../store/arkContent'
import { render, renderLinesData } from '../view'
import { displayLines } from '../view/webstay/index'
import { heatConfig, displayConfig } from '../store'
import { heatmapDisplay, setHeatMapConfig } from '../view/heatmap'
import { elementDisplay } from '../view/heatElement'


function chartDisplay () {
  heatmapDisplay()
  elementDisplay()
}

export default function () {
  
  // 给上层窗口发送消息
  window.parent.postMessage(JSON.stringify({
    code: 'ark/heatmap',
    appkey: globalWindow.AnalysysAgent.config.appkey
  }), '*')

  // 监听ifram发送过来的消息
  window.addEventListener('message', function(event) {
    const data = event.data
    console.log(data)
    const msgTypeMap = {
      'ark/heatmap': 'location',
      'ark/depth': 'lines',
      'ark/element': 'element',
      'ark/attention': '1'
    }
    const type = msgTypeMap[data.code]
    if (type) {
      setArkcontent(data.content)
      heatConfig.heatMapType = type
      heatConfig.heatMapShow = true

      const controlType = data.control.type

      if (data.control.type === 'refresh') {
        arkcontent.useCache = false
      }
      // 显示隐藏热图
      if (data.control.type === 'closeHeatMap') {
        heatConfig.heatMapShow = false
        chartDisplay()
      } else if (data.control.type === 'closeDepth' && displayConfig.lineShow) { // 关闭深度线
        displayConfig.lineShow = false
        displayLines()
      } else if (data.control.type === 'openDepth' && !displayConfig.lineShow) { // 打开深度线
        displayConfig.lineShow = true
        displayLines()
        chartDisplay()
        renderLinesData()
      } else if (controlType === 'heatmapOpacity') { //热图背景调整
        displayConfig.backgroundTransparent = data.control.value.opacity
        setHeatMapConfig()
      } else if(controlType === 'heatmapcolorRange') {
        displayConfig.min = data.control.value.min
        displayConfig.max = data.control.value.maxValue
        setHeatMapConfig()
      } else {
        chartDisplay()
        render()
      }
    }
  })
}