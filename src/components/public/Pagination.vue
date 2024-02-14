<template>
  <div class="pagination">
    <!-- <el-pagination
      type="manual"
      layout='sizes, prev, pager, next, ->, total'
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :hide-on-single-page="false"
      @size-change="sizeChange"
      @current-change="currentChange"
      :total="totalNum"
      :current-page="pageNum"
    /> -->
    <el-pagination
      @size-change="sizeChange"
      :hide-on-single-page="false"
      @current-change="currentChange"
      popper-class="custom-paginator-popper-class"
      :current-page.sync="pageNum"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum"
      background>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: { type: [Number, String], default: 0 },
    pageSize: { type: Number, default: 15 },
    pageNum: { type: Number, default: 1 }
  },
  data () {
    return {
      pageSizes: [10, 20, 30, 40]
    }
  },
  computed: {
    totalNum () {
      return parseInt(this.total)
    }
  },
  created () {
  },
  methods: {
    handleChange (params) {
      this.$emit('change', params)
    },

    /** change page size */
    sizeChange (val) {
      this.handleChange({
        total: this.totalNum,
        pageSize: val,
        pageNum: 1
      })
    },

    /** change current page */
    currentChange (val) {
      this.handleChange({
        total: this.totalNum,
        pageSize: this.pageSize,
        pageNum: val
      })
    }
  },
  watch: {
    // 假如第二页只有一条数据，此时删除该数据，应该跳转到前一页
    total (newVal, oldVal) {
      if (this.pageNum > 1 && (oldVal - newVal === 1) && (newVal % this.pageSize === 0)) {
        this.currentChange(this.pageNum - 1)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
.pagination{
  padding-top: 10px;
}
</style>

<style lang="scss">
.pagination{
  .el-pagination{
    // font-size: 12px !important;
    .el-pagination__total{
      // font-size: 12px !important;
    }
    .el-select{
      .el-input{
        height: auto!important;
        width: 100px!important;;
      }
    }
    .el-input__inner{
      line-height: 28px;
      height: 28px;
    }
    .el-pagination__jump{
      .el-input{
        width: 50px!important;
      }
    }
  }
}
.custom-paginator-popper-class.el-popper{
  min-width: 100px !important;
  .el-select-dropdown__wrap{
    margin-bottom: 0 !important;
    padding: 5px 0 !important;
    li{
      padding: 0 2px !important;
      height: 24px !important;
      line-height: 24px !important;
      font-size: 12px !important;
      text-align: center !important;
    }
  }
}
</style>
