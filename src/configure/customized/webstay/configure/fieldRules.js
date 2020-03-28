/**
 * 字段填充、字段校验规则模板
 *
 * check：数据合法检测方法列表，每个方法返回bool值，以用户为准，同名覆盖
 *
 */
import { getViewPortWidth, getViewPortHeight, getScrollTop, getDuration, getDeviceType } from '../lib/getField.js'
export default {
  autoWebstay: {
    check: {
      value: ['isBoolean']
    }
  },
  xcontext: {
    $viewport_width: {
      valueType: 0,
      value: getViewPortWidth
    },
    $viewport_position: {
      valueType: 0,
      value: getScrollTop
    },
    $viewport_height: {
      valueType: 0,
      value: getViewPortHeight
    },
    $event_duration: {
      valueType: 0,
      value: getDuration
    },
    $device_type: {
      valueType: 0,
      value: getDeviceType
    }
  }
}
