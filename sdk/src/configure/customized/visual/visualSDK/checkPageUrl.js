import msg from './iframeMsg.js'
var win = window
var loc = win.location
var url = loc.protocol + '//' + loc.host + loc.pathname + loc.hash

function checkPageUrl(event_url) {
    var skip = false
    if (url.indexOf(event_url) > -1) {
        skip = true
    }
    var obj = {
        type :'checkUrl',
        code: 200,
        url: url,
        skip: skip
    }
    msg.postMsg(obj)
}

export { checkPageUrl }