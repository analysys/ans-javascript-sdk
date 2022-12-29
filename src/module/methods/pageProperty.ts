
import { successLog, errorLog } from '../printLog'
import { setPageProperty } from '../../store/pageProperty'
import { attrCheck } from '../../utils/verify'

/**
 * 注册页面自动采集自定义属性
 */
export function pageProperty(properties: object) {
  const methodName = '$pageProperty'
  const attrs = attrCheck(properties, methodName)
  setPageProperty(attrs)

  if (Object.keys(attrs).length) {
    successLog({
      fn: methodName,
      code: 20002,
      value: properties
    })
  }
}