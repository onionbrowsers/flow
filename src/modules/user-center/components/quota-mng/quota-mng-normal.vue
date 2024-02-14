<template>
  <div id="quota-mng-normal">
    <div class="quota-mng-normal-card">
      <div class="quota-mng-normal-card-title">当前额度</div>
      <el-table
        :data="currentQuotaData"
        style="width: 100%"
      >
      <el-table-column
        v-for="(item, index) in currentQuota" :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.minWidth">
      </el-table-column>
      </el-table>
    </div>
    <div class="quota-mng-normal-card" id="quota-mng-normal-card">
      <div class="quota-mng-normal-card-title">额度购买记录</div>
      <el-table
        :data="quotaPurchaseRecordData"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, index) in quotaPurchaseRecord" :key="index"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CustomPaginator from '@/components/public/CustomPaginator'
export default {
  components: {
    CustomPaginator
  },
  data () {
    return {
      currentQuotaData: [],
      quotaPurchaseRecordData: [],
      currentQuota: [
        {
          prop: 'company_name',
          label: '购买单位',
          minWidth: 100
        },
        {
          prop: 'last_buy_time',
          label: '最新购买时间',
          minWidth: 200
        },
        {
          prop: 'total_number',
          label: '累计购买额度（张）',
          minWidth: 150
        },
        {
          prop: 'used_number',
          label: '已用额度（张）',
          minWidth: 120
        },
        {
          prop: 'last_number',
          label: '剩余额度（张）',
          minWidth: 120
        },
        {
          prop: 'total_amt',
          label: '支付金额（￥）',
          minWidth: 120
        }
      ],
      quotaPurchaseRecord: [
        {
          prop: 'company_name',
          label: '购买单位',
          minWidth: 100
        },
        {
          prop: 'update_time',
          label: '购买时间',
          minWidth: 100
        },
        {
          prop: 'buy_numbers',
          label: '购买额度（张）',
          minWidth: 100
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
      paginator: {
        page: 1,
        pagesize: 10
      }
    }
  },
  computed: {
    ...mapGetters({
      currentDataSpaceIdGetter: 'currentDataSpaceIdGetter'
    })
  },
  mounted () {
    this.getChargeTotal()
  },
  watch: {
    currentDataSpaceIdGetter () {
      this.getChargeTotal()
    }
  },
  methods: {
    getChargeTotal () {
      if (this.currentDataSpaceIdGetter < 0) {
        return
      }
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.currentQuotaData = []
      this.quotaPurchaseRecordData = []
      let params = {
        page: this.paginator.page,
        pagesize: this.paginator.pagesize,
        company_id: this.currentDataSpaceIdGetter
      }
      this.$api.getChargeTotal(params).then(res => {
        this.currentQuotaData = [res.data.data]
        this.quotaPurchaseRecordData = res.data.data_list || []
        this.$refs['paginator'].updateTotal(res.data.total)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(e => {
        this.currentQuotaData = []
        this.quotaPurchaseRecordData = []
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    handlePageChange (e) {
      this.paginator = e
      this.$nextTick(() => {
        this.getChargeTotal()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#quota-mng-normal{
  .quota-mng-normal-card{
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
    background: #fff;
    padding-bottom: 10px;
    .quota-mng-normal-card-title{
      background: #00152a;
      color: #fff;
      line-height: 60px;
      padding: 0 20px;
      text-align: left;
    }
  }
}
</style>

<style lang="scss">
#quota-mng-normal #quota-mng-normal-card .el-table .el-table__body-wrapper{
  height: calc(100vh - 435px) !important;
  overflow-y: auto;
}
#quota-mng-normal #quota-mng-normal-card .el-table {
  height: auto !important;
}
</style>
