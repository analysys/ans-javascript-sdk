import { $lib, $lib_version, globalWindow } from "../../constant"
import { config } from "../../store/config"
import { hybrid } from "../../store/hybrid"
import { core, getId, getSessionId } from "../../store/core"
import { getNow, timeDiff } from '../../store/time'
import { isSpider } from '../../utils/path'
import { pathParams } from '../../store/pathParams'
import { clientTimeZone } from '../../utils/date'
import { isString, isNumber } from "../../utils/type"
import { getUrlDomain } from '../../utils/path'
import { valToString } from "../../utils/type/transform"
import { dateFormat } from "../../utils/date"
import { userClickAttrs, webClickAttrs } from "../../store/clickElement"
import { eventAttribute } from "../../store/eventAttribute"
import { getDeviceType } from "../../utils/browser"
import { startUpTime } from "../../store/startUpTime"

/**
 * 获取属性值
 */

export default {
  xwho () : string {
    return hybrid.userId || getId()
  },
  xwhen () : number {
    return getNow()
  },
  xwhat (xwhat : string) : string {
    return xwhat
  },
  $lib () : string {
    return $lib
  },
  $lib_version () : string {
    return $lib_version
  },
  $platform() : string {
    return $lib
  },
  $debug () : number {
    return config.debugMode
  },
  $is_login () : boolean {
    return !!core.ARK_LOGINID
  },

  $session_id () {
    return getSessionId()
  },

  $screen_width (): number {
    return globalWindow.screen.width || 0
  },
  $screen_height (): number {
    return globalWindow.screen.height || 0
  },
  
  $language (): string {
    return (globalWindow.navigator.language || globalWindow.navigator.browserLanguage).toLowerCase()
  },

  $user_agent (): string {
    return globalWindow.navigator.userAgent.replace(/"/g, '\\"')
  },
  
  $time_zone () {
    return 'GMT' + clientTimeZone()
  },
  $startup_time () : string {
    return startUpTime.STARTUPTIME
  },

   // 是否安装后首次访问
  $is_first_time () {
    return !core.FRISTDAY
  },

  // 是否安装后首日访问
  $is_first_day () {
    if (!core.FRISTDAY) {
      return true
    }
    if (isString(core.FRISTDAY)) {
      return dateFormat(new Date(getNow()), 'yyyyMMdd') === core.FRISTDAY
    }

    if (isNumber(core.FRISTDAY)) {
      return dateFormat(new Date(getNow()), 'yyyyMMdd') === dateFormat(new Date(core.FRISTDAY), 'yyyyMMdd')
    }

    return false
  },
  $first_visit_time () {
    return core.ARKFRISTPROFILE
  },
  $first_visit_language () {
    return (navigator.language || navigator.browserLanguage).toLowerCase()
  },
  $original_id () {
    return core.ARK_TRACKID || core.ARK_ID
  },

  // 是否校准了时间
  $is_time_calibrated (): boolean {
    return config.allowTimeCheck && timeDiff ? true : false
  },

  $referrer (): string {
    return eventAttribute.pageview.prevPath
  },
  $referrer_domain (): string {
    return getUrlDomain(eventAttribute.pageview.prevPath)
  },
  $title (): string {
    return document.title
  },
  $url(): string {
    return eventAttribute.pageview.path
  },

  // 页面URL-去参的页面URL
  $url_path(): string {
    return getUrlDomain(eventAttribute.pageview.path)
  },

  // 页面URL-去参的页面URL
  $url_domain(): string {
    return getUrlDomain(eventAttribute.pageview.path)
  },

  $utm_campaign_id (): string {
    return pathParams.utm_campaign_id
  },
  $utm_source (): string {
    return pathParams.utm_source
  },
  $utm_medium (): string {
    return pathParams.utm_medium
  },
  $utm_term (): string {
    return pathParams.utm_term
  },
  $utm_content (): string {
    return pathParams.utm_content
  },
  $utm_campaign (): string {
    return pathParams.utm_campaign
  },


  // 点击元素相关
  $element_content (): string {
    return valToString(userClickAttrs.element_content)
  },
  $element_id () : string {
    return valToString(userClickAttrs.element_id)
  },
  $element_type () : string {
    return valToString(userClickAttrs.element_type)
  },

  $element_name () : string {
    return valToString(userClickAttrs.element_name)
  },
  $element_class_name () : string {
    return valToString(userClickAttrs.element_class_name)
  },
  $element_target_url () : string {
    return valToString(userClickAttrs.element_target_url)
  },
  $element_path () : string {
    return valToString(userClickAttrs.element_path)
  },

  $page_width (): number {
    return document.documentElement.scrollWidth
  },
  $page_height (): number {
    return document.documentElement.scrollHeight
  },
  $click_x (): number {
    return webClickAttrs.click_x
  },
  $click_y (): number {
    return webClickAttrs.click_y
  },
  $element_x (): number {
    return webClickAttrs.element_x
  },
  $element_y (): number {
    return webClickAttrs.element_y
  },
  $element_clickable (): number {
    return webClickAttrs.element_clickable
  },

  $viewport_width (): number {
    return document.documentElement.clientWidth || document.body.clientWidth
  },
  $viewport_height (): number {
    return document.documentElement.clientHeight || document.body.clientHeight
  },
  $viewport_position () : number {
    return document.documentElement.scrollTop || document.body.scrollTop
  },
  $event_duration(): number {
    const duration = +new Date() - (eventAttribute.webstay.xwhen || eventAttribute.pageview.xwhen)
    if (duration > config.webstayDuration) {
      return config.webstayDuration
    }
    return duration
  },

  // 设备类型
  $device_type () : string {
    return getDeviceType()
  },

  // 是否爬虫
  $web_crawler () : boolean {
    return isSpider()
  }
}






