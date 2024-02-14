<template>
  <div id="custom-paginator">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      popper-class="custom-paginator-popper-class"
      :current-page.sync="page"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      :layout="layout"
      :total="total"
      background>
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  data () {
    return {
      total: 0,
      pagesizes: [10, 20, 30, 40],
      pagesize: 10,
      page: 1
    }
  },
  methods: {
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.page = 1
      this.$emit('pageChange', { pagesize: this.pagesize, page: this.page })
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.page = val
      this.$emit('pageChange', { pagesize: this.pagesize, page: this.page })
    },
    updatePage (pagesize, page, pagesizes) {
      this.pagesize = pagesize
      this.pagesizes = pagesizes
      this.page = Number(page)
    },
    updateTotal (total) {
      this.total = total
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
#custom-paginator{
  padding-top: 10px;
}
</style>
<style lang="scss">
@import '@/styles/index.scss';
#custom-paginator{
  .el-pagination{
    // font-size: 12px !important;
    .el-pagination__total{
      // font-size: 12px !important;
    }
    .el-input__inner{
      line-height: 28px;
      height: 28px;
    }
    .el-pagination__jump{
      .el-input{
        width: 50px;
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
