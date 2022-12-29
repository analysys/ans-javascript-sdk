

import { profileSetOnce } from './profile'
import { config } from '../../store/config'
import { successLog } from '../printLog'
import { resetCore } from '../../store/core'
import { dateFormat } from '../../utils/date'
function reset (fn?) {

  resetCore()

  if (config.autoProfile === true) {
    profileSetOnce({
      '$reset_time': dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS')
    })
  }

  successLog({
    fn: '$reset',
    code: 20005
  })

  fn && fn()
}

export default reset