import { encryptInit, uploadData } from '../lib/encrypt.js'
export default {
  AnalysysAgent: {
    init: encryptInit
  },
  upload: {
    init: uploadData
  }
}
