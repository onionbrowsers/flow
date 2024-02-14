<script>
export default {
  name: 'custom-websocket',
  props: {
    // websocket url
    wsURL: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // websocket 实例
      ws: null
    }
  },
  // 销毁钩子
  beforeDestroy () {
    if (this.ws) {
      // 关闭 ws
      this.ws.close()
    }
  },
  render () {
    return ''
  },
  methods: {
    /**
     * 初始化, 外部调用
     */
    init () {
      // 清除即有 ws
      if (this.ws) {
        this.ws.close()
        this.ws = null
      }
      this.ws = new WebSocket(this.wsURL)
      this.ws.onopen = this.onOpen
      this.ws.onmessage = this.onMessage
      this.ws.onclose = this.onClose
      this.ws.onerror = this.onWSError
    },
    /**
     * websocket 发送的数据
     * @param data
     */
    send ({ data }) {
      if (this.ws) {
        this.ws.send(data)
      } else {
        console.warn('warning: ws is null')
      }
    },
    /**
     * 打开连接事件
     * @param event 事件对象
     */
    onOpen (event) {
      this.$emit('ws-open', event)
    },
    /**
     * 接收到 服务器发送的消息 事件
     * @param event 消息体对象
     */
    onMessage (event) {
      this.$emit('ws-message', event)
    },
    /**
     * 出错事件
     * @param error 错误对象
     */
    onWSError (error) {
      this.$emit('ws-error', error)
    },
    /**
     * 关闭事件处理函数
     * @param event
     */
    onClose (event) {
      this.$emit('ws-close', event)
    },
    /**
     * 关闭/断开 websocket 连接， ref
     */
    close () {
      // debugger
      if (this.ws) {
        this.ws.close()
        this.ws = null
      }
    }
  }
}
</script>
