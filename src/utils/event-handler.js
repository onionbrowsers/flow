// 自定义事件类
function EventHandler () {
  this.handlers = {}
}

EventHandler.prototype.addHandler = function ({ event, handler }) {
  if (!this.handlers[event]) {
    this.handlers[event] = []
  }
  this.handlers[event].push(handler)
}

EventHandler.prototype.fire = function ({ event, payload }) {
  if (!this.handlers[event]) {
    // throw new Error('[fire] 找不到此事件')
    console.log(`EventHandler: ${event} -- [fire] 找不到此事件`)
    return
  }
  if (!this.handlers[event].length) {
    console.log(`EventHandler: ${event} -- [fire] 此事件无 handler`)
  }
  for (const handler of this.handlers[event]) {
    handler(payload)
  }
}

EventHandler.prototype.removeHandler = function ({ event, handler = null }) {
  if (!this.handlers[event]) {
    // throw new Error('[removeHandler] 找不到此事件')
    console.log(`EventHandler: ${event} -- [removeHandler] 找不到此事件`)
    return
  }
  if (!this.handlers[event].length) {
    // throw new Error('[removeHandler] 此事件无 handler')
    console.log(`EventHandler: ${event} -- [removeHandler] 此事件无 handler`)
    return
  }
  if (handler) {
    const handlerIndex = this.handlers[event].findIndex(item => item === handler)
    this.handlers[event].splice(handlerIndex, 1)
  } else {
    this.handlers[event].shift()
  }
}

const myEvent = new EventHandler()

export default myEvent
