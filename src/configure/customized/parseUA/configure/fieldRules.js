/**
 * 字段填充、字段校验规则模板
 *
 * check：数据合法检测方法列表，每个方法返回bool值，以用户为准，同名覆盖
 *
 */
import {
  os,
  os_version,
  model,
  brand,
  browser,
  browser_version,
  device_type
} from '../lib/UA'
export default {
  xcontext: {
    $os: {
      valueType: 1,
      value: os
    },
    $os_version: {
      valueType: 1,
      value: os_version
    },
    $model: {
      valueType: 1,
      value: model
    },
    $brand: {
      valueType: 1,
      value: brand
    },
    $browser: {
      valueType: 1,
      value: browser
    },
    $browser_version: {
      valueType: 1,
      value: browser_version
    }
  }
}
