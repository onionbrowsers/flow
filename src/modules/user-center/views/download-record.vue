<template>
  <div id="download-record">
    <b-layout mode="horizontal" placement="left" :space="companyListSpace" :border="false">
      <company-list slot="first" @select="handleCompanySelect"/>
      <b-layout slot="last" mode="vertical" placement="top" space="70px" :border="false">
        <download-total-bar slot="first" :totalInfo="totalInfo"/>
        <download-list slot="last" ref="downloadList" :records="records" @page-changed="handlePageChanged"/>
      </b-layout>
    </b-layout>
  </div>
</template>

<script>
import BLayout from '@/layouts/BinaryLayout'
import companyList from '../components/download-record/company-list'
import downloadTotalBar from '../components/download-record/download-total-bar'
import downloadList from '../components/download-record/download-list'
import { mapGetters } from 'vuex'
export default {
  components: {
    BLayout,
    companyList,
    downloadTotalBar,
    downloadList
  },
  data () {
    return {
      totalInfo: {},
      records: [],
      currentCompany: {}
    }
  },
  computed: {
    ...mapGetters({
      company: 'currentDataSpaceGetter',
      userInfo: 'userInfo'
    }),
    quotaManager () {
      return this.userInfo.user_role === 'QuotaManager'
    },
    companyListSpace () {
      return this.quotaManager ? '200px' : '0px'
    }
  },
  mounted () {
    this.currentCompanySpace()
  },
  methods: {
    currentCompanySpace () {
      // 计时器，页面刷新场景下等待网络请求获取到userInfo，等待5s
      let _intervalId = setInterval(() => {
        if (Object.keys(this.userInfo).length) {
          if (this.quotaManager) {
            return
          }
          if (this.company.id) {
            let _company = {
              company_name: this.company.name,
              company_id: this.company.id
            }
            this.handleCompanySelect(_company)
            clearInterval(_intervalId)
          }
        }
      }, 200)
      setTimeout(() => {
        _intervalId && clearInterval(_intervalId)
      }, 5000)
    },
    configDateVisible () {
      // 更新date_visible，控制日期是否显示
      let tmpDate = ''
      this.records.map((item) => {
        if (tmpDate !== item.download_date) {
          tmpDate = item.download_date
        } else {
          item.download_date = ''
        }
      })
    },
    repackRecords (dataList) {
      let _keys = Object.keys(dataList)
      let _records = []
      for (let i = 0; i < _keys.length; i++) {
        let _key = _keys[i]
        let groupByDate = dataList[_key]
        for (let j = 0; j < groupByDate.length; j++) {
          let _item = {
            download_date: _key,
            download_log: groupByDate[j]
          }
          _records.push(_item)
        }
      }
      return _records
    },
    getRecords (params) {
      this.$api.getDownloadRecords(params).then(res => {
        this.totalInfo = res.data // 顶部显示的该企业空间的汇总信息
        this.totalInfo.company_name = this.currentCompany.company_name
        if (!res.data.items) {
          this.records = []
          return
        }
        this.records = this.repackRecords(res.data.items)
        this.configDateVisible()
        let _page = res.data.page
        this.$refs.downloadList.updatePageInfo(_page.total, _page.page)
      }).catch(err => {
        this.$msgMnger.httpError(err)
        this.records = []
        this.totalInfo = {}
      })
    },
    handleCompanySelect (company) {
      this.currentCompany = company
      let params = { company_id: company.company_id, page: 1, pagesize: 10 }
      this.getRecords(params)
    },
    handlePageChanged (page) {
      let params = { company_id: this.currentCompany.company_id, page: page.page, pagesize: page.pagesize }
      this.getRecords(params)
    }
  }
}
</script>

<style lang="scss" scoped>
#download-record{
  height: 100%;
}
</style>

<style lang="scss">
</style>
