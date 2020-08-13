import Util from '../../../../lib/common/index.js'

function getElementContent (ele) {
  var eleContent = ''
  if (ele.tagName.toLowerCase() === 'input' && (ele.type === 'button' || ele.type === 'submit')) {
    eleContent = ele.value || ''
  } else if (ele.tagName.toLowerCase() === 'img') {
    eleContent = ele.getAttribute('alt') || ele.getAttribute('title') || ''
  } else if (ele.tagName.toLowerCase() === 'a') {
    eleContent = ele.getAttribute('title') || ''
  }
  if (!eleContent) {
    var children = ele.childNodes
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeType === 3) {
        eleContent += children[i].nodeValue
      }
    }
    // if (ele.textContent) {
    //   eleContent = Util.trim(ele.textContent)
    // } else {
    //   if (ele.innerText) {
    //     eleContent = Util.trim(ele.innerText)
    //   }
    // }
  }
  if (eleContent && Util.paramType(eleContent) === 'String') {
    eleContent = eleContent.replace(/[\r\n]/g, ' ').replace(/[ ]+/g, ' ')
  } else {
    eleContent = ''
  }
  if (ele.tagName.toLowerCase() === 'input') {
    return ''
  }
  return Util.trim(eleContent)
}
export { getElementContent }
