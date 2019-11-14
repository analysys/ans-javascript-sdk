import Util from '../../../../lib/common/index.js'

function getElementContent(ele) {
    var ele_content = ''
    if (ele.tagName.toLowerCase() == 'input' && (ele.type == 'button' || ele.type == 'submit')) {
        ele_content = Util.trim(ele.value) || ''
    } else if (ele.tagName.toLowerCase() == 'img') {
        ele_content = Util.trim(ele.getAttribute("alt")) || Util.trim(ele.getAttribute("title")) || ''
    } else if (ele.tagName.toLowerCase() == 'a') {
        ele_content = Util.trim(ele.getAttribute("title")) || ''
    }
    if (!ele_content) {
        if (ele.textContent) {
            ele_content = Util.trim(ele.textContent)
        } else {
            if (ele.innerText) {
                ele_content = Util.trim(ele.innerText)
            }
        }
    }
    if (ele_content) {
        ele_content = ele_content.replace(/[\r\n]/g, " ").replace(/[ ]+/g, " ").substring(0, 255)
    }
    return ele_content
}
export {
    getElementContent
}