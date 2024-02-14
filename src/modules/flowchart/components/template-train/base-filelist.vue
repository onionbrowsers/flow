<template>
  <div id="base-filelist-id">
    <div v-if="dataList.length > 0" class="base-filelist">
      <div v-for="(item, index) in dataList" :key="index" class="base-filelist-item">
        <!-- <el-popover
          placement="top"
          width="80"
          v-model="deleteVisible">
          <p style="text-align:center;">确定删除此文件吗？</p>
          <div style="text-align:center;margin:10px 0 0 0;">
            <el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="deleteVisio(item)">确定</el-button>
          </div>
          <span slot="reference" class="base-filelist-item-close">
            <i class="iconfont iconshanchu"></i>
          </span>
        </el-popover> -->
        <span slot="reference" class="base-filelist-item-close" @click="deleteVisio(item)">
          <i class="iconfont iconshanchu"></i>
        </span>
        <div class="base-filelist-item-title">{{item.name}}.vsdx</div>
        <el-checkbox-group v-model="item.check_page">
          <el-checkbox v-for="(i, k) in item.page_name" :key="k" :label="i" >{{i}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <empty-list v-if="dataList.length < 1" :title="emptyContent"/>
  </div>
</template>

<script>
import EmptyList from '@/components/public/empty-list.vue'
export default {
  props: {
    dataList: {
      default: () => []
    }
  },
  components: {
    EmptyList
  },
  data () {
    return {
      emptyContent: `操作提示：上传Visio文件后，点击“训练模板”`,
      deleteVisible: false
    }
  },
  methods: {
    deleteVisio ({ id }) {
      this.$emit('deleteVisio', id)
      this.deleteVisible = false
    },
    visioSheetsChange (list) {
      let res = []
      let hasChecked = false
      list.forEach(e => {
        res.push({
          id: e.id,
          check_page: e.check_page
        })
        if (!hasChecked && e.check_page.length > 0) {
          hasChecked = true
        }
      })
      this.$emit('changeCheckedVisioSheets', res, hasChecked)
    }
  },
  watch: {
    dataList: {
      handler (list) {
        this.visioSheetsChange(list)
      },
      immediate: true, // 立即执行
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.base-filelist{
  text-align: left;
  padding: 20px;
  .base-filelist-item{
    // border-bottom: 1px solid #ddd;
    // padding: 10px 0;
    .base-filelist-item-title{
      background: #FAFAFA;
      padding: 10px;
      border-bottom: 1px solid rgb(233, 233, 233)
    }
    .base-filelist-item-close{
      float: right;
      cursor: pointer;
      margin: 10px 10px 0 0;
      >i {
        font-size: 20px;
      }
    }
  }
}
</style>
<style lang="scss">
#base-filelist-id{
  .el-checkbox-group{
    .el-checkbox{
      display: block;
      margin: 0 !important;
      padding: 10px;
      border-bottom: 1px solid rgb(233, 233, 233)
    }
  }
}
</style>
