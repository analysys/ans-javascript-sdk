

export const eventAttribute = {
  startup: {
    state: false, // startup事件上报状态
    xwhen: 0
  },
  pageview: {
    xwhen: 0,
    state: {  // 当前页面pageview上报状态
      
    },
    prevPath: document.referrer,
    path: document.location.href
  },
  
  webstay: {
    xwhen: 0
  },

  // 页面是否在卸载
  isUnload: false,

  // 事件发送成功后回调函数
  eventCallback: {

  },

  // 页面关闭
  pageClose: {

    // 页面隐藏时间
    hideTime: 0,

    // 页面开始隐藏时间
    hideStartTime: 0
  }

  
}

// 执行事件上报回调函数
export function implementEventCallback (data) {
  if (eventAttribute.eventCallback[data.xwhen]) {
    eventAttribute.eventCallback[data.xwhen](data)
    delete eventAttribute.eventCallback[data.xwhen]
  }
}