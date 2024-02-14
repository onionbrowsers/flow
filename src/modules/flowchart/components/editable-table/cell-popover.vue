<template>
  <div class="cell-popover">
    <div
      class="mask-for-disabled"
      :style="{ display: displayAttr }"
    >
    </div>
    <el-popover
      ref="nextStepPopover"
      :popper-class="'next-step-popper' + row.id"
      class="popover-container"
      placement="bottom"
      trigger="manual"
      width="100px"
      @hide="handlePopoverHide"
      @show="handlePopoverShow"
      v-model="isShowPopover"
      :disabled="$store.getters.disabledGetter"
    >
      <!--    v-mask="{ _self: _self, pos: ['end'], rowIndex: rowIndex }"-->
      <div
        slot="reference"
        @click="togglePopover"
      >
        <span v-if="cellText.length === 0">{{ '请选择' }}</span>
        <span v-else>
          <div v-for="(item,i) in cellText" :key="i">{{ item }}</div>
        </span>
      </div>
      <div>
<!--        @mouseenter="handleMouseEnter"-->
<!--        @mouseleave="handleMouseLeave"-->
        <el-scrollbar style="height: 240px;">
          <comp-select
            :prop="prop"
            :row="row"
            :row-index="rowIndex"
            :next-step-options="nextStepOptions"
            @step-change="handleStepChange"
          ></comp-select>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<script>
