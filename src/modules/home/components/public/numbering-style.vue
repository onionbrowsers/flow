<template>
  <div class="numbering-style" id="numbering-style">
    <div>默认编号样式</div>
    <div class="numbering-style-item">
      <div>风险点</div>
      <el-radio-group :disabled="currentFolder.orgfinal == 2" v-model="radio1" @change="radio1Change">
        <el-radio label="1" border>
          <div class="numbering-style-lizi">
            <div>R1 -------- </div>
            <div>R2 -------- </div>
            <div>R3 -------- </div>
          </div>
        </el-radio>
        <el-radio label="2" border>
          <div class="numbering-style-lizi">
            <div>1 -------- </div>
            <div>2 -------- </div>
            <div>3 -------- </div>
          </div>
        </el-radio>
      </el-radio-group>
    </div>
    <div class="numbering-style-item">
      <div>控制点</div>
      <el-radio-group :disabled="currentFolder.orgfinal == 2" v-model="radio2" @change="radio2Change">
        <el-radio label="1" border>
          <div class="numbering-style-lizi">
            <div>C1.1 -------- </div>
            <div>C1.2 -------- </div>
            <div>C1.3 -------- </div>
          </div>
        </el-radio>
        <el-radio label="2" border>
          <div class="numbering-style-lizi">
            <div>1 -------- </div>
            <div>2 -------- </div>
            <div>3 -------- </div>
          </div>
        </el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentFolder: {
      default: () => {}
    }
  },
  data () {
    return {
      radio1: '1',
      radio2: '1'
    }
  },
  watch: {
    currentFolder: {
      handler (currentFolder) {
        this.radio1 = currentFolder.risk_config || '1'
        this.radio2 = currentFolder.control_config || '1'
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    radio1Change (e) {
      this.addUpdateConfig()
    },
    radio2Change (e) {
      this.addUpdateConfig()
    },
    addUpdateConfig () {
      let params = {
        risk_config: this.radio1,
        control_config: this.radio2,
        folder_id: this.currentFolder.id
      }
      this.$api.addUpdateConfig(params).then(res => {
        this.$emit('refreshFolderList')
      }).catch(err => {
        console.error(err)
        this.$msgMnger.httpError(err)
        this.$emit('refreshFolderList')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.numbering-style{
  .numbering-style-item{
    padding: 10px;
    margin: 5px 0;
    background: #f7fafd;
    .numbering-style-lizi{
      line-height: 18px;
    }
  }
}
</style>
<style lang="scss">
#numbering-style{
  .el-radio-group{
    margin-top: 10px;
    .el-radio{
      height: auto !important;
      width: 100px;
      padding: 10px !important;
      margin-right: 0 !important;
      .el-radio__input{
        display: none;
      }
      .el-radio__label{
        padding: 0 !important;
      }
    }
  }
}
</style>
