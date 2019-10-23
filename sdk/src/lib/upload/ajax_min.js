import Storage from '../storage/index.js'
// import pako from 'pako'
// import base64js from './base64js.min.js'

function getJSON(data) {
    if (data.indexOf("\n") > -1) {
        data = data.replace(/[\r\n]/g, "");

    }
    if (typeof data === 'object') {
        return data
    }
    try {
        return JSON.parse(data)
    } catch (e) {
        return {}

    }
}


function getHttpObj() {
    var httpobj = null;
    if (window.XDomainRequest) {
        return new XDomainRequest();
    }
    if (window.XMLHttpRequest) {
        httpobj = new XMLHttpRequest();
    } else {
        try {
            httpobj = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
            try {
                httpobj = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e1) {
                httpobj = new XMLHttpRequest();
            }
        }
    }
    return httpobj;
}

function xmlhttp(_this) {
    var sendStatus = false
    var xhr = new getHttpObj();
    // xhr.setRequestHeader("reqt",+new Date())
    // xhr.setRequestHeader("reqv",1)
    xhr.onload = function(data) {
        if (sendStatus) return
        sendStatus = true
        _this.success(getJSON(xhr.responseText), xhr)
    }
    xhr.onerror = function(data) {
        if (sendStatus) return
        sendStatus = true
        _this.error(getJSON(xhr.responseText), xhr)
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            try {
                if (xhr.getAllResponseHeaders().indexOf('Date') > -1 || xhr.getAllResponseHeaders().indexOf('date') > -1) {
                    var time = +new Date()
                    var date = xhr.getResponseHeader('Date') || xhr.getResponseHeader('date')
                    if (date) {
                        Storage.setLocal('ANSSERVERTIME', +new Date(date) - time)
                    }
                }

            } catch (e) {}

            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                if (sendStatus) return
                sendStatus = true
                _this.success(getJSON(xhr.responseText), xhr)
            } else {
                if (sendStatus) return
                sendStatus = true
                _this.error();
            }
            xhr.onreadystatechange = null;
            xhr.onload = null;
        }
    };
    try {
        xhr.open(_this.type, _this.url, true);
        // xhr.setRequestHeader("Content-Type","multipart/form-data")
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

        if (_this.type === 'GET') {
            xhr.send(null);
        } else {
            xhr.send(_this.data);
        }
    } catch (e) {

    }

}

// function lengthBaty(str) {
//     var bytesCount = 0
//     for (var i = 0; i < str.length; i++) {
//         var c = str.charAt(i);
//         if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
//         {
//             bytesCount += 1;
//         } else {
//             bytesCount += 2;
//         }
//     }
//     return bytesCount
// }

function ajax() {
    this.xhr = getHttpObj();
    this.url = ''
    this.data = ''
    this.type = 'GET'
    this.success = function() {}
    this.error = function() {}
}
ajax.prototype.get = function(option) {

    var param = []
    for (var key in option.data) {
        param.push(key + '=' + encodeURIComponent(option.data[key]))
    }
    var url = option.url.indexOf('?') > -1 ? (option.url + '&' + param.join('&')) : (option.url + '?' + param.join('&'))
    this.url = url
    this.data = option.data
    this.type = 'GET'
    this.success = option.success || function() {}
    this.error = option.error || function() {}
    xmlhttp(this)
};
ajax.prototype.post = function(option) {

    this.url = option.url
    this.data = option.data
    this.type = 'POST'
    this.success = option.success || function() {}
    this.error = option.error || function() {}
    xmlhttp(this)
}
export default ajax