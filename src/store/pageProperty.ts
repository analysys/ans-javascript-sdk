
import { assign } from '../utils/object'

/**
 * 页面属性
 */

export let pageProperty: object = {}


/**
 * 设置页面属性
 * @param properties 
 */
export function setPageProperty (properties: object) {
  pageProperty = assign({}, pageProperty, properties)
}

/**
 * 获取页面属性
 * @returns 
 */
export function getPageProperty () {
  return pageProperty
}


/**
 * 删除页面属性
 */
export function delPageProperty () {
  pageProperty = {}
}