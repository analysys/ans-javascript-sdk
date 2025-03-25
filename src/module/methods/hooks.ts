let eventMap = {
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