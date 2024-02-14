<template>
  <div
    id="leave-edit"
    style="padding: 15px 0;"
  >
    <p>是否在保存页面前保存修改</p>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="giveUp">放弃修改</el-button>
      <el-button size="mini" type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: true
    }
  },
  methods: {
    giveUp () {
      this.$router.push('/')
    },
    save () {
      this.$emit('save-before-leave')
    }
  }
}
</script>

<style lang="scss" scoped>
  #leave-edit{
    /*padding: 15px 0;*/
    >p{
      padding-left: 60px;
      font-size: 14px;
      text-align: left
    }
    .dialog-footer{
      text-align: right;
      margin-top: 30px;
      padding-right: 40px;
    }
  }
</style>
