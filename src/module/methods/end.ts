import sendData from '../sendData'
import fillData from '../fillData'
import { getSuperProperty } from '../../store/core'
import { eventAttribute } from '../../store/eventAttribute'
import { assign } from '../../utils/object'

function end () {

  // 获取上报数据模块
  const res = fillData('$end')

  const attrs = {
    $duration: res.xwhen - eventAttribute.startup.xwhen
  }

  // 合并通用属性
  res.xcontext = assign({}, res.xcontext, getSuperProperty(), attrs)

  sendData(res)

}

export default end