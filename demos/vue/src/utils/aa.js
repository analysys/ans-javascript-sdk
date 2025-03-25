(function (config) {
  if (window.AnalysysAgent && window.AnalysysAgent.isInit) return
  window.AnalysysAgent = window.AnalysysAgent || {}
  var ans = ['identify', 'alias', 'reset', 'track', 'profileSet', 'profileSetOnce', 'profileIncrement', 'profileAppend', 'profileUnset', 'profileDelete', 'registerSuperProperty', 'registerSuperProperties', 'unRegisterSuperProperty', 'clearSuperProperties', 'getSuperProperty', 'getSuperProperties', 'pageView', 'getDistinctId', 'pageProperty']
  var a = window.AnalysysAgent
  a['param'] = []
  function factory (b) {
    return function () {
      a['param'].push({
        fn: b,
        arg: arguments
      })
    }
  }
  for (var i = 0; i < ans.length; i++) {
    a[ans[i]] = factory(ans[i])
  }

  if (config.name) {
    window[config.name] = a
  }

  var c = document.createElement('script'), 
      n = document.getElementsByTagName('script')[0];
  c.type = 'text/javascript';
  c.async = true;
  c.id = 'ARK_SDK';
  c.src = _xibConfig.CDN_PATH + '/v4-std/res/static/js/AnalysysAgent_JS_SDK.min.js'
  c.onload = function () {
    window.AnalysysAgent.init(config)
  }
  n.parentNode.insertBefore(c, n);

  // 加载加密插件
  e = document.createElement('script')
  e.type = c.type
  e.async = true
  e.src = _xibConfig.CDN_PATH + '/v4-std/res/static/js/AnalysysAgent_Encrypt.min.js' 
  n.parentNode.insertBefore(e, n)
})({
  appkey: "xiblingshou",
  debugMode: 2,
  uploadURL: 'https://behavior.xib.com.cn:443/',
  auto: false,
  hash: false,
  encryptType: 2,
  autoPageViewDuration: true
})