<template>
  <div id="custom-pagina">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      popper-class="custom-pagina-popper-class"
      :current-page.sync="page"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      :layout="layout"
      :total="tolital"
      background>
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    tolital: {
      type: Number,
      default: 0
    },
    nowpage: {
      type: Number,
      default: 1
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  watch: {
    nowpage () {
      this.page = this.nowpage
    }
  },
  data () {
    return {
      pagesizes: [15, 30, 50],
      pagesize: 15,
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
      console.log('www', val)
      this.$emit('pageChange', { pagesize: this.pagesize, page: this.page })
    },
    updatePage (pagesize, page, pagesizes) {
      this.pagesize = pagesize
      this.pagesizes = pagesizes
      this.page = Number(page)
    },
    updateTotal (total) {
      this.tolital = total
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
#custom-pagina{
  padding-top: 10px;
}
</style>
<style lang="scss">
@import '@/styles/index.scss';
#custom-pagina{
  .el-pagination{
    // font-size: 12px !important;
    .el-pagination__total{
      // font-size: 12px !important;
    }
  }
}
.custom-pagina-popper-class.el-popper{
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
