<template>
  <div class="comp-input-container">
    <div
      ref="compInput"
      class="comp-input"
      :class="dynamicClassName"
      @blur="handleEditComplete(prop, rowIndex, $event)"
      @keydown.enter.prevent="handleEnter($event)"
      @focus="handleFocus(prop, $event)"
      :contenteditable="$store.getters.disabledGetter ? 'false' : 'true'"
      @mousedown="handleMouseDown($event)"
      @paste="handlePaste($event)"
      v-text="computedInputValue"
    >
<!--      @input="handleInput($event)"-->
<!--      @compositionstart="handleCompositionStart"-->
<!--      @compositionend="handleCompositionEnd"-->
    </div>
    <el-popover
      :disabled="prop !== 'department' && prop !== 'position'"
      v-model="isShowInputAdvice"
      popper-class="input-advice-department"
      placement="top-start"
      trigger="manual"
    >
      <ul class="input-advices-container" v-if="prop === 'position'" ref="advicesPosition">
        <li
          v-for="item in inputAdvice"
          :key="item"
          class="input-advice-item"
          @mousedown.prevent="handleInputAdviceClick(item, $event)"
        >
          {{ item }}
        </li>
      </ul>
      <ul class="input-advices-container input-advices-department" ref="advicesDepartment" v-else-if="prop === 'department'">
        <li
          v-for="item in inputAdvice"
          :key="item"
          class="input-advice-item"
        >
          <span class="input-advice-item__anchor">
            <i class="iconfont iconpaixu input-advice-item__anchor-icon"></i>
          </span>
          <span class="input-advice-item__content"
            @mousedown.prevent="handleInputAdviceClick(item, $event)"
          >{{ item }}</span>
        </li>
      </ul>
    </el-popover>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import Sortable from 'sortablejs'
