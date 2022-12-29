import { selectorAllEleList } from '../../../utils/browser/element'
import { domParentList } from '../../../utils/browser/element'
import { isObject } from '../../../utils/type'

const rootNodeRE = /^(?:body|html)$/i

export function createElement (tag: string, attrs: {
  class?: string
  id?: string
  content?: string
  style?: object
} = {}, el?: Element) {
  const node = document.createElement(tag)
  if (attrs.id) {
    node.id = attrs.id
  }
  if (attrs.class) {
    node.className = attrs.class
  }

  if (attrs.style && isObject(attrs.style)) {
    for (const key in attrs.style) {
      node.style[key] = attrs.style[key]
    }
  }

  if (attrs.content) {
    node.innerHTML = attrs.content
  }
  const ele = el ? el : document.querySelector('body')
  ele.appendChild(node)
  return node
}

export function pathContrast (eventPath, elePath) {
  eventPath = eventPath.split('<body')[0]
  elePath = elePath.split('<body')[0]
  const eventPathArray = eventPath.split('<')
  const elePathArray = elePath.split('<')
  if (eventPathArray[0] === elePathArray[0]) {
    for (let i = 1; i < eventPathArray.length; i++) {
      if (eventPathArray[i].indexOf('|') > -1 && elePathArray[i].indexOf('|') > -1) {
        const eventPathIndex = eventPathArray[i].split('|')[1]
        const elePathIndex = elePathArray[i].split('|')[1]
        if (eventPathIndex !== elePathIndex) {
          return false
        }
      }

      if (eventPathArray[i].split('.')[0] !== elePathArray[i].split('.')[0]) {
        return false
      }
    }
    return true
  }
  return false
}

export function parseEvent (path) {
  const eleObj = parserDom(path)
  if (eleObj.length === 0) {
    return
  }
  let baseEle = eleObj[0].elePath
  try {
    if (baseEle.indexOf('#') > -1) {
      baseEle = '#' + baseEle.split('#')[1]
    }
    const eleList = selectorAllEleList(baseEle) // document.querySelectorAll(baseEle)
    for (let i = 0; i < eleList.length; i++) {
      const ele = eleList[i]
      if (rootNodeRE.test(ele.nodeName)) {
        return document.body
      }
      const elePath = domParentList(ele)
      const eleIndex = parserDom(elePath).index
      if (elePath === path || (pathContrast(elePath, path) === true && eleObj.index === eleIndex)) {
        return eleList[i]
      }
    }
  } catch (e) { }
  return null
}

// 根据元素路径获取dom
export function getPathEle (path) {
  const pathList = parserDom(path)
  if (pathList.length) {
    let eleStr = ''
    for (let i = pathList.length - 3; i >= 0; i--) {
      const item = pathList[i]
      if (item.elePath.indexOf('#') > -1) {
        eleStr += item.elePath
      } else {
        eleStr += `${item.elePath}:nth-child(${item.index - 0 + 1})`
      }
      if (i > 0) {
        eleStr += ' > '
      }
    }
    const ele = eleStr ? document.querySelector(eleStr) : null
    return ele
  }
}


/**
 * [parserDom description]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
 export function parserDom (path) {
  const eleList = []
  if (path.indexOf('<') < 0) {
    return [{
      elePath: path.split('|')[0],
      index: path.split('|')[1]
    }]
  }
  const pathObj = path.split('<')
  for (let i = 0; i < pathObj.length; i++) {
    const elelPath = pathObj[i].split('|')[0]
    const eleIndex = pathObj[i].split('|')[1]
    eleList.push({
      elePath: elelPath,
      index: eleIndex
    })
  }
  return eleList
}

/**
 * [parserDom description]根据元素及其上层元素获取元素位置及显示/隐藏
 * @param  {[type]} ele [description] 元素Dom对象
 * @return {[type]} obj [description] 元素对应位置与显示/隐藏
 */
 export function getEleOffset (ele) {

  let realTop = 0
  let realLeft = 0
  let elemHidden = false
  let isFixed = false

  while (ele) {

    if (ele.offsetTop === undefined) {
      ele = ele.parentNode
      continue
    }

    realTop += ele.offsetTop
    realLeft += ele.offsetLeft

    if (!elemHidden) {
      elemHidden = !!(eleCss(ele, 'display') === 'none' || eleCss(ele, 'width') === '0px' || eleCss(ele, 'height') === '0px')
    }

    if (eleCss(ele, 'position') === 'fixed') {
      isFixed = true
    }

    ele = ele.offsetParent
  }
  if (isFixed === true) {
    realTop += document.documentElement.scrollTop || document.body.scrollTop
    realLeft += document.documentElement.scrollLeft || document.body.scrollLeft
  }
  return {
    top: realTop,
    left: realLeft,
    hidden: elemHidden,
  }
}


/**
 * [eleCss description]根据元素对应css列表获取对应属性
 * @param  {[type]} element  [description]元素dom
 * @param  {[type]} property [description]css名称
 * @return {[type]} value [description]css名称对应值
 */
 export function eleCss (element, property) {
  let len1, prop, props, q
  if (!element) {
    return
  }
  if (typeof property === 'string') {
    return getConstantStyle(element, property)
  } else if (Array.isArray(property)) {
    props = {}
    for (q = 0, len1 = property.length; q < len1; q++) {
      prop = property[q]
      props[prop] = getConstantStyle(element, prop)
    }
    return props
  }
}

/**
 * [getConstantStyle description] 返回元素对应的样式值
 * @param  {[type]} el     [description] 元素
 * @param  {[type]} pelStr [description] 样式名称
 * @return {[type]}        [description]
 */
 export function getConstantStyle (el, pelStr) {
  const w = document.defaultView
  if (w && w.getComputedStyle) {
    return document.defaultView.getComputedStyle(el, null)[pelStr]
  } else {
    return el.currentStyle[pelStr]
  }
}

export function eleScroll (ele) {
  let scrollTop = 0
  let scrollLeft = 0
  while (ele != null && ele !== document.body) {
    if (ele.nodeType === 1) {
      scrollTop += ele.scrollTop
      scrollLeft += ele.scrollLeft
    }
    ele = ele.parentNode
  }
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  }
}