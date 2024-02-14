<template>
  <div id="delete-tmp" class="clearfloat">
    <div class="delete-left">
      <i class="el-icon-warning-outline"></i>
    </div>
    <div class="delete-right">
      <p>您是否要删除模板文件{{templateName}}</p>
      <p>删除后无法恢复，请谨慎操作！</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    templateName: String
  }
}
</script>

<style lang="scss" scoped>
  #delete-tmp{
    width: 400px;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    .delete-left{
      float: left;
      i{
        font-size: 40px;
        line-height: 60px
      }
    }
    .delete-right{
      padding-left: 50px;
      float: left;
      text-align: left;
      line-height: 30px;
    }
  }
</style>
