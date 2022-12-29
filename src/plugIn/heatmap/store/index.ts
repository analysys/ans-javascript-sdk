

import { getUrlParam } from '../../../utils/browser'
import { getUrlArkcontent } from './arkContent'

export const heatConfig = {

  // 当下展示热图类型 Location Element lines
  heatMapType: 'location',

  // 热图是否显示
  heatMapShow: true,

  // 是否打开
  isOpen: true,

  // 帮助文档
  helpDoc: '',

  loading: false,

  nodata: false,

  max: 10
}

// 显示配置
export const displayConfig = {

  // 显示深度线
  lineShow: false,

  // 颜色范围
  colorRange: '',

  max: 100,

  min: 0,

  // 背景透明度
  backgroundTransparent: 0.3
}


// 初始化
export function storeInit () {
  getUrlArkcontent()
}