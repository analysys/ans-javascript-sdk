/**
 * SDK 基础字段定义表
 * base.outer：上报日志基础结构定义
 * base.xcontext:上报报文找中xcontext下的共有字段定义
 * $开头的字段为各个事件特殊拥有字段
 */
export default {
  $web_click: {
    xcontext: [
      '$page_width',
      '$page_height',
      '$click_x',
      '$click_y',
      '$element_path',
      '$url_path',
      '$url',
      '$title',
      '$session_id',
      '$device_type',
      '$session_id',
      '$is_time_calibrated',
      '$element_x',
      '$element_y',
      '$element_type',
      '$element_clickable',
      '$element_content',
      '$is_first_day',
      '$element_id',
      '$element_name',
      '$element_target_url',
      '$element_class_name'
    ]
  }
}
