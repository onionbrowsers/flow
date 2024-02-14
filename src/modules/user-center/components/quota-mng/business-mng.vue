<template>
  <div id="business-mng">
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
        label="购买单位"
        width="240">
        <template slot-scope="scope">
          <span class="company-info-btn" @click="clickName(scope.row)">{{ scope.row.company_name }}</span>
          <i class="company-info-btn" :class="getArrowClass(scope.row)" @click="clickEvent(scope.row)"></i>
          <div class="admin-info" v-show="scope.row.checked">管理员：{{scope.row.adminInfo}}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in tableColumn" :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.minWidth">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <div>
            <el-button @click="putCompanyCharges(scope.row, 1)" size="mini" type="danger" plain :disabled="scope.row.acount_status === 1">暂停服务</el-button>
            <el-button @click="putCompanyCharges(scope.row, 0)" size="mini" type="primary" :disabled="scope.row.acount_status === 0">开启服务</el-button>
          </div>
        </template>
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
  components: {
    CustomPaginator
  },
  data () {
    return {
      tableData: [],
      tableColumn: [
        {
          prop: 'last_buy_time',
          label: '最新购买时间',
          minWidth: 180
        },
        {
          prop: 'end_time',
          label: '额度过期时间',
          minWidth: 180
        },
        {
          prop: 'total_number',
          label: '累计购买额度',
          minWidth: 120
        },
        {
          prop: 'used_number',
          label: '已用额度',
          minWidth: 100
        },
        {
          prop: 'last_number',
          label: '剩余额度',
          minWidth: 100
        },
        {
          prop: 'total_amt',
          label: '支付金额',
          minWidth: 100
        }
      ],
      paginator: {
        page: 1,
        pagesize: 10
      },
      name: ''
    }
  },
  mounted () {
    this.getCompanyCharges()
  },
  methods: {
    getArrowClass (row) {
      return row.checked ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
    },
    searchClick () {
      this.getCompanyCharges()
    },
    getCompanyCharges () {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.tableData = []
      let params = {
        page: this.paginator.page,
        pagesize: this.paginator.pagesize
      }
      if (this.name) {
        params.company_name = this.name
      }
      this.$api.getCompanyCharges(params).then(res => {
        this.tableData = res.data.items
        this.tableData.forEach(el => {
          el.last_number = el.total_number - el.used_number
          el.adminInfo = ''
          el.checked = false
        })
        this.$refs['paginator'].updateTotal(res.data.page.total)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(e => {
        this.tableData = []
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    handlePageChange (e) {
      this.paginator = e
      this.$nextTick(() => {
        this.getCompanyCharges()
      })
    },
    putCompanyCharges (row, status) {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.putCompanyCharges({ company_id: row.company_id, acount_status: status }).then(res => {
        this.$msgMnger.success('修改成功')
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        this.getCompanyCharges()
      }).catch(e => {
        this.$msgMnger.error(e.msg)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      })
    },
    clickName (row) {
      this.$emit('purchaseRecord', { name: row.company_name, id: row.company_id })
    },
    clickEvent (row) {
      if (row.checked) {
        this.updateRowData(row, false)
        return
      }
      this.memberMngList(row.company_id, row)
    },
    memberMngList (cid, row) {
      if (!cid) {
        return
      }
      let _hasAdminInfo = false
      this.tableData.forEach(el => {
        if (el.company_id === cid) {
          if (el.adminInfo) {
            _hasAdminInfo = true
          }
        }
      })
      if (_hasAdminInfo) {
        this.updateRowData(row, true)
        return
      }
      this.$api.memberMngList(cid).then(res => {
        res.data.map(e => {
          if (e.type === 1) {
            let _adminInfo = `${e.username} ${e.phone}`
            this.updateRowData(row, true, _adminInfo)
          }
        })
      }).catch(err => {
        this.$msgMnger.error(err.msg)
      })
    },
    updateRowData (row, checked = false, adminInfo) {
      let _tableData = JSON.parse(JSON.stringify(this.tableData))
      this.tableData = []
      _tableData.forEach(el => {
        if (el.company_id === row.company_id) {
          el.checked = checked
          if (adminInfo) {
            el.adminInfo = adminInfo
          }
        }
      })
      this.tableData = _tableData
    }
  }
}
</script>

<style lang="scss" scoped>
#business-mng{
  .filter-div{
    text-align: left;
    .el-input{
      width: 300px;
    }
  }
  .company-info-btn{
    cursor: pointer;
    &:hover{
      color: #1890FF;
    }
  }
  .admin-info{
    color: darkgray;
  }
}
</style>

<style lang="scss">
#business-mng .el-table .el-table__body-wrapper{
  height: calc(100vh - 335px) !important;
  overflow-y: auto;
}
#business-mng .el-table {
  height: auto !important;
}
</style>
