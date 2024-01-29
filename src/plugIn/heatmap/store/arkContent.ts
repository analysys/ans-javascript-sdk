import { getUrlParam } from '../../../utils/browser'
import { jsonToString } from '../../../utils/type/transform'

// uba传递过来的查询条件
export let arkcontent = null

export let arkcontentText = {
  crowds: '',
  filter: {
    conditions: [],
    relation: '且'
  }
}

// 设置参数
export function setArkcontent(content) {
  arkcontent = content
}

// 查询参数
export const queryParameters = function () {
  const query = {
    content: JSON.stringify(arkcontent),
    times: +new Date()
  }
  return jsonToString(query)
}

export function getUrlArkcontentText () {
  const contentText = unescape(getUrlParam('arkcontentText'))
  if (contentText) {
    try {
      arkcontentText = JSON.parse(contentText)
    } catch (e) {
      
    }
  }
}

// 获取url上面的arkcontent
export function getUrlArkcontent () {
  const content = unescape(getUrlParam('arkcontent'))
  
  if (content) {
    try {
      arkcontent = JSON.parse(content)
    } catch (e) {
      
    }
  }
  
}

