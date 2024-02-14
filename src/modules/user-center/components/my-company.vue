<template>
  <div id="my-company">
    <el-scrollbar style="height: 100%">
        <div class="company">
          <title-comp txt="我的邀请"></title-comp>
          <joined-enterprises :tableData="receivedList" :tableHeaderTxt="companyTableConfig">
            <template slot-scope="{ row }" slot="btn1">
              <el-button type="primary" class="company-btn" slot="btn1" @click="updateInvitation({ row, status: 3 })">接受邀请</el-button>
              <el-button type="info" class="company-btn" slot="btn2" @click="updateInvitation({ row, status: 4 })">拒绝邀请</el-button>
            </template>
          </joined-enterprises>
        </div>
        <div class="added">
          <title-comp txt="已加入企业/组织"></title-comp>
          <joined-enterprises :tableData="companyDataSpaceGetterComputed" :tableHeaderTxt="addedTableConfig">
            <template slot-scope="{ row }" slot="btn1">
              <el-button type="primary" class="added-btn" @click="toCompany(row)">{{ row.staff_type === 3 ? '查看' : '管理' }}</el-button>
            </template>
          </joined-enterprises>
        </div>
    </el-scrollbar>
  </div>
</template>

<script>
import titleComp from '../../../components/title-comp'
import JoinedEnterprises from './table/joined-enterprises'
import { addedTableConfig, companyTableConfig } from './table/table-config'
import { mapGetters } from 'vuex'
export default {
  name: 'my-company',
  components: {
    titleComp,
    JoinedEnterprises
  },
  filters: {

  },
  props: {

  },
  data () {
    return {
      addedTableConfig: addedTableConfig, // 已加入的企业表格表头
      companyTableConfig: companyTableConfig, // 我的邀请表格表头
      companyTableData: []
    }
  },
  computed: {
    ...mapGetters({
      companyDataSpaceGetter: 'companyDataSpaceGetter',
      receivedList: 'receivedList'
    }),
    companyDataSpaceGetterComputed () {
      return this.companyDataSpaceGetter.map(item => {
        const tmpItem = JSON.parse(JSON.stringify(item))
        tmpItem.add_time = tmpItem.add_time.replace('T', ' ')
        return tmpItem
      })
    }
  },
  watch: {
    companyDataSpaceGetter: {
      handler (val) {
      },
      deep: true
    }
  },
  created () {

  },
  mounted () {
    // 1. 获取受邀列表
    this.$store.dispatch('GET_RECEIVED_LIST', this)
  },
  activated () {

  },
  beforeDestroy () {

  },
  methods: {
    toCompany (row) {
      this.$router.push('/company/company-info/?id=' + row.id)
    },
    /**
     * 更新邀请状态
     * @param row 表行数据
     * @param status 变更状态 3: 接受 4 拒绝
     */
    async updateInvitation ({ row, status }) {
      try {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        // 1. 更新邀请状态
        const res = await this.$api.updateInvitation({ inviterId: row.inviter_id, companyId: row.company_id, status })
        // 2. 给出提醒
        this.$msgMnger.success(res.msg)
        // 3. 获取新的列表
        // await this.getReceivedInvitation()
        // 4. 如果更新为接受状态, 则重新获取全部数据空间
        await this.$store.dispatch('GET_RECEIVED_LIST', this)
        if (status === 3) {
          await this.$store.dispatch('GET_COMPANIES_ACTION', this)
        }
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      } catch (err) {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#my-company {
  height: 100%;
  display: flex;
  flex-direction: column;
  .company{
    .company-btn{
      width: 92px !important;
      height: 32px !important;
      padding: 0;
      line-height: 32px;
      font-size: 14px;
    }
    .company-btn:last-of-type{
      background: #CACACA;
      color: white;
      border: none;
    }
    .company-btn:last-of-type:hover{
      background: #a6a9ad;
      border-color: #a6a9ad;
    }
    .company-btn:last-of-type:active{
      background: #82848a;
      border-color: #82848a;
    }
  }
  .added{
    flex: 1;
    margin-top: 16px;
    .added-btn{
      width:73px !important;
      height:32px !important;
      padding: 0;
      line-height: 32px;
    }
  }
}
</style>

<style lang="scss">
  #my-company{
    .el-scrollbar__view{
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
</style>
