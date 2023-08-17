
const firstVisitTime = '$first_visit_time'

// 只读属性，无法被更改
export const readOnlyAttrs = ['$lib', '$lib_version', '$platform', firstVisitTime, '$debug', '$is_login']

// 公共预制属性，任何事件上报都会带上这些属性
export const publicAttrs: string[] = [
  '$lib',
  '$lib_version',
  '$platform',
  '$is_login',
  '$debug',
]

// 通用属性，行为事件都会上报
export const commonAttrs: string[] = [
  '$screen_width',
  '$screen_height',
  '$language',
  '$time_zone',
  '$session_id',
  '$is_time_calibrated',
  '$web_crawler',
  '$user_agent',
  '$title',
  '$url',
  '$is_first_day'
]

// element相关属性
export const elementAttrs: string[] = [
  '$element_type',
  '$element_path',
  '$element_content',
  '$element_id',
  '$element_name',
  '$element_target_url',
  '$element_class_name',
  '$device_type',
  '$url_path'
]

// utm相关属性
export const utmAttrs: string[] = [
  '$utm_campaign_id',
  '$utm_campaign',
  '$utm_medium',
  '$utm_source',
  '$utm_content',
  '$utm_term'
]

// 预制事件列表与事件属性
export const events = {
  $startup: [
    ...utmAttrs,
    ...commonAttrs,
    '$is_first_time' //首次访问，只在startUp
  ],
  $end: [
    ...commonAttrs,
    '$duration' //使用时长
  ],
  $pageview: [
    ...utmAttrs,
    ...commonAttrs,
    '$url_domain',
    '$referrer',
    '$referrer_domain',
    '$startup_time' // 此行下面5个只在 pageView 中有
  ],
  page_close: [
    ...commonAttrs,
    '$referrer',
    'pagestaytime'
  ],
  $user_click: [...elementAttrs, ...commonAttrs],
  $web_click: [
    ...commonAttrs,
    ...elementAttrs,
    '$page_width',
    '$page_height',
    '$click_x',
    '$click_y',
    '$element_x',
    '$element_y',
    '$element_clickable'
  ],
  $webstay: [
    ...commonAttrs,
    '$referrer',
    '$referrer_domain',
    '$viewport_width',
    '$viewport_position',
    '$viewport_height',
    '$event_duration',
    '$device_type'
  ],
  track: [...commonAttrs],
  $profile_set_once: [
    firstVisitTime,
    '$first_visit_language'
  ],
  $alias: [
    '$original_id'
  ],
  $getPresetProperties: [
    ...commonAttrs,
    firstVisitTime
  ],
}