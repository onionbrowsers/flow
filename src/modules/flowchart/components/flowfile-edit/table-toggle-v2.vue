<template>
  <div id="table-toggle" @click="buttonClick($event)">
    <div v-show="!isShow" class="table-toggle-btn">
      <i class="iconfont iconzhinengshengcheng table-toggle-btn__icon"></i>
      <span>智能生成</span>
    </div>
    <div v-show="isShow" class="table-toggle-btn">
      <i class="iconfont iconshoudonghuizhi table-toggle-btn__icon"></i>
      <span>手动绘制</span>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/event-bus'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableBool: false
      // mousePosInBox: {},
      // draggable: false
    }
  },
  mounted () {
    // let lastPos = JSON.parse(localStorage.getItem('table-toggle-position')) || { x: 263, y: 107 }
    // let box = document.querySelector('#table-toggle')
    // box.style.left = lastPos.x
    // box.style.top = lastPos.y
    Bus.$on('sendTableBool', this.sendTableBool)
  },
  beforeDestroy () {
    // document.onmouseup = null
  },
  methods: {
    /**
     * 按钮点击
     */
    buttonClick () {
      if (!this.$store.getters.drawIOStateGetter) {
        this.$msgMnger.warn('加载中, 请稍等')
        return
      }
      this.tableBool = !this.tableBool
      this.$emit('sendTableBool', this.tableBool)
    },
    sendTableBool (val) {
      this.tableBool = false
    },
    buttonMove () {
      // console.log('is show is: ', this.isShow)
      var box = document.querySelector('#table-toggle')
      var startX
      var startY
      var endX
      var endY
      box.onmousedown = (evt) => {
        var e = evt || event
        var layX = e.layerX
        var layY = e.layerY
        startX = e.pageX
        startY = e.pageY
        document.onmousemove = (evt) => {
          this.$store.commit('setpenetrate', false)
          var e = evt || event
          var x = e.pageX - layX
          var y = e.pageY - layY
          var maxX = window.innerWidth - box.offsetWidth
          var maxY = window.innerHeight - box.offsetHeight
          if (x < 0) {
            x = 0
          }
          if (y < 0) {
            y = 0
          }
          if (x > maxX) {
            x = maxX
          }
          if (y > maxY) {
            y = maxY
          }
          box.style.left = x + 'px'
          box.style.top = y + 'px'
        }
      }
      document.onmouseup = (evt) => {
        this.$store.commit('setpenetrate', true)
        var e = evt || event
        endX = e.pageX
        endY = e.pageY
        let tableToggle = document.querySelector('#table-toggle')
        let left = getComputedStyle(tableToggle).getPropertyValue('left')
        let top = getComputedStyle(tableToggle).getPropertyValue('top')
        localStorage.setItem('table-toggle-position', JSON.stringify({ x: left, y: top }))
        document.onmousemove = null
        var d = Math.sqrt((startX - endX) * (startX - endX) + (startY - endY) * (startY - endY))
        // 添加禁用, 当 drawIO 没有加载完成时, 禁用按钮
        if (!this.$store.getters.drawIOStateGetter) {
          this.$msgMnger.warn('加载中, 请稍等')
          return
        }
        if (d === 0 || d < 7) {
          this.tableBool = !this.tableBool
          this.$emit('sendTableBool', this.tableBool)
        }
        if (isNaN(d)) {
          this.tableBool = true
          this.$emit('sendTableBool', this.tableBool)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#table-toggle{
  width: 110px;
  height: 35px;
  background-color: #1689F4;
  background-size: 100% 100%;
  text-align: center;
  position: fixed;
  top: 26px;
  left: 340px;
  transform: translateY(-50%);
  color: #eee;
  cursor: pointer;
  z-index: 1998;
  font-size: 12px;
  font-weight: bold;
  /*position: absolute;*/
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  /*-khtml-user-select: none;*/
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:hover{
    opacity: 0.8;
  }
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 3px 3px 10px rgba(22, 137, 244, .7);
  .table-toggle-btn {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    // transform: translateY(-3px);
    /*.iconfont {*/
    /*  font-size: 22px !important;*/
    /*  pointer-events: none;*/
    /*  font-weight: normal !important;*/
    /*}*/
    .table-toggle-btn__icon {
      margin-right: 5px;
      font-size: 16px;
      font-weight: normal
    }
    span {
      font-size: 14px;
      pointer-events: none;
    }
  }
}
</style>
