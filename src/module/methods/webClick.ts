
import sendData from '../sendData'
import fillData from '../fillData'
import { setUserClickAttrs, setWebClickAttrs } from '../../store/clickElement'
import { assign } from '../../utils/object'

function webClick(event) {

  const el = event.target || event.srcElement

  // 设置点击相关预制属性
  setUserClickAttrs(el)

  // 设置热图相关属性
  setWebClickAttrs(event)

  // 获取上报数据模块
  const res = fillData('$web_click')

  // 合并通用属性
  res.xcontext = assign({}, res.xcontext)

  sendData(res)
}

export default webClick