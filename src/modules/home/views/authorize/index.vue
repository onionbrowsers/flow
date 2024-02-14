<template>
    <div class="authorize-wrapper">
        <div class="authorize-title">
            内部管理授权手册
        </div>
        <div class="authorize-handle-wrapper">
            <el-form inline :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="form-panel">
              <el-form-item label="手册名称" prop="name">
                  <el-input v-model="ruleForm.name" placeholder="请输入手册名称"></el-input>
              </el-form-item>

              <!-- <el-form-item label="所属企业" prop="flodId">
                <el-select :disabled="disabled" v-model="ruleForm.companyId" placeholder="请选择所属企业">
                  <el-option
                    v-for="item in secondaryList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item> -->

              <el-form-item label="所属部门" prop="flodId">
                  <el-select :disabled="disabled" v-model="ruleForm.flodId" placeholder="请选择所属部门">
                      <el-option
                      v-for="item in flodList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="手册级别" prop="level">
                <el-select :disabled="disabled" v-model="ruleForm.level" placeholder="请选择手册级别">
                  <el-option
                    v-for="item in levelList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="handle-button-list">
                <el-button v-if="manualId" @click="edit = !edit" class="common-button" type="primary">
                    {{ edit ? '预览' : '编辑' }}
                </el-button>
                <el-button type="primary" @click="handleValidate" :disabled="disabled">
                  {{ manualId ? '生成手册' : '新建' }}
                </el-button>
            </div>
        </div>
        <div :class="[edit ? 'authorize-table-wrapper' : 'show-table-wrapper']">
            <div v-if="!manualId" class="handle-mask" @click.stop @contextmenu.stop></div>
            <div v-if="columnData.length">*请使用鼠标右键在下方表格进行操作</div>
            <el-table
                v-if="columnData.length"
                :span-method="arraySpanMethod"
                @row-contextmenu="handleDataContextMenu"
                @header-contextmenu="handleHeaderContextMenu"
                border
                :data="tableData"
                style="width: 100%;">
                <el-table-column
                    :min-width="item.minWidth || 90"
                    :width="item.width"
                    align="center"
                    v-for="(item, index) in columnData"
                    :key="item.prop"
                >
                    <template slot="header" slot-scope="{$index}">
                        <div
                            class="common-table-cell common-table-header"
                            @click.right="event => headerContextMenu(event, item, $index)"
                            @click.stop="event => middleHeaderContextMenu(event, item, $index)"
                        >
                            <el-input
                                v-model="item.text"
                                type="textarea"
                                class="common-input"
                                :autosize="{ minRows: 4 }"
                                placeholder="输入内容"
                                v-show="edit"
                            >
                            </el-input>
                            <span class="common-text" v-show="!edit">{{ item.text }}</span>
                        </div>
                    </template>
                    <template slot-scope="{row, $index}">
                        <div
                            class="common-table-cell common-table-row"
                            @click.right="event => dataContextMenu(event, item, $index, index)"
                            @click.stop="event => middleDataContextMenu(event, item, $index, index)"
                        >
                            <div class="type-wrapper" v-show="edit">
                                <div v-if="item.prop === 'column2'">
                                  <el-tooltip
                                    effect="dark"
                                    :content="(row.tags && row.tags[0] && row.tags[0].page_name) ? `已绑定流程图——${row.tags[0].page_name}流程图` : '暂无绑定流程图'"
                                    placement="top-start">
                                    <el-input
                                        type="textarea"
                                        class="common-input"
                                        v-model="row[item.prop]"
                                        :autosize="{ minRows: 4 }"
                                        placeholder="输入内容"
                                    >
                                    </el-input>
                                  </el-tooltip>
                                </div>
                                <div v-else-if="item.type === 'text'">
                                    <el-input
                                        type="textarea"
                                        class="common-input"
                                        v-model="row[item.prop]"
                                        :autosize="{ minRows: 4 }"
                                        placeholder="输入内容"
                                    >
                                    </el-input>
                                </div>
                                <el-select
                                    v-else
                                    class="common-select"
                                    v-model="row[item.prop]"
                                    placeholder="请选择类型"
                                    style="width: 80%;"
                                >
                                    <el-option
                                        v-for="item in selectList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name">
                                    </el-option>
                                </el-select>
                              </div>
                              <div class="common-text" v-show="!edit">
                                <div v-if="item.prop !== 'column2'">
                                  {{ row[item.prop] }}
                                </div>
                                <div v-else>
                                  <el-tooltip effect="dark" :content="(row.tags && row.tags[0] && row.tags[0].page_name) || '暂无绑定流程图'" placement="top-start">
                                    <span>
                                      {{ row[item.prop] }}
                                    </span>
                                  </el-tooltip>
                                </div>
                              </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
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
        <authorizeDialog></authorizeDialog>
        <authorizeDialog :companyId="currentDataSpaceIdGetter" @saveNode="saveNode" :flodList="flodList" ref="addDialog"/>
    </div>
