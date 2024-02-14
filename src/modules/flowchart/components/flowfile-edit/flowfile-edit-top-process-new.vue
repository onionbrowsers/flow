<template>
    <div class="edittablejz">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="(it,i) in flowfileDetal.pages" :key="i" :label="it.name" :name="String(it.id)"></el-tab-pane>
        </el-tabs>
        <el-table
            v-if="columnData.length"
            :data="tableData"
            :span-method="objectSpanMethod"
            border
            height="70vh"
            class="tablejz"
            @header-contextmenu="headerContextmenu"
            >
            <el-table-column  prop="flowName" label="流程名称" width="80"></el-table-column>
            <el-table-column 
              :width="item.width"
              :label="item.text"
              v-for="item in columnData"
              :key="item.prop"
              :prop="item.prop">
              <!-- eslint-disable-next-line vue/no-unused-vars -->
              <template slot-scope="scope">
                  <el-input v-if="item.prop === 'controlObject'" type="textarea" :rows="4" v-model="list[0]['controlObject']"></el-input>
                  <el-select v-if="item.prop === 'levelRisk'" class="w100" v-model="list.filter(v=>v.controlPoint==scope.row['control_parent'])[0]['levelRisk']" placeholder="请选择风险程度">
                      <el-option v-for="it in risklevelli" :label="it.name" :key="it.name+it.value" :value="it.value"></el-option>
                  </el-select>
                  <el-input v-if="item.comType === 'input' && item.type === 'Risk'" type="textarea" :placeholder="item.placeholder || ''" :rows="5" v-model="list.filter(v=>v.controlPoint==scope.row['control_parent'])[0][item.prop]"></el-input>
                  <el-input v-if="item.comType === 'input' && item.type !== 'Risk'" type="textarea" :placeholder="item.placeholder || ''" :rows="5" v-model="scope.row[item.prop]"></el-input>
                  <el-input v-if="item.prop === 'significantRisk'" type="textarea" :rows="5" v-model="list.filter(v=>v.controlPoint==scope.row['control_parent'])[0]['significantRisk']"></el-input>
                  <div v-if="item.prop === 'twoRisk'">
                    <riskselect :curentli="list.filter(v=>v.controlPoint==scope.row['control_parent'])" @closeMode="riskSeli"></riskselect>
                  </div>
                  <div v-if="item.comType === 'text'">
                    {{ scope.row[item.prop] }}
                  </div>
              </template>
            </el-table-column>
            <el-table-column prop="control_system" label="制度索引" width="80">
                 <template >
                     <a class="syctema" v-if="institution" @click="clickSystemName">{{institution}}</a>
                     <a v-else >{{institution ||''}}</a>
                 </template>
             </el-table-column>
        </el-table>
        <div class="btnbom">
            <div class="btnbomdiv">
                <el-button @click="submitRisk" type="primary">确认</el-button>
                <el-button  @click="cancelRisk">取消</el-button>
            </div>
             <el-button class="downbtn" @click="downloadHandle()">
                 <i class="el-icon-download"></i>
                 <span class="db">下载</span>
            </el-button>
            <el-radio-group class="downriado" v-model="downradio">
              <el-radio :label="1">当前</el-radio>
              <el-radio :label="2">全部</el-radio>
            </el-radio-group>
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
import riskselect from './flowfile-edit-toppriskselect.vue'
import { columnDataDefault } from './columnDataDefault'
import { mapGetters } from 'vuex'
export default {
  components: {
    riskselect
  },
  props: ['flowDetal', 'currentPageId', 'flowId', 'filename'],
  data () {
    return {
      dowmActotal: 1, // 当前下载额度
      consume: 1, // 本次下载额度
      flowName: '',
      flowfileDetal: {},
      downradio: 1,
      activeName: '', // tabs当前页
      tableData: [], // 数据列表
      columnData: [], // 表格列数据
      ctrlShowTimesli: [
        { name: '每年一次', value: 1 }, { name: '每季度一次', value: 2 }, { name: '每月一次', value: 3 },
        { name: '每周一次', value: 4 }, { name: '按需不定期', value: 5 }
      ], // 控制行为频率
      risklevelli: [{ name: '重大风险', value: 1 }, { name: '中等风险', value: 2 }, { name: '一般风险', value: 3 }],
      list: [],
      institution: '',
      tempIndex: [],
      pdfUrl: '',
      showMenu: false,
      currentColumnIndex: -1,
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
      visible: false,
      columnName: ''
    }
  },
  watch: {
    flowId () {
      this.getDetails()
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter'])
  },
  mounted () {
    this.getDetails()
    document.addEventListener('click', this.clickDocument)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.clickDocument)
  },
  methods: {
    clickDocument () {
      this.showMenu = false
    },
    getDetails () {
      this.$api.getFlowfileDetail(this.flowId).then(res => {
        if (res.code == 0) {
          this.flowfileDetal = res.data || this.flowDetal
          // 获取详细流程信息
          this.activeName = this.currentPageId ? String(this.currentPageId) : this.flowfileDetal.pages && this.flowfileDetal.pages[0] ? String(this.flowfileDetal.pages[0].id) : ''
          this.getJzInfo()
        } else {
          this.flowfileDetal = this.flowDetal
        }
      })
    },

    // 下载查看剩余下载次数
    downloadHandle (type) {
      if (!this.flowfileDetal.hint.length) {
        this.$msgMnger.warn('请先保存本流程图，再进行下载!!!')
        return
      }
      this.dowmActotal = 1
      let params = {
        flow_id: this.flowId,
        company_id: this.currentDataSpaceIdGetter
      }
      this.$api.accountBilling(params).then(res => {
        let data = res.data
        this.dowmActotal = data.last_number || 0
        if (this.downradio == 1) {
          this.consume = this.flowfileDetal.hint.filter(v => v.page == this.activeName).length
        } else {
          this.consume = this.flowfileDetal.hint.length
        }
        this.$confirm(`当前剩余额度：${this.dowmActotal}, 本次下载消耗额度：-${this.consume}`, '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确 认',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          this.suredownurl()
        }).catch(action => {
        })
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    // 下载接口
    suredownurl () {
      if (this.downradio == 1) {
        let arrd = this.flowfileDetal.hint.filter(v => v.page == this.activeName)
        if (this.dowmActotal < this.consume) {
          this.$msgMnger.warn('额度不足，请充值后下载')
          return
        }
        this.download(JSON.stringify(arrd))
      } else {
        if (this.dowmActotal < this.consume) {
          this.$msgMnger.warn('额度不足，请充值后下载')
          return
        }
        let arrsd = JSON.stringify(this.flowfileDetal.hint)
        this.download(arrsd)
      }
    },
    download (data) {
      let params = {
        data: data,
        name: this.flowfileDetal.name
      }
      this.$api.lcAlldownmatrix(params).then(res => {
        if (res.code == 0) {
          let downloadURL = res.data + `?_token=${this.token}`
          this.$api.accountdownlibrary({ company_id: this.currentDataSpaceIdGetter, flow_name: this.filename, lines: this.consume }).then()
          window.open(downloadURL)
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$msgMnger.warn(err.msg)
      })
    },
    handleClick (val, e) {
      this.tableData = []
      this.list = []
      this.columnData = []
      this.activeName = val._props.name
      this.getJzInfo()
    },
    // 点击控制制度
    clickSystemName () {
      let params = {
        control_system: this.institution,
        company_id: this.currentDataSpaceIdGetter
      }
      this.$api.getctrlSystemName(params).then(res => {
        if (res.code == 0) {
          window.open(`/fcFlowfilePdf/${this.institution}/${this.currentDataSpaceIdGetter}`)
          // this.pdfUrl = 'http://172.16.20.54:8022/api/v2'+res.data
        } else {
          this.$msgMnger.warn(res.msg)
        }
      }, err => {
        this.$msgMnger.warn(err.msg)
      })
    },

    // 格式化列数据
    formatColumnData (columnData) {
      return columnData.filter(item => item.hide != true).map(item => {
        const obj = columnDataDefault[item.prop] || { comType: 'input', placeholder: '请输入……' }
        return {
          ...item,
          ...obj
        }
      })
    },

    // 获取矩阵信息
    getJzInfo () {
      if (this.flowfileDetal) {
        this.list = []
        this.$api.getRiskJuzInfo(Number(this.activeName)).then(res => {
          if (res.code == 0) {
            const { data } = res
            this.flowName = data.flowName
            this.columnData = this.formatColumnData(data.columndata || [])
            this.list = data.jsondata || []
            this.institution = data.institution || ''
            this.list.forEach(v => {
              v.significantRisk = v.significantRisk ? v.significantRisk : '由于'
            })
            this.list[0].controlObject = this.list[0].controlObject ? this.list[0].controlObject : '保证'
            let arr = []
            let tempMergeIndex = []
            let pos
            this.list.forEach((item, i) => {
              if (item.mastersList && item.mastersList.length) {
                let sourceArr = item.mastersList.map(_ => {
                  return {
                    flowName: data.flowName,
                    ..._,
                    flag: i + '',
                    control_parent: item.controlPoint
                  }
                })
                arr.push(...sourceArr)
              } else {
                arr.push(item)
              }
            })
            this.tableData = arr
            // 处理arr，生成一个与行数相同的数组记录每一行设置的合并数
            for (let i = 0; i < arr.length; i++) {
              if (i === 0) {
                tempMergeIndex.push(1)
                pos = 0
              } else {
                if (arr[i].flag && (arr[i].flag === arr[i - 1].flag)) {
                  tempMergeIndex[pos] += 1
                  tempMergeIndex.push(0)
                } else {
                  tempMergeIndex.push(1)
                  pos = i
                }
              }
            }
            this.tempIndex = tempMergeIndex
          } else {
            this.columnData = []
            this.tableData = []
            this.list = []
            this.$msgMnger.warn(res.msg)
          }
        })
      }
    },
    // 获取风险分类
    riskSeli (data) {
      if (data) {
        console.log(data)
      }
    },
    // 提交
    submitRisk () {
      this.list.forEach(v => {
        v.controlObject = this.list[0].controlObject
        v.mastersList = this.tableData.filter(b => b.control_parent == v.controlPoint)
      })
      let params = {
        flowName: this.flowName,
        institution: this.institution,
        jsondata: JSON.stringify(this.list),
        columndata: JSON.stringify(this.columnData),
        excel_id: Number(this.activeName),
        folder_id: Number(this.flowfileDetal.folder_id),
        company_id: this.currentDataSpaceIdGetter
      }
      this.$api.changeRiskJuzInfo(Number(this.activeName), params).then(res => {
        if (res.code == 0) {
          this.$msgMnger.success('操作成功！')
          this.$emit('closeModel', true)
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
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === this.columnData.length + 1) {
        if (rowIndex % _this.tableData.length === 0) {
          return { rowspan: _this.tableData.length, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      }
      const columnItem = this.columnData[columnIndex - 1]
      if (columnItem && columnItem.type === 'Risk') {
        return {
          rowspan: this.tempIndex[rowIndex],
          colspan: 1
        }
      }
    },
    headerContextmenu (column, event) {
      event.preventDefault()
      const { property } = column
      const columnIndex = this.columnData.findIndex(item => item.prop === property)
      if (columnIndex === 0 || columnIndex === -1 || this.columnData[columnIndex].notAllowHandle) return
      this.currentColumnIndex = columnIndex
      this.$refs.dropMenu.style.top = `${event.pageY}px`
      this.$refs.dropMenu.style.left = `${event.pageX}px`
      this.showMenu = true
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
              this.tableData.forEach(item => {
                delete item[columnItem.prop]
              })
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
.downriado{
    margin:5px 10px 0;
    vertical-align: middle;
    /deep/ .el-radio{
        line-height:35px;
        margin-right: 15px;
    }
}

    .downbtn{
        margin-top:5px;
        padding: 0px 10px;
        font-size: 12px;
        height: 35px;
        vertical-align: middle;
    }
.btnbom{
    margin:15px auto;
    text-align: center;
    padding-bottom:20px;
    display:flex;
    .btnbomdiv{
        padding-left: 258px;
        flex:1;
    }
}
.edittablejz{
    padding:0 10px;
    .tablejz{
        width: 100%;
        overflow: auto;
    }
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
    background-color: transparent;
}
.riskselect{
    padding:5px 0 ;
    // width:calc(100% - 20px)
}
/deep/ .el-table__cell div{
    color: #6c6b6b;
    text-align: center;
}
.syctema{
    color: #1977af;
    cursor: pointer;
}
.edittablejz{
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

/deep/ .column-dialog {

  .el-dialog__footer {
    text-align: center;
  }
}
</style>
