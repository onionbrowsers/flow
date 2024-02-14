<template>
    <div style="padding: 0px 20px" class="riskdialog">
        <el-table
            v-if="columnData.length"
            :data="tableData"
            :span-method="objectSpanMethod"
            @header-contextmenu="headerContextMenu"
            border
            style="width: 100%; margin-top: 20px">
            <el-table-column 
              :width="item.width"
              :label="item.text"
              v-for="item in columnData"
              :key="item.prop"
              :prop="item.prop">
              <!-- eslint-disable-next-line vue/no-unused-vars -->
              <template slot-scope="scope">
                  <el-input v-if="item.comType === 'input'" type="textarea" :placeholder="item.placeholder || ''" :rows="5" v-model="scope.row[item.prop]"></el-input>
                  <div v-if="item.comType === 'text'">
                    {{ scope.row[item.prop] }}
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
  props: ['pageId', 'flowfileDetal', 'allData', 'pageName', 'folderId'],
  data () {
    return {
      columnData: [],
      currentColumnIndex: -1,
      columnName: '',
      visible: false,
      showMenu: false,
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
      ],
      tableData: [],
      ctrlShowTimesli: [
        { name: '每年一次', value: 1 }, { name: '每季度一次', value: 2 }, { name: '每月一次', value: 3 },
        { name: '每周一次', value: 4 }, { name: '按需不定期', value: 5 }
      ]// 控制行为频率
    }
  },
  mounted () {
    this.getRiskinfo()
    this.getDocumen()
    document.addEventListener('click', this.clickDocument)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.clickDocument)
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter'])
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
    clickMenu (item) {
      console.log(item, this.currentColumnIndex)
      this.showMenu = false
      this.addRow(item.type)
    },
    addRow (handleType) {
      if (this.currentColumnIndex === -1) return
      const columnItem = this.columnData[this.currentColumnIndex]
      if (columnItem.delete === false) {
        this.$msgMnger.warn('当前列不可删除')
        return
      }
      if (handleType === 'delete') {
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
    handleCancel () {
      this.visible = false
      this.columnName = ''
    },
    // 获取节点文档框
    getDocumen () {
      let str = ''
      // let arr = this.allData.splice(0, n)
      if (this.flowfileDetal.document) {
        str = this.flowfileDetal.document
        return str
      } else {
        let arr = []
        for (let i = 0; i < this.allData.length; i++) {
          if (this.allData[i].document) {
            arr.push(this.allData[i].document)
          }
          if (this.allData[i].id == this.flowfileDetal.id && this.allData[i].control_point_no == this.flowfileDetal.point_no) {
            str = arr[arr.length - 1]
            return str
          }
        }
      }
    },
    formatColumnData (columnData) {
      return columnData.filter(item => item.hide != true && item.type !== 'Risk').map(item => {
        const obj = columnDataDefault[item.prop] || { comType: 'input', placeholder: '请输入……' }
        return {
          ...item,
          ...obj
        }
      })
    },
    // 获取控制点信息
    getRiskinfo () {
      let params = {
        document: this.getDocumen() || '',
        data: JSON.stringify(this.flowfileDetal),
        excel_id: this.pageId
      }
      console.log(this.flowfileDetal, 222222)
      this.$api.getContdotInfo(params).then(res => {
        if (res.code == 0) {
          this.columnData = this.formatColumnData(res.data ? res.data.columndata : [])
          this.tableData = res.data ? [res.data.jsondata] : [{}]
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
        jsondata: JSON.stringify(this.tableData[0])
      }
      this.$api.changeContdotInfo(params).then(res => {
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
    // 行数合并
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      let _this = this
      if (columnIndex === 0) {
        if (rowIndex % _this.tableData.length === 0) {
          return {
            rowspan: _this.tableData.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btnbom{
    margin:20px auto;
    text-align: center;
    padding-bottom:20px;
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