import CompSelect from './comp-select'
import { mapGetters } from 'vuex'
export default {
  components: {
    CompSelect
  },
  props: {
    prop: {
      type: [Array, String],
      default: ''
    },
    row: {
      type: Object,
      default: () => {}
    },
    rowIndex: {
      type: Number,
      default: 0
    },
    placeholderData: {
      type: Object,
      default: () => {}
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      nextStepOptions: [],
      data: [],
      stepData: [],
      cellText: [],
      count: 0,
      isShowPopover: false,
      setTimeoutId: -1,
      mouseLeaveTimeoutId: -1,
      // 当前 popper 的位置信息
      curPopperPos: {
        top: 0,
        left: 0,
        height: 0,
        width: 0
      }
    }
  },
  computed: {
    ...mapGetters(['currentTabIdGetter']),
    displayAttr () {
      // if (!this.tableData || !this.tableData.length) {
      //   return 'none'
      // }
      // // if (this.rowIndex === 0 && (this.tableData[0].step_type === '1' || this.tableData[0].step_type === '8') && (_.isEqual(this.prop, ['step']) || _.isEqual(this.prop, ['department', 'position']) || _.isEqual(this.prop, ['document']))) {
      // if (this.rowIndex === this.tableData.length - 2 && this.tableData[this.tableData.length - 2].id === -999) {
      //   // last row forbidden rule
      //   return 'block'
      //   // } else if (this.rowIndex === this.tableData.length - 2 && (_.isEqual(this.prop, ['step']) || _.isEqual(this.prop, ['department', 'position']) || _.isEqual(this.prop, ['document']))) {
      // } else {
      //   return 'none'
      // }
      if (this.row.id === -999) {
        return 'block'
      } else {
        return 'none'
      }
    }
  },
  watch: {
    // 暂时删除 row watcher
    row: {
      handler () {
        this.dataFilter()
        this.$nextTick(t => {
          this.handlePopoverHide() // 加载时主动调用, 回显 cell text
        })
      },
      deep: true
    }
  },
  mounted () {
    this.dataFilter()
    this.$nextTick(t => {
      this.handlePopoverHide() // 加载时主动调用, 回显 cell text
    })
  },
  beforeDestroy () {
    document.removeEventListener('mousedown', this.popperDocumentMouseDownHandler)
  },
  methods: {
    dataFilter () {
      let nextStepOptions = []
      this.tableData.forEach((item, i, arr) => {
        // 下一步骤是结束, ok, 不用验证
        // if (item.id === -999) {}
        // if (i === arr.length - 2) {
        //   nextStepOptions.push({
        //     id: item.id,
        //     no: item.no,
        //     step: item.step
        //   })
        //   return false
        // }
        // 如果编号为空, 不允许作为下一步骤
        if (!item['no']) {
          return false
        }
        // 步骤为空, 也不允许
        // if (!item['step']) {
        //   return false
        // }
        if (item.id === 'global_remark') {
          return false
        }
        if (!item.hasOwnProperty('no')) {
          return false
        }
        // 自己的条件不允许时也不允许选择
        // if (!this.row.no && !this.row.step) {
        //   return false
        // }
        // 自己行不允许
        if (this.row.id === item.id) {
          return false
        }
        // 下一步骤是开始也不行
        // if (i === 0 && (this.tableData[0].step_type === '1' || this.tableData[0].step_type === '8')) {
        //   return false
        // }
        nextStepOptions.push({
          id: item.id,
          no: item.no,
          step: item.step
        })
      })
      this.nextStepOptions = nextStepOptions
    },
    handleStepChange (stepData) {
      this.stepData = stepData
    },
    handlePopoverHide () {
      // 接收到更新的 step data 之后, 要更新单元格内容
      let _temp = []
      this.stepData.forEach(item => {
        if (item.checked) {
          _temp.push(`${item.no}  ${item.description}`)
        }
      })
      this.cellText = _temp
    },
    handlePopoverShow () {
      this.dataFilter()
    },
    handleMouseEnter () {
      if (this.mouseLeaveTimeoutId !== -1) {
        return false
      }
      console.log('mouse enter handled')
      clearTimeout(this.setTimeoutId)
      this.isShowPopover = true
    },
    handleMouseLeave () {
      this.removeEventListenerToPopovers()
      this.isShowPopover = false
      clearTimeout(this.mouseLeaveTimeoutId)
      this.mouseLeaveTimeoutId = setTimeout(() => {
        this.mouseLeaveTimeoutId = -1
      }, 500)
    },
    togglePopover () {
      if (this.isShowPopover) {
        return
      }
      this.isShowPopover = true
      this.$nextTick(() => {
        const el = document.body.querySelectorAll('.next-step-popper' + this.row.id)
        const popper = Array.prototype.find.call(el, item => item.style.display !== 'none')
        this.curPopperPos.top = popper.offsetTop
        this.curPopperPos.left = popper.offsetLeft
        this.curPopperPos.height = popper.offsetHeight
        this.curPopperPos.width = popper.offsetWidth
        document.addEventListener('mousedown', this.popperDocumentMouseDownHandler)
      })
      // this.addEventListenerToPopovers()
      // if (this.isShowPopover) {
      //   this.setTimeoutId && clearTimeout(this.setTimeoutId)
      //   this.setTimeoutId = setTimeout(() => {
      //     this.isShowPopover = false
      //     this.removeEventListenerToPopovers()
      //   }, 1500)
      // }
    },
    // addEventListenerToPopovers () {
    //   let popovers = document.getElementsByClassName('el-popover')
    //   for (let i = 0; i < popovers.length; i++) {
    //     popovers[i].addEventListener('mouseenter', this.handleMouseEnter)
    //     // popovers[i].addEventListener('mouseleave', this.handleMouseLeave)
    //   }
    // },
    // removeEventListenerToPopovers () {
    //   let popovers = document.getElementsByClassName('el-popover')
    //   for (let i = 0; i < popovers.length; i++) {
    //     popovers[i].removeEventListener('mouseenter', this.handleMouseEnter)
    //     popovers[i].removeEventListener('mouseleave', this.handleMouseLeave)
    //   }
    // },
    /**
     * popper 显示出时 给 document 添加的 mousedown 事件的 handler
     * @param event
     */
    popperDocumentMouseDownHandler (event) {
      // 只监听左键
      if (event.button !== 0) {
        return
      }
      // x y stands for mouse pos
      const x = event.x
      const y = event.y
      if (
        x > this.curPopperPos.left &&
        x < this.curPopperPos.left + this.curPopperPos.width &&
        y > this.curPopperPos.top &&
        y < this.curPopperPos.top + this.curPopperPos.height
      ) {
        // return
      } else {
        // 点击外部了, 因此关闭框, 且清除事件监听
        document.removeEventListener('mousedown', this.popperDocumentMouseDownHandler)
        this.isShowPopover = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cell-popover {
  min-width: 79px;
  .mask-for-disabled {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent;
    cursor: not-allowed;
    z-index: 100;
  }
}
</style>
<style lang="scss">
</style>
