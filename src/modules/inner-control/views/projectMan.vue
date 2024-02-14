<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleTabChange">
      <el-tab-pane v-for="(item) in projectManList" :key="item.value" :label="item.label" :name="item.value"></el-tab-pane>
    </el-tabs>

    <div class="draft-name">
      <span>当前底稿名称：</span>
      <el-input v-mode="pageName" placeholder="请输入底稿名称" class="input" style="width: 300px"></el-input>
    </div>

    <table class="table-container">
      <thead>
        <tr>
          <th colspan="4">内部控制自评价测试底稿</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="bg-gray">评价底稿编号</td>
          <td colspan="3">{{ data.evalId }}</td>
        </tr>
        <tr>
          <td class="bg-gray">业务流程编号及名称</td>
          <td>{{ data.flowName }}</td>
          <td class="bg-gray">控制责任部门</td>
          <td>{{ data.folderName }}</td>
        </tr>
        <tr style="height: 15px"></tr>
        <tr>
          <td colspan="4" class="first-table-container">
            <thead class="first-table-thead">
              <tr>
                <th style="width: 50px">序号</th>
                <th style="width: 200px">控制标准</th>
                <th style="width: 100px">样本总量</th>
                <th style="width: 150px">应抽取样本量</th>
                <th style="width: 100px">实际应抽取样本量</th>
                <th style="width: 100px">对应的评价样本编号</th>
                <th style="width: 100px">备注</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="width: 50px">1</td>
                <td style="width: 200px">1</td>
                <td style="width: 10px">1</td>
                <td style="width: 150px">1</td>
                <td style="width: 10px">1</td>
                <td style="width: 10px">1</td>
                <td style="width: 10px">1</td>
              </tr>
              <!-- <tr v-for="(item, index) in data.firstTable" :key="index">
                <td>{{ item.controlId }}</td>
                <td>{{ item.controlStand }}</td>
                <td>{{ item.sampleSize }}</td>
                <td>{{ item.sampleNum }}</td>
                <td>{{ item.actualSampleNum }}</td>
                <td>{{ item.sampleId }}</td>
                <td>{{ item.remark }}</td>
              </tr> -->
            </tbody>
          </td>
        </tr>
        <tr>
          <td class="bg-gray" style="border-top: none">评价步骤</td>
          <td colspan="3" style="border-top: none">{{ data.evalStep }}</td>
        </tr>
        <tr>
          <td class="bg-gray">是否穿行设置</td>
          <td>{{ data.walkTest }}</td>
          <td class="bg-gray">穿行测试底稿编号</td>
          <td>{{ data.walkId }}</td>
        </tr>
        <tr>
          <td class="bg-gray">是否访谈</td>
          <td>{{ data.interview }}</td>
          <td class="bg-gray">访谈底稿编号</td>
          <td>{{ data.interviewId }}</td>
        </tr>
        <tr style="height: 15px"></tr>
        <tr>
          <td class="bg-gray center" colspan="4" style="border-bottom: none;">缺陷样本信息</td>
        </tr>
        <tr>
          <td colspan="4" class="first-table-container">
            <thead class="first-table-thead">
              <tr>
                <th style="width: 100px">评价样本编号</th>
                <th style="width: 80px">日期</th>
                <th style="width: 200px">缺陷样本名称及具体信息</th>
                <th style="width: 70px">涉及金额</th>
                <th style="width: 200px">缺陷样本评价过程描述</th>
                <th style="width: 150px">样本评价结论</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="width: 100px">1</td>
                <td style="width: 80px">1</td>
                <td style="width: 200px">1</td>
                <td style="width: 70px">1</td>
                <td style="width: 200px">1</td>
                <td style="width: 150px">1</td>
              </tr>
              <!-- <tr v-for="(item, index) in data.firstTable" :key="index">
                <td>{{ item.controlId }}</td>
                <td>{{ item.controlStand }}</td>
                <td>{{ item.sampleSize }}</td>
                <td>{{ item.sampleNum }}</td>
                <td>{{ item.actualSampleNum }}</td>
                <td>{{ item.sampleId }}</td>
                <td>{{ item.remark }}</td>
              </tr> -->
            </tbody>
          </td>
        </tr>
        <tr>
          <td class="bg-gray" style="border-top: none;">控制点评价结论</td>
          <td colspan="3" style="border-top: none;">{{ data.controlConclusion }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>

const project_enum = {
  purchase: '1', // 采购
  supervise: '2', // 监督
  settlement: '3' // 结算
}

export default {
  data () {
    return {
      activeName: project_enum.purchase,
      projectManList: [
        {
          value: project_enum.purchase,
          label: '工程采购'
        },
        {
          value: project_enum.supervise,
          label: '工程监督'
        },
        {
          value: project_enum.settlement,
          label: '工程结算'
        }
      ],
      pageName: '',
      data: {},
    }
  },
  methods: {
    handleTabChange () {

    },
     
    getLists () {
      const excel_id = this.$route.query.id
      this.$api.getProjectManList({
        excel_id
      }).then(res => {
        const { code, data } = res
        if (code !== 0) {
            this.$message.error('获取表格失败')
            return
        }
        this.data = data
      })
    }
  },

  mounted () {
    this.getLists()
  }
}
</script>
<style scoped lang="scss">
.draft-name {
  margin-bottom: 20px;
}
.table-container {
  width: 800px;
  border-collapse: collapse;
  border: 2px solid #ccc;
  font-family: sans-serif;
  font-size: 0.8rem;
  letter-spacing: 1px;

  thead {
    padding: 8px 10px;
  }

  th,
  td {
    border: 1px solid #000;
    padding: 8px 10px;
    text-align: center;
  }
  .bg-gray {
    background: #ccc;
    font-weight: 800;
    width: 50px;
  }

  .first-table-container {
    border-top: none;
    border-bottom: none;
    padding: 0;
    width: 100%;
  }

  .first-table-thead {
    background: #ccc;
  }
}

</style>
