<template>
  <div id="download-template">
    <table>
      <tr v-if="number > 1">
        <td class="text-right">选中模板数：</td>
        <td class="text-left">{{number}}</td>
      </tr>
      <tr v-else>
        <td class="text-right">模板名：</td>
        <td class="text-left">会议费用报销流程模板</td>
      </tr>
      <tr>
        <td class="text-right">模板格式：</td>
        <td class="text-left">Excel工作簿 （*.xlsx）</td>
      </tr>
    </table>
    <p>
      <el-checkbox v-model="mergeList" label="yes">将所有选中模板集成下载到同一Excel文件中</el-checkbox>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    number: Number
  },
  data () {
    return {
      mergeList: []
    }
  }
}
</script>

<style lang="scss" scoped>
#download-template{
  table{
    width: 320px;
    margin-left: auto;
    margin-right: auto;
    .text-right{
      text-align: right;
      padding-right: 20px;
    }
    .text-left{
      text-align: left;
      padding-left: 20px;
    }
  }
  >p{
    margin-top: 20px;
  }
}
</style>
