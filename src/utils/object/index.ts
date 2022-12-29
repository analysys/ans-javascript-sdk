
import { isObject } from "../type";


/**
 * 对象浅拷贝
 * 
 */

export function assign(target: Object, ...args: object[]): any {
  for (let i = 0; i < args.length; i++) {
    const item = args[i]
    if (isObject(item)) {
      for (const key in item) {
        target[key] = item[key]
      }
    }
  }
  return target
}