export default {
  name: 'cell-input',
  props: {
    prop: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: () => {}
    },
    placeholderData: {
      type: Object,
      default: () => {}
    },
    rowIndex: {
      type: Number,
      default: 0
    },
    autoNumber: {
      type: Array,
      default: () => ['no']
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dynamicClassName: '',
      rowData: {},
      isShowInputAdvice: false,
      inputAdvice: []
      // tdHeight: -1,
      // compositionFlag: 0
    }
  },
  computed: {
    computedContentEditable () {
      // if ((this.prop === 'no' && this.isNewExcelGetter) || (this.prop === 'step' && this.rowIndex === 0 && (this.row.step_type === '1' || this.row.step_type === '8'))) {
      // if (this.prop === 'no') {
      //   return false
      // } else {
      //   return 'plaintext-only'
      // }
      return true
    },
    computedInputValue () {
      return this.rowData[this.prop] ? this.rowData[this.prop] : this.placeholderData[this.prop]
    },
    ...mapGetters(['isNewExcelGetter', 'columnPropsGetter', 'departmentListGetter'])
  },
  watch: {
    row: {
      handler () {
        this.dynamicClassName = ''
        this.updateDataAndClass()
        if (this.prop !== 'department') { // 如果是部门/岗位列，不做清空
          this.inputAdvice = []
        }
      },
      deep: true
    },
    tableData: {
      handler () {
        if (this.prop === 'department') {
          let _oldAdviceWithOrder = _.cloneDeep(this.departmentListGetter) // 保存在store中的旧队列，有历史排序信息
          let _advice = this.inputAdviceFilter('department') // 通过遍历数据获取到的队列，排序为按步骤顺序提取的结果
          let _resList = []
          // 保持旧的顺序，去掉已删除的，加入新增的
          if (_oldAdviceWithOrder) {
            for (let i = 0; i < _oldAdviceWithOrder.length; i++) {
              // 按照旧的队列顺序遍历：1.把在新旧队列中都有的放入结果队列；2.旧队列中有新队列没有的忽略掉
              if (_advice.indexOf(_oldAdviceWithOrder[i]) > -1) {
                _resList.push(_oldAdviceWithOrder[i])
              }
            }
            for (let i = 0; i < _advice.length; i++) {
              // 遍历新的队列：把旧队列中没有而新队列中有的加入结果队列
              if (_oldAdviceWithOrder.indexOf(_advice[i]) === -1) {
                _resList.push(_advice[i])
              }
            }
          }
          // console.log('MM', _oldAdviceWithOrder, _advice, _resList)
          this.$store.commit('UPDATE_DEPARTMENT_LIST', { departmentList: _resList, from: 'on-tableData' })
        }
      }
    }
  },
  mounted () {
    this.dynamicClassName = ''
    this.updateDataAndClass()
  },
  methods: {
    updateDataAndClass () {
      let tempRowData = _.cloneDeep(this.row)
      if (!tempRowData.hasOwnProperty(this.prop)) {
        this.$set(tempRowData, this.prop, '')
      }
      if (tempRowData.hasOwnProperty('no')) {
        tempRowData.no = tempRowData.no + ''
      }
      this.rowData = tempRowData
      this.dynamicClassName = this.rowData[this.prop] ? 'show-cell' : 'show-cell-placeholder'
    },
    handleEnter (e) {
      this.isShowInputAdvice = false
      e.target.blur()
    },
    handleEditComplete (prop, rowIndex, $event) {
      // console.log('this.rowData[prop] in blur: ', this.rowData[prop])
      this.rowData[prop] = $event.target.innerText
      if (!this.rowData[prop]) {
        this.dynamicClassName = 'show-cell-placeholder'
        $event.target.innerText = this.placeholderData[prop]
      }
      // this.$store.commit('UPDATE_DEPARTMENT_LIST', { departmentList: _.cloneDeep(this.inputAdviceBak) })
      this.$nextTick(() => {
        this.$store.commit('HANDLE_EDIT', { rowIndex: rowIndex, prop: prop, value: this.rowData[prop].trim() })
      })
      // this.tdHeight = -1
    },
    handleFocus (prop, $event) {
      // 进入编辑状态
      // 初始化输入建议
      if (prop === 'department') {
        // 1. 获取所有部门
        let _advice = this.inputAdviceFilter('department')
        // 2. 根据当前现有的 departmentList 进行排序
        const departmentList = _.cloneDeep(this.columnPropsGetter.departmentList ? this.columnPropsGetter.departmentList : [])
        if (departmentList.length) {
          _advice = this.sortSpecial(departmentList, _advice)
        }
        this.inputAdvice = _advice
        // console.log('this.inputAdvice: ', this.inputAdvice)
      }
      if (prop === 'position') {
        this.inputAdvice = this.inputAdviceFilter('position')
      }
      // 展示输入建议框
      if (this.inputAdvice.length !== 0) {
        this.isShowInputAdvice = true
        if (this.prop === 'department') {
          setTimeout(() => {
            this.setSort()
          }, 100)
        }
        setTimeout(() => {
          this.popperHideListener()
        }, 20)
      }
      if (!this.rowData[prop]) {
        this.dynamicClassName = 'show-cell'
        $event.target.innerText = ''
      }
    },
    /**
     * 输入建议过滤器, 从 tableData 中找出现有的 department / position 值, 组成数组
     * @param prop
     * @returns {[]}
     */
    inputAdviceFilter (prop) {
      let tempInputAdvice = []
      this.tableData.forEach(item => {
        if (!item[prop]) {
        } else if (tempInputAdvice.indexOf(item[prop]) === -1) {
          tempInputAdvice.push(item[prop])
        }
      })
      return tempInputAdvice
    },
    /**
     * 特殊排序方法, arr2 根据 arr1 排序, 无视缺省
     * @param arr1
     * @param arr2
     */
    sortSpecial (arr1, arr2) {
      let arrInArr1 = arr2.filter(item => arr1.indexOf(item) !== -1)
      const arrOutArr1 = arr2.filter(item => arr1.indexOf(item) === -1)
      arrInArr1.sort((a, b) => {
        return arr1.indexOf(a) - arr1.indexOf(b)
      })
      return [...arrInArr1, ...arrOutArr1]
    },
    setSort () {
      const el = this.$refs.advicesDepartment
      let self = this
      Sortable.create(el, {
        handle: '.input-advice-item__anchor-icon',
        onEnd ({ newIndex, oldIndex }) {
          // 传递的 newIndex 与 oldIndex 比数组中 index 大 1
          const targetRow = self.inputAdvice.splice(oldIndex, 1)[0]
          if (!targetRow) {
            return false
          }
          self.inputAdvice.splice(newIndex, 0, targetRow)
          self.$store.commit('UPDATE_DEPARTMENT_LIST', { departmentList: _.cloneDeep(self.inputAdvice) })
        },
        animation: 300
      })
    },
    handleInputAdviceClick (item, e) {
      // console.log('the input advice you click is: ', item)
      this.$refs['compInput'].innerText = item
      this.$refs['compInput'].blur()
      this.$nextTick(() => {
        this.isShowInputAdvice = false
      })
      // this.$store.commit('HANDLE_EDIT', { rowIndex: this.rowIndex, prop: this.prop, value: this.rowData[this.prop].trim() })
    },
    handleMouseDown (e) {
      if (e.button === 2) {
        e.preventDefault()
      }
    },
    handlePaste (e) {
      e.stopPropagation()
      e.preventDefault()
      let temp = e.clipboardData.getData('text/plain') + '^<'
      console.dir(e.clipboardData)
      let selection = window.getSelection()
      let range = selection.getRangeAt(0)
      this.$nextTick(t => {
        range.deleteContents()
        let lineFeedNode = document.createTextNode(temp)
        range.insertNode(lineFeedNode)
        let content = e.target.innerText
        let flagIndex = content.indexOf('^<')
        // console.log('flagIndex is: ', flagIndex)
        e.target.innerText = content.replace(/\^</g, '')
        this.$nextTick(() => {
          range.setStart(e.target.childNodes[0], flagIndex)
          range.collapse(true)
          // this.doForceLayout(e)
        })
      })
    },
    popperHideListener () {
      document.body.addEventListener('mousedown', this.popperMouseDownHandler)
    },
    popperMouseDownHandler (e) {
      try {
        let isOk = false
        const thatInput = this.$refs.compInput
        const thatEl = this.prop === 'department' ? this.$refs.advicesDepartment.parentNode : this.$refs.advicesPosition.parentNode
        let tmpNode = e.target
        for (let i = 0; i < 5; i++) {
          if (tmpNode === thatEl || tmpNode === thatInput) {
            isOk = true
            break
          }
          tmpNode = tmpNode.parentNode
        }
        if (!isOk) {
          this.isShowInputAdvice = false
          document.body.removeEventListener('mousedown', this.popperMouseDownHandler)
        }
      } catch (err) {
        console.log('popper mouse down err is: ', e)
        document.body.removeEventListener('mousedown', this.popperMouseDownHandler)
      }
    }
  }
}
</script>

