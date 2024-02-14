<template>
    <div class="riskdialog">
        <el-table
            v-if="columnData.length"
            :data="tableData"
            @header-contextmenu="headerContextMenu"
            border
            style="width: 100%; margin-top: 20px">
            <el-table-column
                prop="flowName"
                label="流程名称"
                width="180">
            </el-table-column>
            <el-table-column 
              :width="item.width"
              :label="item.text"
              v-for="item in columnData"
              :key="item.prop"
              :prop="item.prop">
              <template slot-scope="scope">
                  <el-input v-if="item.prop === 'controlObject'" :placeholder="item.placeholder" type="textarea" :rows="4" v-model="scope.row['controlObject']"></el-input>
                  <el-select v-if="item.prop === 'levelRisk'" class="w100" v-model="scope.row['levelRisk']" placeholder="请选择风险程度">
                      <el-option v-for="it in risklevelli" :label="it.name" :key="it.name+it.value" :value="it.value"></el-option>
                  </el-select>
                  <el-input v-if="item.comType === 'input'" type="textarea" :placeholder="item.placeholder || ''" :rows="5" v-model="scope.row[item.prop]"></el-input>
                  <el-input v-if="item.prop === 'significantRisk'" :placeholder="item.placeholder" type="textarea" :rows="5" v-model="scope.row['significantRisk']"></el-input>
                  <div v-if="item.prop === 'twoRisk'">
                    <div>
                        <el-select @change="riskSelect" class="riskselect"  v-model="scope.row['firstRisk']" placeholder="请选择一级风险类型">
                            <el-option v-for="it in firstriskli" :key="it.id" :label="it.risk_name" :value="it.id"></el-option>
                        </el-select>
                        <div>|</div>
                        <el-select  class="riskselect" @change="riskSecond" v-model="scope.row['twoRisk']" placeholder="请选择二级风险类型">
                            <el-option v-for="it in sencondLi" :key="it.id" :label="it.risk_name" :value="it.id"></el-option>
                        </el-select>
                        <div>|</div>
                         <el-select  class="riskselect" @change="riskthree" v-model="scope.row['threeRisk']" placeholder="请选择三级风险类型">
                            <el-option v-for="it in threeriskLi" :key="it.id" :label="it.risk_name" :value="it.id"></el-option>
                        </el-select>
                        <div>|</div>
                        <el-select  class="riskselect" v-model="scope.row['fourRisk']" placeholder="请选择四级风险类型">
                            <el-option v-for="it in fourriskLi" :key="it.id" :label="it.risk_name" :value="it.id"></el-option>
                        </el-select>
                    </div>
                  </div>
              </template>
            </el-table-column>
        </el-table>
        <div class="btnbom">
          <el-button @click="submitRisk" type="primary">确认</el-button>
          <el-button  @click="cancelRisk">取消</el-button>
        </div>
        <div @click.stop v-show="showMenu" ref="dropMenu" class="drop-menu-wrapper">
            <div
                class="drop-menu-item"
                v-for="item in dropMenuList"
                :key="item.type"
                @click="clickMenu(item)"
            >
                {{ item.name }}
            </div>
        </div>
        <el-dialog
          title="填写列名称"
          :visible.sync="visible"
          append-to-body
          destroy-on-close
          size="mini"
          custom-class="column-dialog"  
        >
          <div class="column-add-content" style="text-align: center;">
            <el-input style="width: 80%;" v-model="columnName"></el-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSave">确 定</el-button>
            <el-button @click="handleCancel">取 消</el-button>
          </span>
        </el-dialog>
    </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { columnDataDefault } from '../flowfile-edit/columnDataDefault'
