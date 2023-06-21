
import { nativeCallbackFn } from '../../store/hybrid'

// native回调方法
function nativeCallback (name, params) {
  const nativeCallbackNam = nativeCallbackFn[name]
  if (nativeCallbackNam) {
    nativeCallbackNam.forEach(o => {
      o(params)
    })
    nativeCallbackFn[name] = []
  }
}

export default nativeCallback