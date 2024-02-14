<template>
  <div class="comp-arrows">
    <i class="el-icon el-icon-caret-right directive-arrow" :class="arrowClassComputed"></i>
    <i title="建议从此处分页" class="iconfont iconkuayeyinyong" v-if="isShowCrossPageTag"></i>
  </div>
</template>

<script>
export default {
  filters: {
    directiveArrowClassFilter ({ arrowsIndex, arrowsSelf }) {
    }
  },
  props: {
    multiSelectedList: {
      type: Array,
      default: () => []
    },
    rowId: {
      type: [Number, String]
    },
    rowStepNo: {
      type: [Number, String]
    },
    rowIndex: {
      type: Number
    },
    maxLength: {
      type: Number
    },
    breakRowId: {
      type: [Number, String]
    }
  },
  computed: {
    arrowClassComputed () {
      if (this.multiSelectedList.findIndex(item => item === this.rowId) !== -1) {
        return 'currentArrow'
      } else if (this.rowIndex === 0) {
        return 'beginRowArrow'
      } else if (this.rowIndex === this.maxLength - 2) {
        return 'endRowArrow'
      } else {
        return 'defaultRowArrow'
      }
    },
    isShowCrossPageTag () {
      // 判断 id 是否相等, 从而正确显示分页符
      return this.rowId + '' === this.breakRowId + ''
    }
  }
}
</script>
<style lang="scss" scoped>
.comp-arrows{
  .beginRowArrow,
  .endRowArrow {
    color: #E6A23C;
  }
  .currentArrow {
    color: #409EFF;
    transform: scale(1.5);
  }
  .defaultRowArrow {
    color: #67C23A;
  }
  .iconkuayeyinyong{
    color: #E6A23C;
  }
}
</style>
