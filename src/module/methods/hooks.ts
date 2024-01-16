

let eventMap = {
  // before
  //afterInit: [], //初始化完成之后，可以获取到sdk实例
  // afterSend: [], //数据上报之前执行，post上报类型时在加入数据缓存队列之前执行
  // beforeSend: [], //数据上报之后
  // successSend: [] //数据上报成功之后
  //errorSend: [] //数据上报失败之后
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

export function remove (eventName, fn?) {
  
}

export function removeAll () {
  eventMap = {}
}