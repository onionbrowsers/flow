<template>
  <custom-websocket
    :ws-u-r-l="wsURLComputed"
    @ws-open="handleWSOpen"
    @ws-message="handleWSMessage"
    @ws-error="handleWSError"
    @ws-close="handleWSClose"
    ref="customWebsocket"
  ></custom-websocket>
</template>

<script>
import CustomWebsocket from '@/components/public/custom-websocket'
import { debounce } from '@/utils/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'ws-tool',
  components: {
    CustomWebsocket
  },
  data () {
    return {
      wsURL: '0.0.0.0',
      intervalId: 0,
      port: '10255',
      errorOccurred: false // 是否因出现错误而关闭
    }
  },
  computed: {
    ...mapGetters(['activeTimeStampGetter']),
    msgContentPart () {
      return {
        flow_id: this.$route.params.flowfileId,
        _token: this.$store.getters.token
      }
    },
    wsURLComputed () {
      return `ws://172.16.20.54:${this.port}`
      // return `ws://${window.location.hostname}:${this.port}`
    }
  },
  watch: {
    // watch 某个检测内容改变的时间戳, 如果发生了改变, 则表示 change 则进行 refresh
    activeTimeStampGetter () {
      this.mouseDownHandlerForActive()
    }
  },
  mounted () {
  },
  beforeDestroy () {
    this.removeListenerAndTimer()
  },
  methods: {
    /**
     * 开启 websocket 方法
     */
    open () {
      this.$refs.customWebsocket.init()
    },
    /**
     * websocket open 事件
     * @param msg
     */
    handleWSOpen (msg) {
      // console.log('open 了呢')
      // 1. 发送 action: mutate, status: 2, 改变编辑状态为 编辑中
      this.send(Object.assign(
        {},
        { status: 2 },
        this.getMsgContentPart({ action: 'mutate' })
      ))
      // 2. 给 document 添加 mousedown 方法, 监听 active
      document.addEventListener('mousedown', this.mouseDownHandlerForActive)
    },
    /**
     * 发送消息
     * @param msgContent <Object> 消息内容
     */
    send (msgContent) {
      const content = JSON.stringify(msgContent)
      this.$refs.customWebsocket && this.$refs.customWebsocket.send({ data: content })
    },
    /**
     * 获取部分消息体
     * @param action
     * @returns
     */
    getMsgContentPart ({ action }) {
      return Object.assign(
        {},
        { action },
        this.msgContentPart,
        { timeStamp: +new Date() }
      )
    },
    /**
     * 接收到消息
     * @param msg
     */
    handleWSMessage (msg) {
      // console.log('msg is: ', msg)
      // 接收到的为单引号字符串, JSON.parse 不认
      const res = JSON.parse(msg.data.replace(/ ?None/, ` ''`).replace(/'/g, '"'))
      // console.log('接收到响应消息! 消息: ', res)
      if (res.expire === 1) {
        this.close()
        return false
      }
      const action = res.action
      switch (action) {
        case 'mutate':
          this.handleGetMutateRes(res)
          break
        case 'refresh':
          break
        case 'heartbeat':
          break
      }
    },
    /**
     * 接收到 mutate status 的响应
     * @param msg
     */
    handleGetMutateRes (msg) {
      const status = msg.status
      if (status === 1) { // 如果接收到的 status 为不在编辑中(表示发的 status 为 1, 表示关闭行为已成功)
        // 1. 调用关闭 ws 的方法
        this.close()
      } else if (status === 2) { // 反之, 表示开启行为已成功
        // 1. 开启成功, 告知父组件
        this.$emit('ws-open-success')
        // 2. 发送心跳包
        this.send(Object.assign(
          {},
          this.getMsgContentPart({ action: 'heartbeat' })
        ))
        // 3. 添加心跳包 interval
        this.intervalId = setInterval(() => {
          this.send(Object.assign(
            {},
            this.getMsgContentPart({ action: 'heartbeat' })
          ))
        }, 10000)
      } else {}
    },
    /**
     * websocket 出现错误的回调
     * @param error
     */
    handleWSError (error) {
      console.log('ws error is: ', error)
      // 移除绑定到 document 的事件
      this.removeListenerAndTimer()
      this.errorOccurred = true
    },
    /**
     * 表示 websocket 已完全关闭
     * @param event
     */
    handleWSClose (event) {
      console.log('ws 关闭了 ', event)
      this.removeListenerAndTimer()
      if (this.errorOccurred) {
        this.$emit('ws-close-success', { error: true })
        this.errorOccurred = false
      } else {
        this.$emit('ws-close-success', {})
      }
    },
    /**
     * 监听点击动作的事件处理函数
     */
    mouseDownHandlerForActive: debounce(function () {
      this.send(Object.assign(
        {},
        this.getMsgContentPart({ action: 'refresh' })
      ))
    }, 1500),
    /**
     * 关闭 ws
     */
    close () {
      this.$refs.customWebsocket.close()
    },
    /**
     * 移除 document 的监听器
     */
    removeListenerAndTimer () {
      document.removeEventListener('click', this.mouseDownHandlerForActive)
      this.intervalId && clearInterval(this.intervalId)
      this.intervalId = 0
    }
  }
}
</script>

<style scoped>

</style>
