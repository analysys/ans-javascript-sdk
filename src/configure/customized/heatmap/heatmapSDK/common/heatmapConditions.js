import Util from '../../../../../lib/common/index.js'
var arkcontent = Util.GetUrlParam("arkcontent")

function backParam() {
    if (arkcontent) {
        if (arkcontent.charAt(arkcontent.length - 1) == "/") {
            arkcontent = arkcontent.substr(0, arkcontent.length - 1);
        }
        if (arkcontent.charAt(arkcontent.length - 1) == "#") {
            arkcontent = arkcontent.substr(0, arkcontent.length - 1);
        }
        var params = unescape(arkcontent)
        var content = JSON.parse(params)
        if (content.code === 'ark/depth') {
            activeStatus = 'depth'
        }
        if (content.code === 'ark/element') {
            activeStatus = 'element'
        }
    }
    return {

    }
}