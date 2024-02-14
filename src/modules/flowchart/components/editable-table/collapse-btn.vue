<template>
  <div id="collapse-btn" @mousedown="drag($event)">
    <i class="el-icon el-icon-back"></i>
  </div>
</template>

<script>
import Bus from '@/utils/event-bus'
import $ from 'jquery'
export default {
  name: 'collapse-btn',
  props: {
    isShow: {
      type: Boolean,
      default: false,
      mouseMoveRAFId: -1 // mouse move request animation frame Id, 拖动节流的rafId
    }
  },
  data () {
    return {
      maxLeft: null
    }
  },
  mounted () {
    Bus.$on('setButtonDefaultLeft', this.setButtonDefaultLeft)
  },
  beforeDestroy () {
    Bus.$off('setButtonDefaultLeft')
  },
  methods: {
    drag (evt) {
      var box = document.querySelector('#collapse-btn')
      var startX
      var startY
      var endX
      var endY
      var e = evt || event
      var ofX = e.offsetX
      startX = evt.pageX
      startY = evt.pageY
      $('#collapse-btn').css('transition', 'all 0s')
      this.$store.commit('setpenetrate', false)
      document.onmousemove = (evt) => {
        if (this.mouseMoveRAFId !== -1) {
          return false
        }
        this.$store.commit('setpenetrate', false)
        var e = evt || event
        var x = e.pageX - ofX
        var maxX = window.innerWidth - box.offsetWidth
        if (x < 240) {
          x = 240
        }
        if (x > maxX) {
          x = maxX
        }
        this.$store.commit('setTableWidth', x)
        box.style.left = x - 20 + 'px'
        this.mouseMoveRAFId = requestAnimationFrame(() => {
          this.mouseMoveRAFId = -1
        })
      }
      document.onmouseup = (evt) => {
        var e = evt || event
        endX = e.pageX
        endY = e.pageY
        this.$store.commit('setpenetrate', true)
        document.onmousemove = null
        $('#collapse-btn').css('transition', 'all 0.8s')
        var d = Math.sqrt((startX - endX) * (startX - endX) + (startY - endY) * (startY - endY))
        if (d === 0 || d < 7) {
          Bus.$emit('sendTableBool', false)
          console.log('单击')
        } else {
          console.log('拖拽')
        }
        this.mouseMoveRAFId = -1
      }
    },
    /**
     * 事件穿透
     */
    penetrate () {
      if (this.penetrate) {
        $('.iframe-src').css('pointer-events', 'auto')
      } else {
        $('.iframe-src').css('pointer-events', 'none')
      }
    },
    setButtonDefaultLeft (val) {
      this.getMaxLeft()
      if (val) {
        $('#collapse-btn').css('left', this.maxLeft)
      } else {
        $('#collapse-btn').css('left', '-50px')
      }
    },
    getMaxLeft () {
      let maxWidth = window.innerWidth
      if (maxWidth > 1440) {
        this.maxLeft = 782 + 'px'
      } else if (maxWidth > 1280 && maxWidth <= 1440) {
        // 修改宽度
        this.maxLeft = maxWidth / 2 - 20 + 'px'
      } else if (maxWidth <= 1280) {
        this.maxLeft = 482 + 'px'
      }
    }
  }
}
</script>

<style lang="scss">
#collapse-btn {
  position: absolute;
  top: 50%;
  transform: translate(80%, -50%);
  height: 28px;
  width: 25px;
  left: -50px;
  background-color: #1689F3;
  line-height: 28px;
  color: #eee;
  transition: all 0.8s;
  border-radius: 0px 5px 5px 0px;
  z-index: 10;
  cursor: move;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:hover{
    opacity: 0.8;
  }
}
</style>
