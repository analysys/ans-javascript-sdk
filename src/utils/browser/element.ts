
import { config } from "../../store/config"
import { isString, isArray } from "../type"


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
  if (isString(property)) {
    return getConstantStyle(element, property)
  } else if (isArray(property)) {
    props = {}
    for (q = 0, len1 = property.length; q < len1; q++) {
      prop = property[q]
      props[prop] = getConstantStyle(element, prop)
    }
    return props
  }
}

export function getElementClassName (el: Element) {
  let eleClassName = el.getAttribute('class') || ''
  if (eleClassName) {
    const eleClassList = eleClassName.split(' ')
    const eleClassArray = []
    for (let i = 0; i < eleClassList.length; i++) {
      if (eleClassList[i] !== '') {
        eleClassArray.push(eleClassList[i])
      }
    }
    eleClassName = '.' + eleClassArray.join('.')
    return eleClassName
  }
  return ''
}


export function getElementTargetUrl (el: Element) {
  let href = el.getAttribute('href')
  if (href && href.indexOf('javascript:') < 0) {
    try {
      href = decodeURIComponent(href)
    } catch (e) { }
    // if (config.isHybrid === true) {
    //   href = href.replace(/"/g, '\\"')
    // }
    return href
  }
  return ''
}

// 获取元素内容
export function getElementContent (el: Element) {
  let eleContent = ''
  if (el.tagName.toLowerCase() === 'input' && ['button', 'submit'].indexOf(el.type) > -1) {
    eleContent = el.value || ''
  } else if (el.tagName.toLowerCase() === 'img') {
    eleContent = el.getAttribute('alt') || el.getAttribute('title') || ''
  } else if (el.tagName.toLowerCase() === 'a') {
    eleContent = el.getAttribute('title') || ''
  }
  
  if (!eleContent) {
    const children = el.childNodes
    for (let i = 0; i < children.length; i++) {
      if (children[i].nodeType === 3) {
        eleContent += children[i].nodeValue
      }
    }
  }

  if (eleContent && isString(eleContent)) {
    eleContent = eleContent.replace(/[\r\n]/g, ' ').replace(/[ ]+/g, ' ')
  } else {
    eleContent = ''
  }

  return eleContent.trim()
}

// 获取元素路径
export function getElementPath (el) {
  let list = []
  let parent = el
  while (parent != null) {
    let index = 0
    if (parent.parentNode) {
      const clildrenEles = parent.parentNode.children
      if (clildrenEles) {
        for (let i = 0; i < clildrenEles.length; i++) {
          if (clildrenEles[i] === parent) {
            index = i
          }
        }
      }
    }
    let tagName = parent.tagName
    if (!tagName) {
      parent = parent.parentNode
      continue
    }
    tagName = tagName.toLowerCase()
    if (tagName === 'button') {
      list = []
    }
    const parentID = parent.id ? ('#' + parent.id) : ''
    const eleClassNameList = parent.className && isString(parent.className) ? parent.className.split(' ') : []

    if (eleClassNameList.length > 0) {
      let eleClassName = ''
      for (let y = 0; y < eleClassNameList.length; y++) {
        if (eleClassNameList[y] && eleClassNameList[y].indexOf('ARK') < 0) {
          eleClassName += '.' + eleClassNameList[y]
        }
      }
      list.push(tagName + parentID + eleClassName + '|' + index)
    } else {
      list.push(tagName + parentID + '|' + index)
    }

    parent = parent.parentNode
  }
  return list.join('<')
}


export function getElementScroll (ele) {
  let scrollTop = 0
  let scrollLeft = 0
  while (ele !== null && ele !== document.body) {
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


/**
 * [parserDom description]根据元素及其上层元素获取元素位置及显示/隐藏
 * @param  {[type]} ele [description] 元素Dom对象
 * @return {[type]} obj [description] 元素对应位置与显示/隐藏
 */
 export function getElementOffset (ele) {

  let realTop = 0
  let realLeft = 0
  let elemHidden = false
  let isFixed = false

  while (ele != null) {

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
 * document.querySelectorAll 兼容方法
 * @param {Sting} selectors 选择器 不包含伪类
 * @returns {Array} elements 符合条件的元素列表
 */

export function selectorAllEleList (selectors) {
  const eleList = []
  const eleTagName = selectors.split('.')[0]
  if (this.paramType(document.querySelectorAll) === 'Function' && selectors.indexOf('|') < 0) {
    try {
      return document.querySelectorAll(selectors)
    } catch (e) {
    }
  }
  let eleId = ''
  if (selectors.indexOf('#') > -1) {
    eleId = selectors.split('.')[0].split('#')[1]
    var ele = document.getElementById(eleId)
    if (ele) {
      eleList.push(ele)
    }
  } else if (selectors.indexOf('.') < 0) {
    return document.getElementsByTagName(eleTagName)
  } else if (selectors.indexOf('[') > -1 && selectors.indexOf(']') > -1) {
    const nodeList = document.getElementsByTagName('*')
    const selector = selectors.replace('[', '').replace(']', '')
    for (let y = 0; y < nodeList.length; y++) {
      const attr = nodeList[y].getAttribute(selector)
      if (this.paramType(attr) === 'String') {
        eleList.push(ele)
      }
    }
  } else {
    const domList = document.getElementsByTagName(eleTagName)
    for (let i = 0; i < domList.length; i++) {
      const dom = domList[i]
      const domClassNameList = this.paramType(dom.className) === 'String' ? dom.className.split(' ') : []
      if (domClassNameList.length > 0) {
        if ((eleTagName + '.' + domClassNameList.join('.')).indexOf(selectors) > -1) {
          eleList.push(dom)
        }
      }
    }
  }
  return eleList
}


export function addEleLable (eleName, className, id, parent) {
  const dom = document
  const createEle = dom.createElement(eleName)
  const domBody = parent || dom.body || dom.getElementsByTagName('body')[0]
  if (id) {
    createEle.id = id
  }
  if (className) {
    createEle.className = className
  }
  domBody.appendChild(createEle)
  return createEle
}


export function domParentList (ele) {
  const list = []
  let parent = ele
  while (parent != null) {
    let index = 0
    if (parent.parentNode) {
      const clildrenEles = parent.parentNode.children
      if (clildrenEles) {
        for (let i = 0; i < clildrenEles.length; i++) {
          if (clildrenEles[i] === parent) {
            index = i
          }
        }
      }
    }
    let tagName = parent.tagName
    if (!tagName) {
      parent = parent.parentNode
      continue
    }
    tagName = tagName.toLowerCase()
    const parentID = parent.id ? ('#' + parent.id) : ''
    const eleClassNameList = parent.className && isString(parent.className) ? parent.className.split(' ') : []

    if (eleClassNameList.length > 0) {
      let eleClassName = ''
      for (let y = 0; y < eleClassNameList.length; y++) {
        if (eleClassNameList[y] && eleClassNameList[y].indexOf('ARK') < 0) {
          eleClassName += '.' + eleClassNameList[y]
        }
      }
      list.push(tagName + parentID + eleClassName + '|' + index)
    } else {
      list.push(tagName + parentID + '|' + index)
    }

    parent = parent.parentNode
  }
  return list.join('<')
}