<template>
  <div>
    <div class="seach-content">
      <div class="evaluation-name">
        评价汇总表名称：
        <el-input v-model="name" placeholder="请输入名称" />
      </div>
      <div class="btn-list">
        <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit" />
        <el-button type="primary" @click="handelGenerateFile">生成文件</el-button>
      </div>
    </div>
    <div class="tabel-content">
      <el-table :data="tabelData" style="width: 100%">
        <el-table-column
          prop="folder_name"
          label="序号"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="folder_name"
          label="控制要素"
          align="center"
          header-align="center"
        >
          <el-table-column
            prop="folder_name"
            label="C控制活动"
            align="center"
            header-align="center"
          />
        </el-table-column>
        <el-table-column
          prop="folder_name"
          label="流程名称"
          align="center"
          header-align="center"
        >
          <el-table-column
            prop="folder_name"
            label="4.3采购管理"
            align="center"
            header-align="center"
          />
        </el-table-column>
        <el-table-column
          prop="folder_name"
          label="控制目标"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="folder_name"
          label="控制点编号"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="folder_name"
          label="评价指标描述"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="folder_name"
          label="责任部门"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="folder_name"
          label="指标类型"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="folder_name"
          label="文件或证据名称"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="folder_name"
          label="业务发生频次"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="folder_name"
          label="应选取样本量"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="folder_name"
          label="是否发生异常"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="folder_name"
          label="异常情况说明"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="folder_name"
          label="缺陷类型"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="folder_name"
          label="备注"
          align="center"
          header-align="center"
        />
      </el-table>
    </div>
    <Sample
      v-if="isShowModal"
      :visible="isShowModal"
      @cancel="cancel"
      @submit="submit"
    />
  </div>
</template>

<script>
import Sample from './sampleModal.vue'
export default {
  components: { Sample },
  data() {
    return {
      name: '',
      isShowModal: false,
      tabelData: []
    }
  },
  methods: {
    handleEdit() {
      console.log('编辑')
      this.isShowModal = true
      console.log(this.isShowModal, 'isShowModal')
    },

    handelGenerateFile() {
      console.log('生成文件')
    },

    cancel() {
      this.isShowModal = false
    },

    submit(params) {
      console.log(params, 'params value')
      this.isShowModal = false
    }
  }
}
</script>
<style lang="scss" scoped>
.seach-content {
  display: flex;
  justify-content: space-between;
  margin: 20px;

  .evaluation-name {
    .el-input {
      width: 300px;
    }
  }
}
</style>
