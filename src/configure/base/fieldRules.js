/**
 * 字段填充、字段校验规则模板
 *
 * ReservedKeywords：不可覆盖字段集合
 *
 * valueType：获取字段值的方式 0：函数获取  1：默认值
 *
 * value：根据valueType规则填充字段对应取值
 *
 * checkList：数据合法检测方法列表，每个方法返回bool值，以用户为准，同名覆盖
 *
 */
import {
  getAppId,
  getUploadURL,
  getId,
  nowDate,
  getXwhat,
  getDebugMode,
  isLogin,
  getLibVersion,
  timeZone,
  language,
  getSessionId,
  isFirstTime,
  isFirstDay,
  originalId,
  getReferrer,
  getReferrerDomain,
  getTitle,
  getUrl,
  getScreenWidth,
  getScreenHeight,
  startupTime,
  checkSpider,
  utmCampaignId,
  utmSource,
  utmMedium,
  utmTerm,
  utmContent,
  utmCampaign,
  timeCalibration
} from '../../lib/fillField/getField.js'

export default {
  resetKeywords: [
    'appid',
    '$debug',
    'uploadUrl'
  ],
  uploadURL: {
    valueType: 0,
    value: getUploadURL,
    check: {
      value: ['isString', 'nimLength', 'isUrl'],
      errorCode: '60007',
      successCode: '20008'
    }
  },
  appid: {
    valueType: 0,
    value: getAppId,
    check: {
      value: ['isString', 'nimLength'],
      errorCode: '60006',
      successCode: '20006'
    }
  },
  hash: {
    check: {
      value: ['isBoolean'],
      errorCode: '60003'
    }
  },
  auto: {
    check: {
      value: ['isBoolean'],
      errorCode: '60003'
    }
  },
  autoProfile: {
    check: {
      value: ['isBoolean'],
      errorCode: '60003'
    }
  },
  pageProperty: {
    check: {
      value: ['isObject'],
      errorCode: '600016'
    }
  },
  xwho: {
    valueType: 0,
    value: getId,
    check: {
      value: ['isString', 'nimLength']
    }
  },
  xwhen: {
    valueType: 0,
    value: nowDate
  },

  xwhat: {
    valueType: 0,
    value: getXwhat,
    check: {
      value: ['isString', 'nimLength']
    }
  },

  xcontext: {
    $lib: {
      valueType: 1,
      value: 'JS'
    },
    $lib_version: {
      valueType: 0,
      value: getLibVersion,
      check: {
        value: ['isString'],
        successCode: '20007'
      }
    },
    $platform: {
      valueType: 1,
      value: 'JS'
    },
    $debug: {
      valueType: 0,
      value: getDebugMode,
      check: {
        value: ['isNumber', 'isDebug']
      }
    },
    $is_login: {
      valueType: 0,
      value: isLogin,
      check: {
        value: ['isBoolean']
      }
    },
    $screen_width: {
      valueType: 0,
      value: getScreenWidth,
      check: {
        value: ['isNumber']
      }
    },
    $screen_height: {
      valueType: 0,
      value: getScreenHeight,
      check: {
        value: ['isNumber']
      }
    },

    $time_zone: {
      valueType: 1,
      value: timeZone
    },
    $language: {
      valueType: 1,
      value: language
    },
    $session_id: {
      valueType: 0,
      value: getSessionId
    },
    $is_first_time: {
      valueType: 0,
      value: isFirstTime
    },
    $is_first_day: {
      valueType: 0,
      value: isFirstDay
    },
    $referrer: {
      valueType: 0,
      value: getReferrer
    },
    $referrer_domain: {
      valueType: 0,
      value: getReferrerDomain
    },
    $title: {
      valueType: 0,
      value: getTitle
    },
    $url: {
      valueType: 0,
      value: getUrl
    },
    $startup_time: {
      valueType: 0,
      value: startupTime
    },
    $web_crawler: {
      valueType: 0,
      value: checkSpider
    },

    $original_id: {
      valueType: 0,
      value: originalId
    },
    $utm_campaign_id: {
      valueType: 0,
      value: utmCampaignId
    },
    $utm_source: {
      valueType: 0,
      value: utmSource
    },
    $utm_medium: {
      valueType: 0,
      value: utmMedium
    },
    $utm_term: {
      valueType: 0,
      value: utmTerm
    },
    $utm_content: {
      valueType: 0,
      value: utmContent
    },
    $utm_campaign: {
      valueType: 0,
      value: utmCampaign
    },
    $is_time_calibrated: {
      valueType: 0,
      value: timeCalibration
    }

  },

  xcontextCommonRule: {
    check: {
      key: ['isString', 'length99', 'notSpecialCharacters', 'keywords'],
      value: ['notObject', 'isArrayString', 'length255']
    }
  },
  $track: {
    check: {
      key: ['isString', 'notSpecialCharacters', 'length99']
    }
  },
  $alias: {
    check: {
      key: ['isString', 'keyLength255']
    }
  },
  $profile_increment: {
    check: {
      key: ['isString', 'length99', 'notSpecialCharacters'],
      value: ['isNumber']
    }
  },
  $profile_unset: {
    check: {
      key: ['isString', 'length99', 'notSpecialCharacters']
    }
  },
  $pageview: {
    check: {
      key: ['isString', 'keyLength255']
    }
  }
}
