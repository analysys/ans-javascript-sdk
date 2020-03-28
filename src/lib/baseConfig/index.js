import fieldTemplate from '../../configure/base/fieldTemplate.js'
export default {
  base: {
    appid: '',
    $debug: 2,
    uploadURL: '',
    auto: true,
    autoProfile: true,
    hash: true,
    autoWebstay: true,
    singlePage: true,
    pageProperty: {},
    $lib_version: '4.4.1',
    cookieLevel: 2
  },
  status: {
    code: 200,
    FnName: '',
    key: '',
    value: '',
    errorCode: '',
    successCode: ''
  },
  keywords: fieldTemplate.base.xcontext,
  baseJson: fieldTemplate.base.outer,
  sendNum: 1800
}
