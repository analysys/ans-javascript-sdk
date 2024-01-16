
import ajax from "../../../utils/requrst/ajax";
import { globalWindow } from "../../../constant/index"
import { queryParameters, arkcontent } from '../store/arkContent'
import { loadingDisply } from '../view/loading'
import { heatConfig } from "./index"
import { nodataDisply } from "../view/tips/index"
import { emptyElement } from '../view/heatElement'
import { emptyHeatmap } from '../view/heatmap'

const renderState = {
  location: false,
  element: false,
  lines: false
}

function loading (v) {
  heatConfig.loading = v
  loadingDisply()
}

function nodata(v, nodataText?) {
  heatConfig.nodata = v
  nodataDisply(nodataText)
}

const nodataTextMap = {
  0: '暂无数据<br/>小舟建议您选择其他时间范围或过滤条件重试',
  1: '查询失败，请联系管理员'
}

export let heatMapData = null

// 获取热图数据
export function getHeatmapData (fn?) {
  nodata(false)
  if (renderState[heatConfig.heatMapType] && arkcontent && arkcontent.useCache) {
    return
  }

  let url = 'ark/sdk/heatmap/click/analysis'

  if (heatConfig.heatMapType === 'element') {
    emptyElement()
    url = 'ark/sdk/heatmap/element/analysis'
  } else {
    emptyHeatmap()
  }

  loading(true)

  ajax({
    url: globalWindow.AnalysysAgent.config.uploadURL + url,
    method: 'post',
    data: queryParameters(),
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success ({data}) {
      renderState[heatConfig.heatMapType] = false
      if (data.code === 0) {
        const datas = data.datas
        if (datas && ((datas.length && heatConfig.heatMapType === 'location') || (datas.detail && datas.detail.length && heatConfig.heatMapType === 'element'))) {
          if (heatConfig.heatMapType === 'location') {
            heatMapData = datas
          }
          fn && fn(data)
          renderState[heatConfig.heatMapType] = true
        } else {
          nodata(true, nodataTextMap[0])
        }
      } else {
        nodata(true, data.msg || nodataTextMap[1])
      }
      loading(false)
    },
    error (e) {
      loading(false)
      nodata(true)
    }
  })
}

const isTypeLines = function(fn) {
  if (heatConfig.heatMapType === 'lines'){
    fn && fn()
  }
}

// 获取深度线
export function getLinesData (fn?) {
  nodata(false)
  if (renderState.lines && arkcontent && arkcontent.useCache) {
    return
  }
  isTypeLines(()=> {
    loading(true)
  })
  
  ajax({
    url: globalWindow.AnalysysAgent.config.uploadURL + 'ark/sdk/heatmap/scrollreach/analysis',
    method: 'post',
    data: queryParameters(),
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success ({data}) {
      renderState.lines = false
      if (data.code === 0) {
        if (data.datas && data.datas.detail && data.datas.detail.length) {
          fn && fn(data)
          renderState.lines = true
        } else {
          nodata(true, nodataTextMap[0])
        }
      } else {
        isTypeLines(()=> {
          nodata(true, data.msg || nodataTextMap[1])
        })
      }
      isTypeLines(()=> {
        loading(false)
      })
    },
    error () {
      isTypeLines(()=> {
        loading(false)
        nodata(true)
      })
      
    }
  })
}