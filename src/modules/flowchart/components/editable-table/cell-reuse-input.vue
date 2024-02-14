<template>
  <div class="cell-duo-input">
<!--    v-mask="{ _self: _self, pos: ['end'], rowIndex: rowIndex, props: prop }"-->
<!--      部门岗位组件添加 autocomplete 功能-->
    <div
      class="mask-for-disabled"
      :style="{ display: 'none' }"
    >
    </div>
    <div
      class="cell-sub-container"
      v-for="(item, i) in prop"
      :key="item + i"
      v-progressive="{ _self, prop: item }"
    >
      <comp-input
        :table-data="tableData"
        :prop="item"
        :row="row"
        :placeholder-data="placeholderData"
        :row-index="rowIndex"
      ></comp-input>
    </div>
  </div>
</template>

<script>
import CompInput from './comp-input'
// import _ from 'lodash'
export default {
  name: 'cell-duo-input',
  components: {
    CompInput
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
    }
  },
  computed: {
    // displayAttr () {
    //   if (!this.tableData || !this.tableData.length) {
    //     return 'none'
    //   }
    //   // if (this.rowIndex === 0 && (this.tableData[0].step_type === '1' || this.tableData[0].step_type === '8') && (_.isEqual(this.prop, ['step']) || _.isEqual(this.prop, ['department', 'position']) || _.isEqual(this.prop, ['document']))) {
    //   if (this.rowIndex === 0 && (this.tableData[0].step_type === '1' || this.tableData[0].step_type === '8') && (_.isEqual(this.prop, ['step']))) {
    //     // 第一行禁用规则
    //     // 如果 第一行的 step_type 为 开始 或 跨页引用, 则禁用 步骤, 部门岗位, 节点文档框
    //     // 否则 不禁用
    //     return 'block'
    //   // } else if (this.rowIndex === this.tableData.length - 2 && (_.isEqual(this.prop, ['step']) || _.isEqual(this.prop, ['department', 'position']) || _.isEqual(this.prop, ['document']))) {
    //   } else if (this.rowIndex === this.tableData.length - 2 && (_.isEqual(this.prop, ['step']))) {
    //     // 最后一行禁用规则
    //     // return 'block'
    //     return 'none'
    //   } else {
    //     return 'none'
    //   }
    // }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.cell-duo-input {
  /*position: relative;*/
  width: 100%;
  display: flex;
  flex-direction: column;
  .first-container {
    border-top: 1px solid #bbb;
  }
  .cell-sub-container {
    padding: 5px 0;
  }
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
