/**
 * 字段填充、字段校验规则模板
 *
 * check：数据合法检测方法列表，每个方法返回bool值，以用户为准，同名覆盖
 *
 */
import {
  getPageWidth,
  getPageHeight,
  getElementPath,
  getUrlPath,
  getElementType,
  getElementClickable,
  getEleContent,
  getDeviceType,
  getElementId,
  getElementName,
  getElementClassName,
  getElementTargetUrl
} from '../../heatmap/lib/getField.js'
export default {
  xcontext: {
    $page_width: {
      valueType: 0,
      value: getPageWidth
    },
    $page_height: {
      valueType: 0,
      value: getPageHeight
    },
    $element_path: {
      valueType: 0,
      value: getElementPath
    },
    $url_path: {
      valueType: 0,
      value: getUrlPath
    },
    $element_type: {
      valueType: 0,
      value: getElementType
    },
    $element_clickable: {
      valueType: 0,
      value: getElementClickable
    },
    $element_content: {
      valueType: 0,
      value: getEleContent
    },
    $device_type: {
      valueType: 0,
      value: getDeviceType
    },
    $element_id: {
      valueType: 0,
      value: getElementId
    },
    $element_name: {
      valueType: 0,
      value: getElementName
    },
    $element_target_url: {
      valueType: 0,
      value: getElementTargetUrl
    },
    $element_class_name: {
      valueType: 0,
      value: getElementClassName
    }
  }
}
