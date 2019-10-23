function checkURL(URL) {
    var str = URL;
    //判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
    //下面的代码中应用了转义字符"\"输出一个字符"/"
    var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp = new RegExp(Expression);
    if (objExp.test(str) == true) {
        return true;
    } else {
        return false;
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var appkey = getQueryString("appkey");
if (!appkey) {
    appkey = "xxxxxxx"
}
var uploadURL = getQueryString("uploadURL");
if (!uploadURL || !checkURL(uploadURL)) {

    uploadURL = 'https://sdk.analysys.cn:4089'
}
(function(config) {
    window.AnalysysAgent = window.AnalysysAgent || []
    window.AnalysysAgent.methods = 'identify alias reset track profileSet profileSetOnce profileIncrement profileAppend profileUnset profileDelete registerSuperProperty registerSuperProperties unRegisterSuperProperty clearSuperProperties getSuperProperty getSuperProperties pageView getDistinctId'.split(' ');

    function factory(b) {
        return function() {
            var a = Array.prototype.slice.call(arguments);
            a.unshift(b);
            window.AnalysysAgent.push(a);
            return window.AnalysysAgent;
        }
    };
    for (var i = 0; i < AnalysysAgent.methods.length; i++) {
        var key = window.AnalysysAgent.methods[i];
        AnalysysAgent[key] = factory(key);
    }
    for (var key in config) {
        if (!AnalysysAgent[key]) {
            AnalysysAgent[key] = factory(key);
        }
        AnalysysAgent[key](config[key])


    }

})({
    appkey: appkey, //APPKEY
    debugMode: 1,
    uploadURL: uploadURL
})