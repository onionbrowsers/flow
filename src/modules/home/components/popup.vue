<template>
  <div
    class="popup"
    :style="{ left: popupPos.left + 'px', top: popupPos.top + 'px' }"
    @contextmenu.prevent
    ref="popup"
  >
<!--    插槽名字: contextmenu-->
    <slot name="contextmenu"></slot>
  </div>
</template>

<script>
/**
 * 使用:
 * props: left, top
 * 事件: hide-popup
 * 插槽: contextmenu
 * */
export default {
  // 传入 left top 值, contextmenu 事件对象
  props: {
    left: Number,
    top: Number
  },
  data () {
    return {
      popupPos: { left: 0, top: 0 }
    }
  },
  computed: {
    popupPosComputed () {
      return { left: this.left, top: this.top }
    }
  },
  watch: {
    // 位置数据变化时, 优化右键菜单位置
    popupPosComputed: {
      handler (newValue) {
        this.popupPos = this.optimizePopup(newValue)
      },
      deep: true
    }
  },
  mounted () {
    // 添加事件监听, 点击非popup内容的时候, 隐藏菜单
    document.addEventListener('click', this.handleClickTargetNotPopup)
    // 优化弹出框位置
    this.popupPos = this.optimizePopup({ left: this.left, top: this.top })
  },
  beforeDestroy () {
    // 销毁时去除事件
    document.removeEventListener('click', this.handleClickTargetNotPopup)
  },
  methods: {
    /**
     * 判断document点击事件的位置, 如果不在 popup 中, 隐藏 popup
     * @param event
     */
    handleClickTargetNotPopup (event) {
      // 计算鼠标点击位置, 与popup在document的位置
      const mousePos = { // 鼠标位置
        x: event.x,
        y: event.y
      }
      const popupPos = { // popup 范围
        leftTop: {
          x: this.popupPos.left,
          y: this.popupPos.top
        },
        rightBottom: {
          x: this.popupPos.left + this.$refs.popup.offsetWidth,
          y: this.popupPos.top + this.$refs.popup.offsetHeight
        }
      }

      if (
        (mousePos.x >= popupPos.leftTop.x && mousePos.x <= popupPos.rightBottom.x) &&
        (mousePos.y >= popupPos.leftTop.y && mousePos.y <= popupPos.rightBottom.y)
      ) {
        return false
      } else {
        this.$emit('hide-popup')
      }
    },
    /**
     * 优化右键菜单位置函数, 预先判断菜单展开后会不会超出浏览器高度, 超出的话, 上移位置
     * @param left
     * @param top
     * @returns {{top: *, left: *}}
     */
    optimizePopup ({ left, top }) {
      const windowHeight = window.innerHeight
      const popupHeight = this.$refs.popup.offsetHeight
      const tmpPos = { left, top }

      if (windowHeight - this.top < popupHeight) {
        tmpPos.top = this.top - popupHeight
      }
      return tmpPos
    }
  }
}
</script>

<style scoped lang="scss">
.popup{
  position: fixed;
  z-index: 2100;
  background-color: #fff;
}
</style>
