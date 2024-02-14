<template>
  <div id="flowfile-download-dialog">
    <custom-dialog
      ref="downloadDialog"
      width="800px"
      :title="dlgConfig.title"
      customClass="flowfile-download-dialog-class"
      :button1="dlgConfig.btn1"
      :button2="dlgConfig.btn2"
      :showClose="true"
      @clickBtn1="handleClickBtn1"
      @clickBtn2="handleClickBtn2"
    >
    <div slot="part4" class="flowfile">
      <span>文件：{{filename}} </span>
      <span class="service-paused" v-if="isServiceStoped()">下载服务已暂停，请联系管理员。</span>
      <span class="service-paused" v-else-if="isNeedConsumeAndExpired()">下载额度已过期，请联系管理员。</span>
      <span class="service-paused" v-else-if="isNeedCharge()">下载额度不足，请充值后下载。</span>
    </div>
    <tabs-select slot="part0" :tabOptions="tabOptions" ref="tabsSelect" @checked-change="handleCheckedChange"/>
    <count-info slot="part1" :total="total" :consume="consume"/>
    <types-select slot="part2" ref="typesSelect" @typeChanged="handleTypeChanged"/>
    <download-statement slot="part3"/>
    </custom-dialog>
  </div>
</template>

<script>
import CustomDialog from '@/components/public/CustomDialog'
import TabsSelect from './flowfile-download-comps/tabs-select'
import CountInfo from './flowfile-download-comps/count-info'
import TypesSelect from './flowfile-download-comps/types-select'
import DownloadStatement from './flowfile-download-comps/download-statement'
import Bus from '@/utils/event-bus.js'
export default {
  props: ['filename'],
  components: {
    CustomDialog,
    TabsSelect,
    CountInfo,
    TypesSelect,
    DownloadStatement
  },
  data () {
    return {
      serviceStatus: 1, // 空间下载服务的状态：0-开启，1-关闭
      expireStatus: 1, // 空间下载服务是否过期：0-正常，1-过期
      dlgConfig: {
        title: '下载',
        btn1: { title: '取 消' },
        btn2: { title: '确 定', disabled: true }
      },
      total: 0,
      consume: 0,
      tabOptions: []
    }
  },
  computed: {
    sureButtonDisabled () {
      return this.isServiceStoped() || this.isNeedConsumeAndExpired() || this.isNeedCharge() || !this.$refs.tabsSelect.checkedTabs.length
    }
  },
  watch: {
    sureButtonDisabled: {
      handler (val) {
        this.dlgConfig.btn2.disabled = val
      }
    }
  },
  methods: {
    show (flowId, companyId) {
      this.tabOptions = []
      this.$refs.downloadDialog.updateVisible(true, {})
      let params = {
        flow_id: flowId,
        company_id: companyId
      }
      this.$api.accountBilling(params).then(res => {
        let data = res.data
        this.total = data.last_number
        this.tabOptions = data.sheet_list
        this.serviceStatus = data.acount_status
        this.expireStatus = data.expire_satus
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    updateCountAndConsume (checkedTabs) {
      let _needConsumeTabs = checkedTabs.filter(e => {
        return e.version === 1 // 未计费，用于表示首次下载，或者经修改后选择下载时需要重复计费
      })
      this.consume = _needConsumeTabs.length
    },
    isServiceStoped () {
      return this.serviceStatus !== 0
    },
    isNeedConsumeAndExpired () {
      // 额度过期情况下，如果选项不计费则允许下载，如果选项计费则不允许下载
      return this.consume > 0 && this.expireStatus !== 0
    },
    isNeedCharge () {
      return this.total < this.consume
    },
    handleCheckedChange (checkedTabIds) {
      if (this.$refs.typesSelect.downloadType === 'vsdx') {
        if (this.tabOptions.length !== checkedTabIds.length) {
          this.$msgMnger.warn('vsdx格式仅支持全部选中下载')
          this.$refs.tabsSelect.checkAll = true
          this.$refs.tabsSelect.handleCheckAllChange(true)
          return
        }
      }
      let _checkedTabs = this.tabOptions.filter(e => {
        return checkedTabIds.indexOf(e.id) > -1
      })
      this.updateCountAndConsume(_checkedTabs)
    },
    handleTypeChanged (type) {
      if (type === 'vsdx') {
        this.$refs.tabsSelect.checkAll = true
        this.$refs.tabsSelect.handleCheckAllChange(true)
      }
    },
    handleClickBtn1 () {
    },
    handleClickBtn2 () {
      // console.log('sure to download', this.$refs.tabsSelect.checkedTabs, this.$refs.typesSelect.downloadType)
      // vsdx pdf docx
      if (!this.$refs.tabsSelect.checkedTabs.length) {
        this.$msgMnger.warn('请先选择要下载的流程图')
        return
      }
      if (this.isNeedCharge()) {
        this.$msgMnger.warn('额度不足，请充值后下载')
        return
      }
      let tabIndexes = [] // 获取tab的索引，用于drawio导出png时切换tab页
      this.tabOptions.forEach((el, index) => {
        if (this.$refs.tabsSelect.checkedTabs.indexOf(el.id) > -1) {
          tabIndexes.push(index)
        }
      })
      this.consume = 0
      Bus.$emit('download-confirm', { tabIds: this.$refs.tabsSelect.checkedTabs, tabIndexes: tabIndexes, format: this.$refs.typesSelect.downloadType })
    }
  }
}
</script>

<style lang="scss">
#flowfile-download-dialog{
}
.flowfile-download-dialog-class{
  &.el-dialog{
    .el-dialog__body{
      padding: 15px 20px !important;
      .flowfile{
        font-weight: bold;
        .service-paused{
          color: red;
          float: right;
        }
      }
    }
  }
}
</style>
