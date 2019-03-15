// import '../lib/compatible/index.js'
import baseConfig from '../lib/baseConfig/index.js'
import { pageView } from './template/pageView.js'
import { track } from './template/track.js'
import { freeApi } from './template/freeApi.js'
import { alias } from './template/alias.js'
import { identify } from './template/identify.js'
import { startUp, clearCache } from './template/startUp.js'
import { profileSet } from './template/profileSet.js'
import { profileSetOnce } from './template/profileSetOnce.js'
import { profileIncrement } from './template/profileIncrement.js'
import { profileAppend } from './template/profileAppend.js'
import { profileUnset } from './template/profileUnset.js'
import { profileDelete } from './template/profileDelete.js'
import { registerSuperProperty } from './template/registerSuperProperty.js'
import { registerSuperProperties } from './template/registerSuperProperties.js'
import { getSuperProperty } from './template/getSuperProperty.js'
import { getSuperProperties } from './template/getSuperProperties.js'
import { unRegisterSuperProperty } from './template/unRegisterSuperProperty.js'
import { clearSuperProperties } from './template/clearSuperProperties.js'
import { reset } from './template/reset.js'

import Util from '../lib/common/index.js'
import { lifecycle } from '../configure/index.js'
if (Util.paramType(AnalysysAgent) === 'Array') {
    for (var i = 0; i < AnalysysAgent.length; i++) {
        var item = AnalysysAgent[i]
        if (item[0] === 'appkey') {
            baseConfig.base['appid'] = item[1]
        } else if (item[0] === 'debugMode') {
            baseConfig.base["$debug"] = item[1]
        }else{
            baseConfig.base[item[0]] = item[1]
        }
    }
}
if(lifecycle.AnalysysAgent&&lifecycle.AnalysysAgent.init){
    lifecycle.AnalysysAgent.init(baseConfig.base)
}

//如存在修改则重置登录及启动状态
clearCache()

startUp()

export {
    pageView,
    profileSet,
    profileSetOnce,
    profileIncrement,
    profileAppend,
    profileUnset,
    profileDelete,
    alias,
    identify,
    track,
    registerSuperProperty,
    registerSuperProperties,
    getSuperProperty,
    getSuperProperties,
    unRegisterSuperProperty,
    clearSuperProperties,
    reset,
    freeApi
}