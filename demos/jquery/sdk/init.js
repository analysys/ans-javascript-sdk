(function () {
  window.AnalysysAgent = window.AnalysysAgent || {}
  // 鏄撹sdk褰撳墠濡傛灉宸茬粡鍒濆鍖栧畬鎴愶紝鍒欐棤闇€鍐嶈繘琛屽垵濮嬪寲鎿嶄綔
  if (window.AnalysysAgent && window.AnalysysAgent.isInit === true) {
      return
  }
  var d = document,
    e = d.createElement('script'),
    n = d.getElementsByTagName('script')[0];
  e.type = 'text/javascript';
  e.async = true;
  e.src = 'https://design.yonyoucloud.com/static/analytics/yiguan/latest/AnalysysAgent_PageViewStayTime.min.js'; //椤甸潰璁块棶鏃堕暱妯″潡 SDK瀛樻斁鍦板潃
  n.parentNode.insertBefore(e, n);
})();
(function (c) {
  window.AnalysysAgent = window.AnalysysAgent || {}
  // 鏄撹sdk褰撳墠濡傛灉宸茬粡鍒濆鍖栧畬鎴愶紝鍒欐棤闇€鍐嶈繘琛屽垵濮嬪寲鎿嶄綔
  if (window.AnalysysAgent && window.AnalysysAgent.isInit === true) {
      return
  }
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
  var date = new Date();
  var time = '4_5_5_11_'+new String(date.getFullYear()) + new String(date.getMonth() + 1) + new String(date.getDate());
  var d = document,
    e = d.createElement('script'),
    n = d.getElementsByTagName('script')[0];
  e.type = 'text/javascript';
  e.async = true;
  e.id = 'ARK_SDK';
  e.src = 'https://design.yonyoucloud.com/static/analytics/yiguan/latest/AnalysysAgent_JS_SDK.min.js' + '?v=' + time; //JS SDK鐎涙ɑ鏂侀崷鏉挎絻
  n.parentNode.insertBefore(e, n);
})({
  appkey: '4d0f00f6b5fab47d',  //姝ｅ紡鐜
  uploadURL: 'https://art.diwork.com',
  debugMode: 2,
  crossSubdomainSuper: (function(){
    var origin = window.location.origin;
    var YS_URL_OBJ = {
      'https://yonsuite.diwork.com': true, //  YS姝ｅ紡鐜鍦板潃
      'https://www.diwork.com': true, // YB鐨刣iwork鐜鍦板潃
      'https://yonbip.yonyou.com': true, // YB姝ｅ紡鐜鍦板潃
    }
    if (YS_URL_OBJ[origin]) {
      return true
    } else {
      return false
    }
  })(),
  visitorConfigURL: 'https://art.diwork.com'
})



(function (config) {
  var c = document.createElement('script'), 
      n = document.getElementsByTagName('script')[0];
  c.type = 'text/javascript';
  c.async = true;
  c.id = 'ARK_SDK';
  c.src = 'https://design.yonyoucloud.com/static/analytics/yiguan/latest/AnalysysAgent_JS_SDK.min.js' + '?v=' + (+new Date());
  c.onload = function () {
    window.AnalysysAgent.init(config)
  }
  n.parentNode.insertBefore(c, n);
})({
  appkey: '4d0f00f6b5fab47d',  //姝ｅ紡鐜
  uploadURL: 'https://art.diwork.com',
  debugMode: 2,
  autoPageViewDuration: true, //自动上报页面关闭事件
  crossSubdomainSuper: (function(){
    var origin = window.location.origin;
    var YS_URL_OBJ = {
      'https://yonsuite.diwork.com': true, //  YS姝ｅ紡鐜鍦板潃
      'https://www.diwork.com': true, // YB鐨刣iwork鐜鍦板潃
      'https://yonbip.yonyou.com': true, // YB姝ｅ紡鐜鍦板潃
    }
    if (YS_URL_OBJ[origin]) {
      return true
    } else {
      return false
    }
  })(),
  visitorConfigURL: 'https://art.diwork.com'
})