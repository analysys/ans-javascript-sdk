import ready from '../../ready'
import sendData from '../../sendData'
import fillData from '../../fillData'
import { errorLog } from '../../printLog'
import { attrNameCheck } from '../../../utils/verify'
import { commonAttrs } from '../../../constant/eventAttrs'
import { assign } from '../../../utils/object'

/**
 * 删除当前用户单个属性值
 * @param propertyName 
 */
function profileUnset (propertyName: string, fn?: Function) {

  // 获取上报数据模块
  const res = fillData('$profile_unset')

  // 删除掉不相关属性
  commonAttrs.forEach(o => {
    if (res.xcontext[o]) {
      delete res.xcontext[o]
    }
  })

  if (attrNameCheck(propertyName)) {
    res.xcontext = assign({}, res.xcontext, {
      [propertyName]: ''
    })
  } else {
    errorLog({
      code: 600010,
      fn: 'profileUnset',
      key: propertyName
    })
  }

  sendData(res, fn)
}

export default ready(profileUnset)