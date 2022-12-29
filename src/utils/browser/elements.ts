
// 获取dom元素标签名称
export function getTagName (el: Element) {
  return el && el.tagName && el.tagName.toLowerCase() || ''
}

// 获取样式类名
export function getClassName (el: Element) {
  return el.className
}

// 返回dom元素父节点
export function getParentNode(el: Element) {
  return el.parentNode
}

// 获取所有兄弟节点（包括自己）
export function getbrotherNode (el: Element) {
  const parentNode = getParentNode(el)
  return parentNode ? parentNode.children : null
}

// 获取元素在同级中的下标
export function getEleIndex (el: Element) {
  const list = getbrotherNode(el)
  if (list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === el) {
        return i
      }
    }
  }
  return -1
}

// 获取元素所有样式
export function getEleStyles (el: Element) {
  return window.getComputedStyle(el, null)
}

// 遍历节点树
export function eleForEach (el: Element, fn: Function) {
  while (el) {
    const isBreak = fn && fn(el)

    // 返回break则推出循环
    if (isBreak === 'break') {
      break
    }
    el = el.parentNode
  }
}