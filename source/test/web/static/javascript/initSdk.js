(function(config) {
    window.AnalysysAgent = window.AnalysysAgent || []
    window.AnalysysAgent.methods = 'identify alias reset track profileSet profileSetOnce profileIncrement profileAppend profileUnset profileDelete registerSuperProperty registerSuperProperties unRegisterSuperProperty clearSuperProperties getSuperProperty getSuperProperties pageView debugMode auto appkey name uploadURL hash visitorConfigURL autoProfile autoWebstay encryptType pageProperty duplicatePost NPSConfigURL'.split(' ');
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
        if(!AnalysysAgent[key]){
            AnalysysAgent[key] = factory(key);
        }
        AnalysysAgent[key](config[key])
    }
})({
    appkey: 'commondebug', //APPKEY
    debugMode:2,
    uploadURL: 'http://sdk.analysys.cn:8089/',
})
