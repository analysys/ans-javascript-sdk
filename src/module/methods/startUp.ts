import sendData from '../sendData'
import fillData from '../fillData'
import {core, getSuperProperty, setCoreParam } from '../../store/core'
import { profileSetOnce } from './profile'
import { config } from '../../store/config'
import { eventAttribute } from '../../store/eventAttribute'
import { dateFormat } from '../../utils/date'
import { startUpTime, setStartUpTime } from '../../store/startUpTime'
import { assign } from '../../utils/object'

function startUp(...args: any[]) {

  // 获取上报数据模型
  const res = fillData('$startup')

 

  // 设置首次启动时间
  if (!core.ARKFRISTPROFILE) {
    setCoreParam('ARKFRISTPROFILE', dateFormat(new Date(res.xwhen), 'yyyy-MM-dd hh:mm:ss.SSS'))
    // 是否已发送首次用户属性，没有则发送
    if (config.autoProfile) {
      profileSetOnce()
    }
  }

  if (!startUpTime.STARTUP) {

    // 设置启动时间
    setStartUpTime()

    // 合并通用属性
    res.xcontext = assign({}, res.xcontext, getSuperProperty())

    // 记录启动时间
    eventAttribute.startup.xwhen = res.xwhen
    
    sendData(res)
  }
}

export default startUp