export default {
  props: ['pageId', 'flowfileDetal', 'pageName', 'folderId'],
  data () {
    return {
      columnData: [],
      currentColumnIndex: -1,
      columnName: '',
      visible: false,
      showMenu: false,
      tableData: [{
        flowName: '', controlObject: '保证', significantRisk: '由于', firstRisk: '', twoRisk: ''
      }],
      firstriskli: [{ risk_name: '战略风险', id: 1 }, { risk_name: '运营风险', id: 2 },
        { risk_name: '财务风险', id: 3 }, { risk_name: '法律风险', id: 4 }, { risk_name: '市场风险', id: 5 }],
      sencondLi: [], // 二级风险列表
      threeriskLi: [], // 三级风险
      fourriskLi: [], // 四级风险
      risklevelli: [{ name: '重大风险', value: 1 }, { name: '中等风险', value: 2 }, { name: '一般风险', value: 3 }],
      dropMenuList: [
        {
          name: '向前添加列',
          type: 'frontAddRow'
        },
        {
          name: '向后添加列',
          type: 'endAddRow'
        },
        {
          name: '删除列',
          type: 'delete'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter'])
  },
  mounted () {
    this.getRiskinfo()
    document.addEventListener('click', this.clickDocument)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.clickDocument)
  },
  methods: {
    clickDocument () {
      this.showMenu = false
    },
    headerContextMenu (column, event) {
      event.preventDefault()
      event.stopPropagation()
      const { property } = column
      const columnIndex = this.columnData.findIndex(item => item.prop === property)
      if (columnIndex === -1 || this.columnData[columnIndex].notAllowHandle) return
      this.currentColumnIndex = columnIndex
      this.$refs.dropMenu.style.top = `${event.pageY}px`
      this.$refs.dropMenu.style.left = `${event.pageX}px`
      this.showMenu = true
    },
    // 选择一级风险
    riskSelect (val) {
      this.tableData[0].twoRisk = ''
      this.tableData[0].threeRisk = ''
      this.tableData[0].fourRisk = ''
      this.sencondLi = []
      this.threeriskLi = []
      this.fourriskLi = []
      this.getTwoLevel(val, 1)
    },
    // 选择二级风险
    riskSecond (val) {
      this.tableData[0].threeRisk = ''
      this.tableData[0].fourRisk = ''
      this.threeriskLi = []
      this.fourriskLi = []
      this.getTwoLevel(val, 2)
    },
    // 选择三级级风险
    riskthree (val) {
      this.tableData[0].fourRisk = ''
      this.fourriskLi = []
      this.getTwoLevel(val, 3)
    },
    // 获取二级列表
    getTwoLevel (val, index) {
      if (index == 1) {
        this.$api.getformLevelriskinfo(val, { company_id: this.currentDataSpaceIdGetter }).then(res => {
          if (res.code == 0) {
            this.sencondLi = res.data || []
          }
        })
      }
      if (index == 2) {
        this.$api.getformLevelriskinfo(val, { company_id: this.currentDataSpaceIdGetter }).then(res => {
          if (res.code == 0) {
            this.threeriskLi = res.data || []
          }
        })
      }
      if (index == 3) {
        this.$api.getformLevelriskinfo(val, { company_id: this.currentDataSpaceIdGetter }).then(res => {
          if (res.code == 0) {
            this.fourriskLi = res.data || []
          }
        })
      }
    },
    formatColumnData (columnData) {
      return columnData.filter(item => item.hide != true && item.type === 'Risk').map(item => {
        const obj = columnDataDefault[item.prop] || { comType: 'input', placeholder: '请输入……' }
        return {
          ...item,
          ...obj
        }
      })
    },
    // 获取风险点{信息
    getRiskinfo () {
      let params = {
        excel_id: this.pageId,
        numberId: this.flowfileDetal.id,
        flowName: this.pageName,
        point: this.flowfileDetal.risk_point_no
      }
      this.$api.getRiskdotInfo(params).then(res => {
        if (res.code == 0) {
          this.columnData = this.formatColumnData(res.data.columndata || [])
          this.tableData = res.data ? [res.data.jsondata] : [{}]
          this.tableData.forEach(v => {
            v.flowName = this.pageName
            if (!v.controlObject) {
              v.controlObject = '保证'
            }
            if (!v.significantRisk) {
              v.significantRisk = '由于'
            }
          })
          if (this.tableData[0] && this.tableData[0].firstRisk) {
            this.getTwoLevel(this.tableData[0].firstRisk, 1)
          }
          if (this.tableData[0] && this.tableData[0].twoRisk) {
            this.getTwoLevel(this.tableData[0].twoRisk, 2)
          }
          if (this.tableData[0] && this.tableData[0].threeRisk) {
            this.getTwoLevel(this.tableData[0].threeRisk, 3)
          }
        } else {
          this.$msgMnger.warn(res.msg)
        }
      })
    },
    // 提交
    submitRisk () {
      let params = {
        company_id: this.currentDataSpaceIdGetter,
        folder_id: this.folderId,
        excel_id: this.pageId,
        numberId: this.flowfileDetal.id,
        flowName: this.pageName,
        columndata: JSON.stringify(this.columnData),
        jsondata: JSON.stringify({
          ...this.tableData[0],
          controlPoint: this.flowfileDetal.risk_point_no
        })
      }
      this.$api.changeRiskdotInfo(params).then(res => {
        if (res.code == 0) {
          this.$msgMnger.success('操作成功！')
          this.$emit('closeModel', false)
        } else {
          this.$msgMnger.warn(res.msg)
        }
      })
    },
    // 取消提交
    cancelRisk () {
      this.$emit('closeModel', false)
    },
    clickMenu (item) {
      this.showMenu = false
      this.addRow(item.type)
    },
    handleCancel () {
      this.visible = false
      this.columnName = ''
    },
    handleSave () {
      if (!this.columnName.trim()) {
        return this.$msgMnger.warn('请填写列名称')
      }
      const columnItem = this.columnData[this.currentColumnIndex]
      const { type } = columnItem
      const columnId = Date.now()
      const addColumnItem = {
        type,
        prop: `column${columnId}`,
        comType: 'input',
        placeholder: '请输入……',
        hide: false,
        text: this.columnName
      }
      this.tableData.forEach(item => {
        this.$set(item, `column${columnId}`, '')
      })
      this.columnData.splice(this.columnType === 'frontAddRow' ? this.currentColumnIndex : this.currentColumnIndex + 1, 0, addColumnItem)
      this.visible = false
      this.columnName = ''
      this.columnType = ''
    },
    addRow (handleType) {
      if (this.currentColumnIndex === -1) return
      if (handleType === 'delete') {
        const columnItem = this.columnData[this.currentColumnIndex]
        if (columnItem.delete === false) {
          this.$msgMnger.warn('当前列不可删除')
          return
        }
        return this.$msgbox({
          title: '提示',
          message: '是否删除当前列',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: '是',
          cancelButtonText: '否',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              this.columnData.splice(this.currentColumnIndex, 1)
            }
            return done()
          }
        })
      }
      this.visible = true
      this.columnType = handleType
    },
  }
}
</script>

<style lang="scss" scoped>
.btnbom{
    margin:20px auto;
    padding-bottom:20px;
}
.riskselect{
    padding:5px 0 ;
    // width: calc(100% - 20px);
}
/deep/ .el-table__cell div{
    color: #6c6b6b;
}
.riskdialog{
    /deep/ .el-table td.el-table__cell,/deep/  .el-table th.el-table__cell.is-leaf,
    /deep/ .el-table td.el-table__cell,/deep/ .el-table td.el-table__cel,/deep/ .el-table--group,/deep/ .el-table--border{
        border-color:#d5d3d3    !important;
    }
    /deep/ .el-table--group::after,/deep/  .el-table--border::after,/deep/  .el-table::before{
        background-color: #d5d3d3   ;
    }

}

.drop-menu-wrapper {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    padding: 16px;
    background-color: #fff;
    min-width: 150px;
    border-radius: 4px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

    .drop-menu-item {
        width: 100%;
        font-size: 16px;
        line-height: 30px;
        height: 30px;
        text-align: center;
        cursor: pointer;
        user-select: none;

        &:hover {
            background-color: #1890FF;
            color: #fff;
            border-radius: 2px;
        }
    }

}
</style>
