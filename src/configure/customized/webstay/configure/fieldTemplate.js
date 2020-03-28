/**
 * SDK 基础字段定义表
 * base.outer：上报日志基础结构定义
 * base.xcontext:上报报文找中xcontext下的共有字段定义
 * $开头的字段为各个事件特殊拥有字段
 */
export default {
  $webstay: {
    xcontext: [
      '$referrer',
      '$referrer_domain',
      '$title',
      '$url',
      '$viewport_width',
      '$viewport_position',
      '$viewport_height',
      '$event_duration',
      '$device_type',
      '$session_id',
      '$is_time_calibrated',
      '$is_first_day'
    ]
  }
}
