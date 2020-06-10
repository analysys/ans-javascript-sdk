(function (c) {
    window.AnalysysAgent = window.AnalysysAgent || {}
    var a = window.AnalysysAgent || {}
    var ans = ['identify', 'alias', 'reset', 'track', 'profileSet', 'profileSetOnce', 'profileIncrement', 'profileAppend', 'profileUnset', 'profileDelete', 'registerSuperProperty', 'registerSuperProperties', 'unRegisterSuperProperty', 'clearSuperProperties', 'getSuperProperty', 'getSuperProperties', 'pageView', 'getDistinctId']
    a['config'] = c
    a['param'] = []
    function factory (b) {
        return function () {
            a['param'].push([b, arguments])
            return window.AnalysysAgent
        }
    }
    for (var i = 0; i < ans.length; i++) {
        a[ans[i]] = factory(ans[i])
    }
    if (c.name) {
        window[c.name] = a
    }
})({
    appkey: "commondebug", //APPKEY
    debugMode: 2,
    uploadURL: 'https://sdk.analysys.cn:4089/',
    visitorConfigURL: 'https://sdk.analysys.cn:4089/',
    /**如无自定义配置，则与uploadURL相同**/
    autoHeatmap: true
})