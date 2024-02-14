<template>
  <div id="joined-enterprises">
    <div class="table">
      <el-table
        :data="tableData"
        :header-cell-style="tableHeader"
        :cell-style="cellStyle"
        :row-style="rowStyle"
        style="width: 100%">
        <el-table-column
          :prop="v.prop"
          :width="v.width"
          :label="v.label" v-for="(v,i) in tableHeaderTxt" :key="i">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="{ row }">
            <slot name="btn1" :row="row"></slot>
            <slot name="btn2"></slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'joined-enterprises',
  components: {

  },
  filters: {

  },
  props: {
    tableData: {
      type: Array
    },
    tableHeaderTxt: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  computed: {

  },
  watch: {

  },
  created () {

  },
  mounted () {

  },
  activated () {

  },
  beforeDestroy () {

  },
  methods: {
    tableHeader () {
      return 'background:#FAFAFA;font-size:14px;color:rgba(0,0,0,0.85);height:54px;font-weight:600;border-bottom:none;padding-left:24px;'
    },
    cellStyle () {
      return 'font-size:14px;color:color:rgba(0,0,0,0.65);height:54px;padding-left:24px;'
    },
    rowStyle () {
      return 'border-bottom:#E8E8E8;'
    }
  }
}
</script>

<style lang="scss" scoped>
  #joined-enterprises{
    box-sizing: border-box;
    background: white;
    height: calc(100% - 66px);
    .table{
      height: 100%;
    }
  }
</style>
<style lang="scss">
  #joined-enterprises{
    .cell{
      padding: 0;
    }
    .is-left{
      padding-left: 0 !important;
    }
    .el-table{
      overflow: auto !important;
      height: auto !important;
    }
  }
</style>
