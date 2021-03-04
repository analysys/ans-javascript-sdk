/**
 * SDK 基础字段定义表
 * base.outer：上报日志基础结构定义
 * base.xcontext:上报报文找中xcontext下的共有字段定义
 * $开头的字段为各个事件特殊拥有字段
 */
export default {
  $user_click: {
    xcontext: [
      // '$page_width',
      // '$page_height',
      '$url_path',
      '$url',
      '$title',
      '$is_first_day',
      '$session_id',
      '$is_time_calibrated',
      '$device_type',
      '$element_type',
      '$element_path',
      '$element_content',
      '$element_id',
      '$element_name',
      '$element_target_url',
      '$element_class_name'
    ]
  }
}