</template>

<script>
import { commonTableColumn, dropMenuList } from './constant'
import authorizeDialog from './authorizeDialog.vue'
import { mapGetters } from 'vuex'
import { Levels } from '../handbook/constant'
export default {
  components: {
    authorizeDialog
  },
  data () {
    return {
      edit: true,
      disabled: false,
      columnData: [
        ...commonTableColumn
      ],
      tableData: [],
      selectList: [
        {
          name: '提议',
          id: 1
        },
        {
          name: '提议/审核',
          id: 2
        },
        {
          name: '审核',
          id: 3
        },
        {
          name: '审议',
          id: 4
        },
        {
          name: '批准',
          id: 5
        },
        {
          name: '批准/审核',
          id: 6
        }
      ],
      manualId: null,
      submitLoading: false,
      dropMenuList: [],
      showMenu: false,
      flodList: [],
      secondaryList: [],
      levelList: Levels,
      ruleForm: {
        name: '',
        flodId: '',
        level: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入手册名称', trigger: 'blur' }
        ],
        flodId: [
          { required: true, message: '请选择所属部门', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择手册级别', trigger: 'change' }
        ]
      },
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter'])
  },
  watch: {
    currentDataSpaceIdGetter (oldValue, newValue) {
      if (oldValue !== newValue) {
        this.getFlodS()
      }
    }
  },
  created () {
    this.getFlodS()
    if (this.$route.query.manual_id) {
      this.manualId = this.$route.query.manual_id
      this.$api.showAuthorizeHandbook({
        manual_id: this.manualId
      }).then(res => {
        const { code, data } = res
        if (code === 0) {
          this.ruleForm = {
            name: data.filename,
            flodId: data.department,
            level: data.level
          }
        }
      }).catch(() => {
        this.$msgMnger.error('获取手册信息失败')
      })
      this.$api.showAuthorizeCustomTableData({
        manual_id: this.manualId
      }).then((res) => {
        const { code, data = {} } = res
        if (code === 0) {
          this.columnData = data.columnData || commonTableColumn
          this.tableData = data.tableData || []
        }
      }).catch(() => {
        this.$msgMnger.error('获取表格信息失败')
      })
    }
  },
  mounted () {
    document.addEventListener('click', this.clickDocument)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.clickDocument)
  },
  methods: {
    saveNode (params) {
      const { currentData, tags } = params
      this.$set(currentData, 'tags', tags)
    },
    bindFlowChart () {
      this.$refs.addDialog.tags = this.tableData[this.rowIndex].tags || []
      this.$refs.addDialog.edit(this.tableData[this.rowIndex])
    },
    getFlodS (id) {
      this.$api.getUserFolder({ companyId: this.currentDataSpaceIdGetter }).then(res => {
        this.flodList = res.data || []
        // this.memberLibList()
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (row.allSpan === 'true') {
        if (columnIndex === 0) {
          return
        }
        if (columnIndex === 1) {
          return [1, this.columnData.length - 1]
        } else {
          return [0, 0]
        }
      }
    },
    clickDocument () {
      this.showMenu = false
    },
    formatAddRowData (index, type = 'up', allSpan) {
      const obj = {
        allSpan
      }
      this.columnData.forEach(item => {
        obj[item.prop] = ''
      })
      if (index === undefined) {
        this.tableData.push(obj)
      } else {
        this.tableData.splice(type === 'up' ? index : index + 1, 0, obj)
      }
    },
    formatAddColumnData (index, type = 'left') {
      const id = Date.now()
      this.columnData.splice(type === 'left' ? index : index + 1, 0, {
        prop: `column${id}`,
        text: undefined,
        type: 'select',
        dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
      })
      this.tableData.forEach(item => {
        this.$set(item, `column${id}`, '')
      })
    },
    handleHeaderContextMenu (column, event) {
      event.preventDefault()
      event.stopPropagation()
      if (!event.target || !event.target.firstElementChild || !event.target.firstElementChild.firstElementChild) return
      this.pageX = event.pageX
      this.pageY = event.pageY
      this.canClick = true
      const target = event.target.firstElementChild.firstElementChild
      target.click()
    },
    handleDataContextMenu (row, column, event) {
      event.preventDefault()
      event.stopPropagation()
      if (!event.target || !event.target.firstElementChild || !event.target.firstElementChild.firstElementChild) return
      this.pageX = event.pageX
      this.pageY = event.pageY
      this.canClick = true
      const target = event.target.firstElementChild.firstElementChild
      target.click()
    },
    middleHeaderContextMenu (...args) {
      this.showMenu = false
      if (!this.canClick) return
      this.canClick = false
      this.headerContextMenu(...args)
    },
    middleDataContextMenu (...args) {
      this.showMenu = false
      if (!this.canClick) return
      this.canClick = false
      this.dataContextMenu(...args)
    },
    dataContextMenu (event, columnItem, rowIndex, columnIndex) {
      let dropMenuCopy = dropMenuList
      if (columnItem.prop !== 'column2') {
        dropMenuCopy = dropMenuCopy.filter(item => {
          return item.type !== 'bindFlowChart'
        })
      }
      if (columnItem.type === 'text') {
        dropMenuCopy = dropMenuCopy.filter(item => {
          return item.type !== 'deleteColumn' && item.type !== 'addColumnInLeft' && item.type !== 'addColumnInRight'
        })
      }
      this.commonContextMenu(event, dropMenuCopy, rowIndex, columnIndex)
    },
    headerContextMenu (event, column, columnIndex) {
      this.commonContextMenu(event, dropMenuList.filter(item => column.dropMenu.includes(item.type)), -1, columnIndex)
    },
    commonContextMenu (event, dropMenu = [], rowIndex, columnIndex) {
      event.preventDefault()
      event.stopPropagation()
      if (!dropMenu.length || !this.edit) return
      this.rowIndex = rowIndex
      this.columnIndex = columnIndex
      this.dropMenuList = dropMenu
      this.$refs.dropMenu.style.top = `${event.pageY || this.pageY}px`
      let left = event.pageX || this.pageX
      if (event.pageX + 150 >= window.innerWidth) {
        left = event.pageX - 180
      }
      this.$refs.dropMenu.style.left = `${left}px`
      this.showMenu = true
    },
    clickMenu (item) {
      console.log(item.type)
      this.showMenu = false
      this[item.type] && this[item.type]()
    },
    addRowInUp () {
      this.addRow('up')
    },
    addRowInDown () {
      this.addRow('down')
    },
    addRow (type) {
      this.$msgbox({
        title: '提示',
        message: '是否合并单元格',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否',
        beforeClose: (action, instance, done) => {
          this.formatAddRowData(this.rowIndex, type, action === 'confirm' ? 'true' : 'false')
          return done()
        }
      })
    },
    deleteRow () {
      this.tableData.splice(this.rowIndex, 1)
    },
    addColumnInLeft () {
      this.formatAddColumnData(this.columnIndex, 'left')
    },
    addColumnInRight () {
      this.formatAddColumnData(this.columnIndex, 'right')
    },
    deleteColumn () {
      this.tableData.forEach(item => {
        delete item[this.columnData[this.columnIndex].prop]
      })
      this.columnData.splice(this.columnIndex, 1)
    },
    handleValidate () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        this.saveData()
      })
    },
    saveData () {
      this.submitLoading = true
      if (this.manualId) {
        this.createManualDoc()
        return
      }
      this.handleCreateHandbook()
    },
    handleCreateHandbook () {
      const { name, flodId, level } = this.ruleForm
      this.$api.createAuthorizeHandBook({
        manual_name: name,
        folder_id: flodId,
        manual_level: level,
        company_id: this.currentDataSpaceIdGetter
      }).then(this.successCreate).finally(() => {
        this.submitLoading = false
      })
    },
    successCreate (res) {
      const { data, code } = res 
      if (code === 0) {
        this.uploadList = []
        this.$msgMnger.success('新增成功')
        this.manualId = data.id
        this.$router.replace({
          name: this.$route.name,
          query: {
            manual_id: data.id || data.manual_id
          }
        })
        location.reload()
      } else {
        this.$msgMnger.error('新增失败')
      }
    },
    createManualDoc () {
      const { name, flodId, level } = this.ruleForm
      this.$api.createAuthorizeExcel({
        manualname: name,
        folder_id: flodId,
        level: level,
        json_data: JSON.stringify({
          tableData: this.tableData,
          columnData: this.columnData,
        }),
        manual_id: this.manualId
      }).then(res => {
        const { code } = res 
        if (code === 0) {
          this.$msgMnger.success('保存手册成功')
          this.$router.back()
        }
      }).catch(err => {
        this.$msgMnger.warn(err.msg || '请添加内容后再生成手册。')
      }).finally(() => {
        this.submitLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.authorize-wrapper {
    background-color: #fff;
    width: 100%;
    height: 100%;
    text-align: left;
    padding: 24px 32px;
    box-sizing: border-box;
    overflow-y: auto;

    .authorize-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 16px;
    }

    .authorize-handle-wrapper {
        margin-bottom: 16px;
        overflow: hidden;

        .input-desc::before {
            content: '*';
            color: red;
        }

        .handbook-name-input {
            width: 240px;
        }

        .handle-button-list {
          text-align: center;

            .common-button {
                width: 88px;
            }

            .common-button + .common-button {
                margin-left: 12px;
            }
        }
    }

    .authorize-table-wrapper {
        margin-bottom: 30px;
        position: relative;
        /deep/ .el-table__body {
            .el-table__row:hover {
                .el-table__cell {
                    background-color: #fff;
                }
            }

            .el-table__cell{
                padding: 0;
                textarea {
                  font-size: 14px;
                  font-weight: bold;
                }
            }
        }

        /deep/ .el-table__header {
            .el-table__cell{
                padding: 0;
            }
            th {
              textarea {
                font-size: 14px;
                font-weight: bold;
              }
            }
        }

        /deep/ .cell {
            padding: 0;
            line-height: 0;
        }

        .common-table-cell {
            width: 100%;
            padding: 0;
            line-height: 0;
            .common-input {
                width: 100%;
                padding: 0;
                height: 100%;

                /deep/ .el-textarea__inner {
                    border: none;
                    resize: none;
                }

                /deep/ .el-input__inner {
                    border: none;
                }
            }

            .common-select {
              /deep/ .el-input__inner {
                font-size: 12px;
              }
            }
        }

        .common-table-header {
            min-height: 40px;
        }
    }

    .show-table-wrapper {
        position: relative;
        .common-table-header {
            min-height: 40px;
        }

        .common-table-cell {
            white-space: normal;
            width: 100%;
            line-height: 20px;
        }
        /deep/ .el-table {
            thead {
                th {
                    background-color: rgb(250, 250, 250);
                }
            }

            .cell {
                min-height: 40px;
            }
        }
    }

    .common-text {
        white-space: pre-line;
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
    
    .handle-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 9;
    }
}
</style>
