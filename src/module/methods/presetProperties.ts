import fillData from '../fillData'
import { successLog } from '../printLog'
import ready from '../ready'

 /**
 * 获取预置属性
 * @returns object
 */

function getPresetProperties(fn) : object {

  
  // 获取上报数据模块
  const res = fillData('$getPresetProperties')
  delete res.xcontext.$is_login
  successLog({
    code: 20010,
    fn: 'getPresetProperties',
    value: res.xcontext
  })
  fn && fn(res.xcontext)
  return res.xcontext;
}

export default ready(getPresetProperties)