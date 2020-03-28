import Util from '../../../../lib/common/index.js'

function getElementContent (ele) {
  var eleContent = ''
  if (ele.tagName.toLowerCase() === 'input' && (ele.type === 'button' || ele.type === 'submit')) {
    eleContent = Util.trim(ele.value) || ''
  } else if (ele.tagName.toLowerCase() === 'img') {
    eleContent = Util.trim(ele.getAttribute('alt')) || Util.trim(ele.getAttribute('title')) || ''
  } else if (ele.tagName.toLowerCase() === 'a') {
    eleContent = Util.trim(ele.getAttribute('title')) || ''
  }
  if (!eleContent) {
    if (ele.textContent) {
      eleContent = Util.trim(ele.textContent)
    } else {
      if (ele.innerText) {
        eleContent = Util.trim(ele.innerText)
      }
    }
  }
  if (eleContent && Util.paramType(eleContent) === 'String') {
    eleContent = eleContent.replace(/[\r\n]/g, ' ').replace(/[ ]+/g, ' ').substring(0, 255)
  } else {
    eleContent = ''
  }
  if (ele.tagName.toLowerCase() === 'input') {
    return ''
  }
  return eleContent
}
export { getElementContent }
