import { setCore } from '../../store/core'
import { getStorage } from '../../module/storage'

function updateCache(fn) {
  getStorage((data) => {
    setCore(data)
    fn && fn()
  })
}

export default updateCache
