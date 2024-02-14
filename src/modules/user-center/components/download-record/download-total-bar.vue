<template>
  <el-row id="download-total-bar">
    <el-col :span="6">当前企业：{{totalInfo.company_name || '--'}}</el-col>
    <span>下载：{{totalInfo.download_times || 0}}次</span>
    <span>总额度：{{totalInfo.total_numbers || 0}}次</span>
    <span>已用额度：{{totalInfo.used_numbers || 0}}次</span>
    <span>剩余额度：{{totalInfo.last_numbers || 0}}次</span>
  </el-row>
</template>

<script>
export default {
  props: {
    totalInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#download-total-bar{
  text-align: left;
  height: 70px;
  line-height: 70px;
  padding: 0 30px;
  .el-col{
    font-size: 13px;
  }
  span{
    margin-right: 30px;
    font-size: 13px;
  }
}
</style>
