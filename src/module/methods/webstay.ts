
import sendData from '../sendData'
import fillData from '../fillData'
import { eventAttribute } from "../../store/eventAttribute"
import { assign } from '../../utils/object'

function webClick() {

  // 获取上报数据模块
  const res = fillData('$webstay')

  // 合并通用属性
  res.xcontext = assign({}, res.xcontext)
  eventAttribute.webstay.xwhen = res.xwhen

  sendData(res)
}

export default webClick