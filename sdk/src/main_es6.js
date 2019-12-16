/**
 * 发布API
 */
import * as ans from './API/index.js'
import Util from './lib/common/index.js'
import baseConfig from './lib/baseConfig/index.js'
import * as getField from './lib/fillField/getField.js'
import {
    lifecycle
} from './configure/index.js'
import {
    startUp,
    clearCache
} from './API/template/startUp.js'
import {
    ieCreat
} from './lib/compatible/index.js'

function _createAnsSDK() {
    if (Util.paramType(window.AnalysysAgent) == 'Array') {
        ieCreat()
        if (window.navigator.userAgent.indexOf('AnalysysAgent/Hybrid') > -1) {
            if (lifecycle.AnalysysAgent && lifecycle.AnalysysAgent.hybrid && lifecycle.AnalysysAgent.hybridAns) {
                lifecycle.AnalysysAgent.hybrid()

                if (Util.paramType(window.AnalysysAgent) === 'Array') {
                    for (var i = 0; i < window.AnalysysAgent.length; i++) {
                        var item = window.AnalysysAgent[i]
                        if (item[0] === 'name') {
                            window[item[1]] = lifecycle.AnalysysAgent.hybridAns
                        }
                    }
                }
                window.AnalysysAgent = lifecycle.AnalysysAgent.hybridAns

            }
        } else {
            var AnalysysAgent = window.AnalysysAgent
            if (Util.paramType(AnalysysAgent) === 'Array') {
                for (var i = 0; i < AnalysysAgent.length; i++) {
                    var item = AnalysysAgent[i]

                    if (Util.paramType(getField[item[0]]) === 'Function') {
                        getField[item[0]](item[1])
                    } else {
                        baseConfig.base[item[0]] = item[1]
                    }
                }
                clearCache()
                for (var i = 0; i < AnalysysAgent.length; i++) {
                    var item = AnalysysAgent[i]
                    if (Util.objHasKay(ans, item[0]) && (item[0] === 'identify' || item[0] === 'alias' || item[0].indexOf('Super') > -1)) {
                        ans[item[0]](item[1], item[2])
                    }
                }
            }

            if (lifecycle.AnalysysAgent && lifecycle.AnalysysAgent.init) {
                lifecycle.AnalysysAgent.init(baseConfig.base)
            }

            //如存在修改则重置登录及启动状态
            startUp()
            try {
                //启动完毕后执行调用上报日志累接口
                if (Util.paramType(AnalysysAgent) === 'Array') {
                    for (var i = 0; i < AnalysysAgent.length; i++) {
                        var item = AnalysysAgent[i]
                        if (Util.objHasKay(ans, item[0]) && item[0] !== 'identify' && item[0] !== 'alias' && item[0].indexOf('Super') < 0) {
                            ans[item[0]](item[1], item[2])
                        }
                        if (item[0] === 'name') {
                            window[item[1]] = ans
                        }
                    }

                }
            } catch (e) {

            }
            window.AnalysysAgent = ans
        }
    }
}
class ansEs6 {
    constructor() {
        this.init = this._init
        this.config = {}
    }
    _init(obj) {
        if (!window.AnalysysAgent && Util.paramType(obj) == 'Object') {
            window.AnalysysAgent = []

            for (let key in obj) {
                window.AnalysysAgent.push([key, obj[key]])
            }
            this.config = obj
            _createAnsSDK()
        }
    }

}
export default Object.assign(new ansEs6(), ans)