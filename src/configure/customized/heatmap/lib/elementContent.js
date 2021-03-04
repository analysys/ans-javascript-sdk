import Util from '../../../../lib/common/index.js'

function getElementContent (ele, status) {
  var eleContent = ''
  if (ele.tagName.toLowerCase() === 'input') {
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
  if (ele.tagName.toLowerCase() === 'input' && ele.type !== 'button' && ele.type !== 'submit' && status !== true) {
    return ''
  }
  eleContent = Util.trim(eleContent)
  // if (eleContent.length > 0) {
  //   eleContent = 
  // }
  return eleContent
}
export { getElementContent }
