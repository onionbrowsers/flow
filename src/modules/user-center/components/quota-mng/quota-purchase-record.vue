<template>
  <div id="quota-purchase-record">
    <div class="filter-div">
      <el-input
        size="small"
        placeholder="搜索购买单位/企业名称"
        v-model="name"
        clearable
        @keyup.enter.native="searchClick"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
      </el-input>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        v-for="(item, index) in tableColumn" :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.minWidth"
        :formatter="item.formatter || null">
      </el-table-column>
    </el-table>
    <custom-paginator
      ref="paginator"
      @pageChange="handlePageChange"
      @handleSizeChange="handlePageChange"
    ></custom-paginator>
  </div>
</template>

<script>
import CustomPaginator from '@/components/public/CustomPaginator'
export default {
  props: ['company'],
  components: {
    CustomPaginator
  },
  data () {
    return {
      tableData: [],
      tableColumn: [
        {
          prop: 'company_name',
          label: '购买单位',
          minWidth: 100
        },
        {
          prop: 'create_time',
          label: '购买时间',
          minWidth: 200
        },
        {
          prop: 'buy_numbers',
          label: '购买额度（张）',
          minWidth: 200
        },
        {
          prop: 'real_amt',
          label: '支付金额（￥）',
          minWidth: 100
        },
        {
          prop: 'order_state',
          label: '订单状态',
          minWidth: 100,
          formatter: (row, column, cellValue, index) => {
            if (cellValue === 1) {
              return '交易取消'
            }
            return '交易成功'
          }
        }
      ],
      name: '',
      paginator: {
        page: 1,
        pagesize: 10
      }
    }
  },
  mounted () {
    if (this.company) {
      this.name = this.company.name
      this.getAcountCharges(this.company.id)
      return
    }
    this.getAcountCharges()
  },
  methods: {
    searchClick () {
      this.getAcountCharges()
    },
    getAcountCharges (id) {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.tableData = []
      let params = {
        page: this.paginator.page,
        pagesize: this.paginator.pagesize
      }
      if (this.name) {
        params.company_name = this.name
      }
      if (id) {
        params.company_id = id
      }
      this.$emit('resetCompany')
      this.$api.getAcountCharges(params).then(res => {
        this.tableData = res.data.data
        this.$refs['paginator'].updateTotal(res.data.total)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(e => {
        this.tableData = []
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    handlePageChange (e) {
      this.paginator = e
      this.$nextTick(() => {
        this.getAcountCharges()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#quota-purchase-record{
  .filter-div{
    text-align: left;
    .el-input{
      width: 300px;
    }
  }
}
</style>

<style lang="scss">
#quota-purchase-record .el-table .el-table__body-wrapper{
  height: calc(100vh - 285px) !important;
  overflow-y: auto;
}
#quota-purchase-record .el-table {
  height: auto !important;
}
</style>
