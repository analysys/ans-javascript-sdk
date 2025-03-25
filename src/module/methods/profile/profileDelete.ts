import ready from '../../ready'
import sendData from '../../sendData'
import fillData from '../../fillData'
import { commonAttrs } from '../../../constant/eventAttrs'

/**
 * 删除当前用户所有属性值
 */
function profileDelete (fn?: Function) {

  // 获取上报数据模块
  const res = fillData('$profile_delete')

  // 删除掉不相关属性
  commonAttrs.forEach(o => {
    if (res.xcontext[o]) {
      delete res.xcontext[o]
    }
  })

  sendData(res, fn)
}

export default ready(profileDelete)