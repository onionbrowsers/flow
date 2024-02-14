<template>
  <el-select
    v-model="stepType"
    placeholder="请选择"
    @change="handleChange()"
    class="cell-dropdown"
    :disabled="$store.getters.disabledGetter"
    popper-class="cell-dropdown"
    size="small"
  >
    <el-option
      v-for="item in computedStepType"
      :key="item.type"
      :label="item.label"
      :value="item.type">
      <i style="float: left" :class="'iconfont ' + item.icon"></i>
      <span style="float: left; padding-left: 8px;">
        {{ item.label }}
      </span>
    </el-option>
    <i :class="'iconfont ' + computedCurIcon + ' prefix-icon'" slot="prefix"></i>
  </el-select>
</template>

<script>
import { mapStepType } from '../../init-data/init-config'
export default {
  name: 'cell-dropdown',
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
    colIndex: {
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
      nextStepValue: '',
      stepType: ''
    }
  },
  computed: {
    // 根据行判断需要显示的步骤类型
    computedStepType () {
      // 最后一行数据, 因为添加了备注行, 要修改选项
      if (this.row.id === -999) {
        // return mapStepType.filter(item => {
        //   return item.type === '7' || item.type === '5' || item.type === '6'
        // })
        return mapStepType.filter(item => item.type !== '1')
      } else if (this.rowIndex === 0) {
        if (this.row.no === '0') {
          return mapStepType.filter(item => item.type === '1' || item.type === '6')
        } else {
          // (this.row.no === '1')
          // 第一行可以是子流程
          // return mapStepType.filter(item => item.type !== '7' && item.type !== '5')
          return mapStepType.filter(item => item.type !== '7')
        }
        // return mapStepType.slice(0, mapStepType.length - 1)
        // } else if (this.rowIndex === this.tableData.length - 2) {
      } else {
        // return mapStepType.filter(item => item.type !== '7' && item.type !== '6' && item.type !== '1')
        return mapStepType.filter(item => item.type !== '1')
      }
    },
    computedCurIcon () {
      let curStepType = mapStepType.find(item => item.type === this.stepType)
      return curStepType ? (curStepType.icon ? curStepType.icon : '') : ''
    }
  },
  watch: {
    row: {
      handler () {
        this.nextStepValue = ''
        this.stepType = ''
        this.initStepType()
      },
      deep: true
    }
  },
  created () {
  },
  mounted () {
    this.initStepType()
  },
  methods: {
    initStepType () {
      if (!this.row.step_type) {
      } else {
        // 复显 stepType
        // 1. 如果第一行, 图形为 开始或结束, 置为开始
        if (this.rowIndex === 0 && this.row.step_type === '1') {
          this.stepType = '1'
          // 2. 如果不是 第一行, 即结束行, 置为结束
        } else if (this.rowIndex !== 0 && this.row.step_type === '1') {
          this.stepType = '7'
          // 3. 如果都不是, 即遍历配置文件, 找到合适的 step_type
        } else {
          let thisStepType = ''
          for (let item of mapStepType) {
            if (this.row.step_type === item.shapeType) {
              thisStepType = item.type
            }
          }
          this.stepType = thisStepType
        }
      }
    },
    handleChange () {
      // 保存 shapeType
      let thisShape = ''
      if (this.rowIndex === 0) {
        // if this.row is the FIRST ROW
        if (this.stepType === '1') {
          // if the step type is START
          // change the STEP DESCRIPTION to '开始'
          this.$store.commit('HANDLE_EDIT', { rowIndex: this.rowIndex, prop: 'step', value: '开始' })
        } else if (this.stepType === '6') {
          // if the step type is CROSS PAGE QUOTE
          // change the STEP DESCRIPTION to '跨页引用'
          this.$store.commit('HANDLE_EDIT', { rowIndex: this.rowIndex, prop: 'step', value: '接上页' })
        } else {}
      }
      // 结束行规则
      // if (this.rowIndex === this.tableData.length - 2) {
      // if (this.row.id === -999) {
      //   // if (this.stepType === '5') {
      //   //   this.$store.commit('HANDLE_EDIT', { rowIndex: this.rowIndex, prop: 'step', value: '子流程' })
      //   // } else
      //   if (this.stepType === '6') {
      //     this.$store.commit('HANDLE_EDIT', { rowIndex: this.rowIndex, prop: 'step', value: '接下页' })
      //   } else if (this.stepType === '7') {
      //     this.$store.commit('HANDLE_EDIT', { rowIndex: this.rowIndex, prop: 'step', value: '结束' })
      //   } else {}
      // }
      if (this.stepType === '7') {
        this.$store.commit('HANDLE_EDIT', { rowIndex: this.rowIndex, prop: 'step', value: '结束' })
      }
      if (this.stepType === '5') { // 子流程
        this.$emit('select-flow-page', { rowIndex: this.rowIndex, prop: 'step' })
      }
      for (let item of mapStepType) {
        if (this.stepType === item.type) {
          thisShape = item.shapeType
        }
      }
      this.$store.commit('HANDLE_EDIT', { rowIndex: this.rowIndex, prop: this.prop[0], value: thisShape })
    }
  }
}
</script>

<style lang="scss" scoped>
.cell-dropdown {
  height: 100%;
  width: 100%;
  .prefix-icon {
    display: inline-block;
  }
}
</style>
<style lang="scss">
.el-input__prefix {
  padding-left: 5px;
  line-height: 33px;
  color: #666;
}
</style>

<style lang="scss">
.cell-dropdown {
  .el-select-dropdown__list {
    /*padding-bottom: 22px !important;*/
  }
}
</style>
