<template>
  <div>
    <v-table
      style="100%"
      :columns="columns"
      :table-data="tableData"
      :cell-edit-done="cellEditDone"
      @contextmenu.prevent.native="oncontextmenuHandle"
      row-hover-color="#eee"
      column-width-drag
      :row-height="50"
    ></v-table>

    <popup
      :left="left"
      :top="top"
      v-if="isShowPopup"
      @addRow="addRowHandle"
      @deleteRow="deleteHandle"
      @cancle="cancleHandle"
      @addCol="addColHandle"
    ></popup>

    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>请输入要添加的</span>
      <el-input v-model="input" placeholder="请输入内容" size="mini"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogHandle">取 消</el-button>
        <el-button type="primary" @click="dialogHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { VTable } from 'vue-easytable'
import 'vue-easytable/libs/themes-base/index.css'
import popup from '../components/editable-table/popup'
import Vue from 'vue'
import c from './c'

Vue.component('c', c)

export default {
  components: {
    VTable,
    popup
  },
  data () {
    return {
      tableData: [
        { 'name': '赵伟', 'tel': '156*****1987', 'hobby': '钢琴、书法、唱歌', 'address': '上海市黄浦区金陵东路569号17楼', _checked: true },
        { 'name': '李伟', 'tel': '182*****1538', 'hobby': '钢琴、书法、唱歌', 'address': '上海市奉贤区南桥镇立新路12号2楼', _disabled: true },
        { 'name': '孙伟', 'tel': '161*****0097', 'hobby': '钢琴、书法、唱歌', 'address': '上海市崇明县城桥镇八一路739号' },
        { 'name': '周伟', 'tel': '197*****1123', 'hobby': '钢琴、书法、唱歌', 'address': '上海市青浦区青浦镇章浜路24号' },
        { 'name': '吴伟', 'tel': '183*****6678', 'hobby': '钢琴、书法、唱歌', 'address': '上海市松江区乐都西路867-871号' }
      ],
      columns: [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection' },
        { overflowTitle: true, field: 'name', title: '姓名', width: 100, titleAlign: 'center', columnAlign: 'center', isEdit: false, isResize: true },
        { overflowTitle: true, field: 'tel', title: '手机号码', width: 260, titleAlign: 'center', columnAlign: 'center', isEdit: true, isResize: true },
        { overflowTitle: true, field: 'hobby', title: '爱好', width: 330, titleAlign: 'center', columnAlign: 'center', isEdit: true, isResize: true },
        { overflowTitle: true, field: 'address', title: '地址', width: 330, titleAlign: 'center', columnAlign: 'left', isEdit: true, isResize: true },
        { overflowTitle: true, field: 'switch', title: '开关', width: 330, titleAlign: 'center', columnAlign: 'center', isEdit: false, isResize: true, componentName: 'c' }
      ],
      left: 0,
      top: 0,
      isShowPopup: false,
      rowIndex: null,
      colIndex: null,
      input: '',
      centerDialogVisible: false
    }
  },
  mounted () {
    let self = this
    window.document.addEventListener('click', function () {
      self.isShowPopup = false
    })
  },
  methods: {
    cellEditDone (newValue, oldValue, rowIndex, rowData, field) {
      console.log(newValue, oldValue, rowIndex, rowData, field)
      this.tableData[rowIndex][field] = newValue
      console.log('this.tableData', this.tableData)
    },
    dialogHandle () {
      if (!this.input) {
        alert('请输入有效的列名')
        return
      }
      this.centerDialogVisible = false
      this.columns.splice(this.colIndex, 0, {
        field: 'newCol', title: this.input, titleAlign: '', columnAlign: '', isEdit: true, isResize: true, width: 200
      })

      let newData = []

      this.tableData.forEach((item) => {
        newData.push({
          ...item,
          newCol: ''
        })
      })
      this.tableData = newData
    },
    addColHandle () {
      this.centerDialogVisible = true
    },
    cancleHandle () {
      this.isShowPopup = false
    },
    addRowHandle () {
      this.tableData.splice(this.rowIndex, 0, {
        name: '',
        tel: '',
        hobby: '',
        address: ''
      })
    },
    deleteHandle () {
      if (this.rowIndex === null) return
      this.tableData.splice(this.rowIndex - 1, 1)
    },
    oncontextmenuHandle (e) {
      let self = this
      console.log(e)
      e.path.forEach(element => {
        if (element.tagName === 'TR') {
          self.rowIndex = Number(element.getAttribute('id')) + 1
        }
        if (element.tagName === 'TD') {
          self.colIndex = Number(element.getAttribute('id')) + 1
        }
      })
      if (e.button === 2) {
        this.isShowPopup = true
        this.left = e.clientX
        this.top = e.clientY
      }
      return false
    },
    selectAll (selection) {},
    selectChange (selection, rowData) {},
    selectGroupChange (selection) {}
  }
}

/* eslint-disable */
// 自定义列组件
  Vue.component('table-operation',{
      template:`<span>
      <a href="" @click.stop.prevent="update(rowData,index)">编辑</a>&nbsp;
      <a href="" @click.stop.prevent="deleteRow(rowData,index)">删除</a>
      </span>`,
      props:{
          rowData:{
              type:Object
          },
          field:{
              type:String
          },
          index:{
              type:Number
          }
      },
      methods:{
          update(){

              // 参数根据业务场景随意构造
              let params = {type:'edit',index:this.index,rowData:this.rowData};
              this.$emit('on-custom-comp',params);
          },

          deleteRow(){

              // 参数根据业务场景随意构造
              let params = {type:'delete',index:this.index};
              this.$emit('on-custom-comp',params);

          }
      }
  })
</script>

<style scoped>

</style>