<style lang="scss">
.comp-input-container {
  position: relative;
  .comp-input {
    display: inline-block;
    width: 100%;
    vertical-align: middle;
    /*white-space: nowrap;*/
    /*text-overflow: ellipsis;*/
    /*overflow: hidden;*/
    line-height: 18px;
    font-size: 14px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    color: #333;
    outline: none;
    word-break: normal;
  }
  .show-cell-placeholder {
    color: #999;
  }
  .show-cell {
    color: #333;
  }
  .el-popover {
    position: absolute;
    min-width: 145px !important;
    padding: 12px 0;
    z-index: 2200;
  }
  .input-advices-container {
    padding: 0;
    margin: 0;
    list-style: none;
    .input-advice-item {
      max-width: 170px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 5px;
      margin: 0;
      height: 30px;
      line-height: 30px;
      transition: all .2s;
      cursor: pointer;
      &:hover {
        background-color: #F5F7FA;
      }
    }
  }
  .input-advices-department {
    .input-advice-item {
      .input-advice-item__anchor {
        display: inline-block;
        margin-right: 22px;
        .input-advice-item__anchor-icon {
          display: none;
          cursor: grab;
        }
      }
      &:hover {
        .input-advice-item__anchor {
          margin-right: 8px;
          .input-advice-item__anchor-icon {
            display: inline-block;
          }
        }
      }
      .input-advice-item__content {
        display: inline-block;
        width: 110px;
      }
    }
  }
}
</style>
