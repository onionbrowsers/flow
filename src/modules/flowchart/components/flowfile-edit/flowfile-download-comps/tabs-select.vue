<template>
  <div id="tabs-select">
    <b-layout class="b-layout" mode="vertical" placement="top" space="32px" :border="false">
      <div slot="first" class="top">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">流程图选择</el-checkbox>
        <span class="right">计费标识</span>
      </div>
      <el-scrollbar slot="last" class="scroll-bar">
        <b-layout class="b-layout-2" mode="horizontal" placement="right" space="70px" :border="false">
          <el-checkbox-group slot="first" v-model="checkedTabs" @change="handleCheckedTabsChange">
              <el-checkbox v-for="tab in tabOptions" :key="tab.id" :label="tab.id">{{tab.name || tab.shell_name}}</el-checkbox>
          </el-checkbox-group>
          <div slot="last" class="tags">
            <div class="tag-wrapper" v-for="tab in tabOptions" :key="tab.id">
              <el-tag size="mini">{{tab.version ? '未计费' : '已计费'}}</el-tag>
            </div>
          </div>
        </b-layout>
      </el-scrollbar>
    </b-layout>
  </div>
</template>

<script>
import BLayout from '@/layouts/BinaryLayout'
export default {
  props: ['tabOptions'],
  components: {
    BLayout
  },
  data () {
    return {
      checkAll: false,
      checkedTabs: [],
      isIndeterminate: false
    }
  },
  watch: {
    tabOptions () {
      if (this.tabOptions.length == 0) {
        this.checkedTabs = []
        this.checkAll = false
      }
    }
  },
  mounted () {
    this.checkedTabs = []
    this.checkAll = false
  },
  methods: {
    handleCheckAllChange (val) {
      this.checkedTabs = val ? this.tabOptions.map(e => { return e.id }) : []
      this.isIndeterminate = false
      this.$emit('checked-change', this.checkedTabs)
    },
    handleCheckedTabsChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.tabOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tabOptions.length
      this.$emit('checked-change', this.checkedTabs)
    }
  }
}
</script>

<style lang="scss" scoped>
#tabs-select{
  margin-top: 20px;
  height: 240px;
  padding: 10px 10px;
  border: 1px solid #eee;
  .b-layout{
    .top{
      height: 100%;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      .right{
        float: right;
        margin-right: 20px;
      }
    }
    .scroll-bar{
      height: 100%;
      padding-right: 10px;
      .b-layout-2{
        .tags{
          text-align: center;
          margin-top: 10px;
          .tag-wrapper{
            height: 24px;
            line-height: 24px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
#tabs-select{
  .b-layout{
    .scroll-bar{
      .el-checkbox-group{
        margin-top: 10px;
        .el-checkbox{
          display: block;
          height: 24px;
          line-height: 24px;
        }
      }
    }
  }
}
</style>
