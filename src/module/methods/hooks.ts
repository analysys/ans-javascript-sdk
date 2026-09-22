let eventMap = {}


export const EventNames = {
  onSendError: 'onSendError', // 监听发送数据错误的事件
  onSendComplete: 'onSendComplete', // 监听发送数据完成的事件
  pageView: {
    onBeforeSend: 'onBeforePageView', // 监听页面发送数据前的事件
    onAffterSend: 'onAfterPageView', // 监听页面发送数据后的事件
  }
}

export function on (eventName:string, fn: (...args) => void) {
  eventMap[eventName] ? eventMap[eventName].push(fn) : eventMap[eventName] = [fn]
}

export function emit (eventName:string, ...args) {
  if (eventMap[eventName]) {
    eventMap[eventName].forEach(o => {
      o(...args)
    })
  }
}

export function off (eventName:string, fn: (...args) => void) {
  if (eventMap[eventName]) {
    if (!fn) {
      eventMap[eventName] = []
      return
    }
    eventMap[eventName] = eventMap[eventName].filter(o => o !== fn)
  }
}