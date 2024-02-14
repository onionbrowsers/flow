<template>
    <el-dialog
      title="新建手册"
      :close-on-click-modal="false"
      custom-class="file-edit-dialog"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :footer="null"
      width="30%"
      >
      <el-select v-if="isZhlicom" class="flodselect" clearable  filterable @change="departChangeId" v-model="secondary_id" placeholder="请选择所属企业">
          <el-option v-for="it in secondaryList" :key="it.id" :label="it.departname" :value="it.id"></el-option>
      </el-select>
      <el-select  class="flodselect mb10" clearable filterable v-model="flodId" placeholder="请选择所属部门">
          <el-option v-for="it in flodList" :key="it.id" :label="it.name" :value="it.id"></el-option>
      </el-select>
      <div></div>
      <el-select  class="flodselect mb10"  v-model="manual_level" filterable  clearable  placeholder="请选择手册级别">
          <el-option v-for="it in manulLevelList" :key="it.id" :label="it.name" :value="it.id"></el-option>
      </el-select>
      <div>
          <el-button type="primary" size="small" @click="submitHandle">提交</el-button>
          <el-button  size="small" @click="cancelHan">取消</el-button>
      </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  data () {
    return {
      pageInfo: {

      },
      defaultProps: { children: 'children', label: 'name' }// 树形列表展示字段
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter',
      'personalDataSpaceGetter'])
  },
  mounted () {
  },
  methods: {
    // 返回
    reback () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.handbooktitle{
}

.handbook{
}
</style>
