<template>
  <div id="quota-mng-admin">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="额度管理" name="quotaMng">
        <el-tabs v-model="quotaMngActiveName">
          <el-tab-pane label="自定义充值" name="cusRecharge">
            <custom-recharge></custom-recharge>
          </el-tab-pane>
          <el-tab-pane label="企业套餐" name="businessPack">
            <enterprise-package></enterprise-package>
          </el-tab-pane>
          <el-tab-pane label="企业管理" name="businessMng">
            <business-mng v-if="quotaMngActiveName === 'businessMng'" @purchaseRecord="checkPurchaseRecord"></business-mng>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="额度购买记录" name="quotaRecord">
        <quota-purchase-record v-if="activeName === 'quotaRecord'" :company="company" @resetCompany="handleReset"></quota-purchase-record>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import customRecharge from './custom-recharge'
import enterprisePackage from './enterprise-package'
import businessMng from './business-mng'
import quotaPurchaseRecord from './quota-purchase-record'
export default {
  components: {
    customRecharge,
    enterprisePackage,
    businessMng,
    quotaPurchaseRecord
  },
  data () {
    return {
      company: null,
      activeName: 'quotaMng',
      quotaMngActiveName: 'cusRecharge'
    }
  },
  methods: {
    handleClick (tab, event) {
      // console.log(tab, event)
    },
    checkPurchaseRecord (company) {
      this.activeName = 'quotaRecord'
      this.company = company
    },
    handleReset () {
      this.company = null
    }
  }
}
</script>

<style lang="scss" scoped>
#quota-mng-admin{
  background: #fff;
  padding: 10px;
  border-radius: 8px;
}
</style>

<style lang="scss">
</style>
