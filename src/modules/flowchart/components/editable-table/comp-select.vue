<template>
  <div class="comp-select">
    <div>
      <el-row
        v-for="item in nextStepData"
        :key="item.id"
      >
        <el-col :span="6">
          <el-checkbox
            :disabled="checkboxDisabled && !item.checked"
            v-model="item.checked" :true-label="1"
            :false-label="0"
            @change="handleChange(item)"
          >
            {{ item.no }}
          </el-checkbox>

        </el-col>
        <el-col :span="18">
          <input
            type="text"
            :ref="'input' + item.id"
            v-model.lazy="item.description"
            :disabled="item.checked ? false : 'disabled'"
            :style="{ cursor: item.checked ? 'text' : 'not-allowed' }"
            @focus="handleInputFocus(item.id, $event)"
            @keyup.enter.prevent="$event.target.blur()"
            @blur="isShowInputAdvice = false"
            @change="handleChange"
            placeholder="连线描述"
            :title="item.checked ? '' : '请选中之后再填写连线描述'"
          />
          <el-popover
            :disabled="currentId !== item.id"
            v-model="isShowInputAdvice"
            placement="top-start"
            trigger="manual"
            popper-class="inner-popover__popper"
          >
            <ul class="input-advices-container">
              <li
                v-for="innerItem in inputAdvice"
                :key="innerItem"
                class="input-advice-item"
                @mousedown.prevent="handleInputAdviceClick(innerItem, item, $event)"
              >
                {{ innerItem }}
              </li>
            </ul>
          </el-popover>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'comp-select',
  components: {
  },
  props: {
    prop: {
      type: [Array, String],
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
    nextStepOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      nextStepData: [],
      checkedData: [], // 保存选中的数组
      tempValue: '',
      isShowInputAdvice: false,
      inputAdvice: ['通过', '不通过', '是', '否'],
      // 展开建议的一行的 id
      currentId: -1
      // handleNextStepChangeDebounce: null
    }
  },
  computed: {
    checkboxDisabled () {
      let count = 0
      this.nextStepData.forEach(e => {
        if (e.checked) {
          count++
        }
      })
      return count > 2
    }
  },
  watch: {
    nextStepOptions: {
      handler () {
        this.initNextStepData()
        // _.debounce(this.initNextStepData, 30)()
      },
      deep: true
    }
  },
  mounted () {
    this.initNextStepData()
    this.handleNextStepChangeDebounce = _.debounce(this.handleNextStepChange, 0)
    // 数据初始化完了后要重置 父组件 单元格内容
  },
  methods: {
    initNextStepData () {
      if (!this.row[this.prop[0]]) {
        return false
      } else if (this.row[this.prop[0]].length === 0) {
        // 如果初始值为空数组, 进行初始化
        this.nextStepData = this.nextStepOptions.map(item => {
          return ({
            id: item.id, // 步骤id
            no: item.no, // 步骤编号
            description: '', // 连线描述
            checked: 0, // 选中状态: 0 未选中 1 选中
            step: item.step
          })
        })
      } else {
        // 否则复显
        // this.nextStepData = this.row[this.prop[0]]
        // 复显逻辑
        // let temp = this.row[this.prop[0]]
        let temp = _.cloneDeep(this.row[this.prop[0]])
        this.nextStepData = this.nextStepOptions.map(item => {
          for (let i = 0; i < temp.length; i++) {
            if (item.id === temp[i].id) {
              // 修正编号
              temp[i].no = item.no
              // 修正内容
              temp[i].step = item.step
              // 特殊处理: 结束前的那条数据没有 checked 字段, 因此添加
              if (!temp[i].hasOwnProperty('checked')) {
                // console.log('checked is trigger')
                this.$set(temp[i], 'checked', 1)
              }
              return temp[i]
            }
          }
          return ({
            id: item.id, // 步骤id
            no: item.no, // 步骤编号
            description: '', // 连线描述
            checked: 0, // 选中状态: 0 未选中 1 选中,
            step: item.step
          })
        })
      }
      this.$emit('step-change', this.nextStepData)
    },
    handleNextStepChange () {
      let tempNextStepData = _.cloneDeep(this.nextStepData)
      tempNextStepData = tempNextStepData.filter(item => item.checked)
      // console.log('tempNextStepData', tempNextStepData)
      this.$store.commit('HANDLE_EDIT', { rowIndex: this.rowIndex, prop: this.prop[0], value: tempNextStepData })
    },
    handleNextStepChangeDebounce () {},
    handleChange (item) {
      // 当 checkbox 值为 false 时, 清空掉输入框内容
      if (!item.checked) {
        item.description = ''
      }
      this.$emit('step-change', this.nextStepData)
      // this.handleNextStepChangeDebounce()
      this.handleNextStepChange()
    },
    /**
     * 当前 focus 的 input 的 focus 事件
     * @param id
     * @param event
     */
    handleInputFocus (id, event) {
      this.currentId = id
      this.isShowInputAdvice = true
    },
    handleInputAdviceClick (content, item, event) {
      this.isShowInputAdvice = false
      item.description = content
      this.handleChange(item)
      this.$refs['input' + item.id][0].blur()
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-select {
  input {
    width: 90%;
    border-bottom: 1px solid #bbb;
    border-top: none;
    border-left: none;
    border-right: none;
    outline: none;
    padding: 0 0 0 5px;
    color: #333;
    &:placeholder-shown {
      background-color: #fefefe;
    }
    &::placeholder {
      color: #999;
    }
    &:disabled {
      &::placeholder {
        color: #999;
      }
    }
  }
}
.el-row {
  height: 30px !important;
}
</style>

<style lang="scss">
.inner-popover__popper {
  position: absolute;
  min-width: 120px !important;
  padding: 2px 0;
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
    height: 20px;
    line-height: 20px;
    transition: all .2s;
    cursor: pointer;
    &:hover {
      background-color: #F5F7FA;
    }
  }
}
</style>
