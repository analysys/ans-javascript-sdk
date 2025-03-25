import { successLog } from '../../printLog'
import { attrCheck } from '../../../utils/verify'
import { setSuperProperty } from '../../../store/core'

export function setAttrs (superProperty, methodName) {
  const attrs = attrCheck(superProperty, methodName)
  if (Object.keys(attrs).length) {
    setSuperProperty(attrs)
    successLog({
      fn: methodName,
      code: 20002,
      value: superProperty
    })
  }
}