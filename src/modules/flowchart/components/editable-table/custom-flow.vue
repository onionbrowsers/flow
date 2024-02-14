<template>
  <div id="custom-flow">
    <div class="props-data-box">
      <el-scrollbar style="height: 500px;">
        <div class="data-box" ref="dataBox">
          <div class="data-header-container">
            <div class="data-header-content">
                <el-row>
                  <el-col :span="1" :offset="1">
                    <el-checkbox :indeterminate="checkAllObj.isIndeterminate" v-model="checkAllObj.isCheckAll" @change="handleCheckAllChange"></el-checkbox>
                  </el-col>
                  <el-col :span="7">
                    <div>名称</div>
                  </el-col>
                  <el-col :span="7">
                    <div>说明</div>
                  </el-col>
                  <el-col :span="8">
                    <div>设置</div>
                  </el-col>
                </el-row>
            </div>
          </div>
          <div
            :class="'data-body-container ' + item.prop + (index === 0 ? ' fixed-item' : '')"
            v-for="(item, index) in propsData"
            :key="item.prop"
          >
            <div
              v-if="item.children"
              class="data-item-chunk"
            >
              <div
                class="item"
                v-for="innerItem in item.children"
                :key="innerItem.prop"
              >
                <el-row>
                  <el-col :span="1">
                    <div class="sort-icon">
                      <i class="iconfont iconpaixu"></i>
                    </div>
                  </el-col>
                  <el-col :span="1">
                    <el-checkbox
                      :disabled="innerItem.prop === 'no' || innerItem.prop === 'step' || innerItem.prop === 'step_type' || innerItem.prop === 'next_step'"
                      v-model="checkedObj[innerItem.prop]"
                      @click.native="handleCheckboxClick(innerItem.prop, checkedObj[innerItem.prop])"
                    ></el-checkbox>
                  </el-col>
                  <el-col :span="7">
                    <div>{{ innerItem.name }}</div>
                  </el-col>
                  <el-col :span="7">
                    <div>{{ innerItem.explain }}</div>
                  </el-col>
                  <el-col :span="8">
                    <el-checkbox
                      v-if="autoNumberObj.hasOwnProperty(innerItem.prop) && innerItem.prop === 'no'"
                      v-model="autoNumberObj[innerItem.prop].value"
                      :disabled="!checkedObj[innerItem.prop]"
                    >
                      自动编号
                    </el-checkbox>
                    <el-checkbox
                      v-else-if="autoNumberObj.hasOwnProperty(innerItem.prop) && innerItem.prop !== 'no'"
                      v-model="autoNumberObj['risk_point_no'].value"
                      :disabled="!checkedObj[innerItem.prop]"
                    >
                      自动编号
                    </el-checkbox>
                    <div v-else> </div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-else class="data-item-chunk">
              <div class="item">
                <el-row>
                  <el-col :span="1">
                    <div class="sort-icon">
                      <i class="iconfont iconpaixu"></i>
                    </div>
                  </el-col>
                  <el-col :span="1">
                    <el-checkbox
                      v-model="checkedObj[item.prop]"
                      @click.native="handleCheckboxClick(item.prop, checkedObj[item.prop])"
                    ></el-checkbox>
                  </el-col>
                  <el-col :span="7">
                    <div>{{ item.name }}</div>
                  </el-col>
                  <el-col :span="7">
                    <div>{{ item.explain }}</div>
                  </el-col>
                  <el-col :span="8">
                    <div> </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'custom-flow',
  props: {
    currentFlowType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      propsData: [
        {
          prop: 'fixed_item',
          children: [
            {
              prop: 'no',
              name: '步骤编号',
              explain: '步骤的编号',
              sort: '排序',
              set: '自动编号',
              rowDisabled: true
            },
            {
              prop: 'step',
              name: '步骤',
              explain: '步骤的编号',
              sort: '排序',
              set: '',
              rowDisabled: true
            },
            {
              prop: 'step_type',
              name: '步骤类型',
              explain: '步骤的编号',
              sort: '排序',
              set: ''
            },
            {
              prop: 'next_step',
              name: '下一步骤',
              explain: '步骤的编号',
              sort: '排序',
              set: ''
            }
          ]
        },
        {
          prop: 'department',
          name: '部门',
          explain: '步骤的编号',
          sort: '排序',
          set: '',
          rowDisabled: true
        },
        {
          prop: 'position',
          name: '岗位',
          explain: '步骤的编号',
          sort: '排序',
          set: '',
          rowDisabled: true
        },
        {
          prop: 'risk_control',
          children: [
            {
              prop: 'risk_point',
              name: '风险点',
              explain: '步骤的编号',
              sort: '排序',
              set: ''
            },
            {
              prop: 'risk_point_no',
              name: '风险点编号',
              explain: '步骤的编号',
              sort: '排序',
              set: '自动编号',
              customNum: true
            },
            {
              prop: 'control_point',
              name: '控制点',
              explain: '步骤的编号',
              sort: '排序',
              set: ''
            },
            {
              prop: 'control_point_no',
              name: '控制点编号',
              explain: '步骤的编号',
              sort: '排序',
              set: '自动编号',
              customNum: true
            }
          ]
        },
        {
          prop: 'document',
          name: '节点文档框',
          explain: '步骤的编号',
          sort: '排序',
          set: ''
        },
        {
          prop: 'dashed',
          name: '虚线边框',
          explain: '步骤的边框',
          sort: '排序',
          set: ''
        }
      ],
      checkList: [],
      checkedObj: {
        no: true,
        step: true,
        step_type: true,
        next_step: true,
        department: false,
        position: false,
        risk_point: false,
        risk_point_no: false,
        control_point: false,
        control_point_no: false,
        document: false,
        dashed: false
      },
      checkboxClickTimesController: 0,
      checkAllObj: {},
      autoNumberObj: {
        no: {
          value: true
        },
        risk_point_no: {
          value: false
        },
        control_point_no: {
          value: false
        }
      }
    }
  },
  computed: {
    ...mapGetters(['columnPropsGetter'])
  },
  watch: {
    checkedObj: {
      handler () {
        this.autoNumberObjCorrection()
      },
      deep: true
    }
  },
  mounted () {
    this.setSort()
    this.$emit('setConfirmBool', false)
    this.initFunc()
    this.autoNumberObjCorrection()
  },
  methods: {
    initFunc () {
      // 复显排序, 对 propsData 进行处理
      let _flowType = this.columnPropsGetter.flag
      console.log('_flowType is: ', _flowType)
      console.log('this.currentFlowType is: ', this.currentFlowType)
      if (_flowType !== this.currentFlowType) {
        if (this.currentFlowType === 'initKPMGCrossFunctionFlow') {
          // 如果是中天恒, 默认 all checked
          for (let key in this.checkedObj) {
            this.checkedObj[key] = true
          }
        }
        return false
      }
      let _flowConfig = this.columnPropsGetter.props
      let _autoNumber = this.columnPropsGetter.autoNumber
      let _propsData = []
      _flowConfig.forEach(levelOneItem => {
        let _temp = this.propsData.find(levelTwoItem => {
          if (levelTwoItem.children) {
            return levelTwoItem.children.some(levelThreeItem => levelThreeItem.prop === levelOneItem)
          } else {
            return levelTwoItem.prop === levelOneItem
          }
        })
        if (!_propsData.some(item => _.isEqual(item, _temp))) {
          _propsData.push(_temp)
        }
        this.checkedObj[levelOneItem] = this.checkedObj.hasOwnProperty(levelOneItem)
      })
      this.propsData.forEach(item => {
        if (!_propsData.some(innerItem => _.isEqual(item, innerItem))) {
          _propsData.push(item)
        }
      })
      this.propsData = _propsData
      this.autoNumberObj = _autoNumber ? _.cloneDeep(_autoNumber) : this.autoNumberObj
    },
    setSort () {
      const el = this.$refs.dataBox
      let self = this
      Sortable.create(el, {
        handle: '.sort-icon',
        onEnd ({ newIndex, oldIndex }) {
          // 传递的 newIndex 与 oldIndex 比数组中 index 大 1
          const targetRow = self.propsData.splice(oldIndex - 1, 1)[0]
          if (!targetRow) {
            return false
          }
          self.propsData.splice(newIndex - 1, 0, targetRow)
        },
        onMove: function (evt) {
          let parentNode = evt.related
          let forbiddenNode = document.getElementsByClassName('fixed-item')[0]
          if (_.isEqual(parentNode, forbiddenNode)) {
            return false
          }
        },
        animation: 300,
        filter: '.fixed-item'
      })
    },
    handleCheckboxClick (prop, value) {
      // 控制只执行一次
      if (this.checkboxClickTimesController) {
        this.checkboxClickTimesController = 0
        return false
      }
      this.checkboxClickTimesController++
      let tempArr = ['risk_point', 'control_point']
      tempArr.forEach(item => {
        if (item === prop) {
          if (value) {
            setTimeout(() => {
              this.checkedObj[item + '_no'] = false
              this.checkedObj[prop] = false
            })
          }
        } else if ((item + '_no') === prop) {
          if (!value && !this.checkedObj[item]) {
            setTimeout(() => {
              this.checkedObj[item] = true
              this.checkedObj[prop] = true
            })
          }
        }
      })
    },
    handleCheckAllChange () {
      if (this.checkAllObj.isCheckAll) {
        for (let key in this.checkedObj) {
          this.checkedObj[key] = this.checkAllObj.isCheckAll
        }
      } else {
        for (let key in this.checkedObj) {
          if (key === 'no' || key === 'step' || key === 'step_type' || key === 'next_step') {
            continue
          }
          this.checkedObj[key] = this.checkAllObj.isCheckAll
        }
      }
    },
    selectedDataFilter () {
      let data = []
      let flowConfig = []
      this.propsData.forEach(item => {
        if (item.children) {
          // 如果为数组, 遍历
          item.children.forEach(innerItem => {
            if (this.checkedObj[innerItem.prop]) {
              flowConfig.push(innerItem.prop)
            }
          })
        } else {
          if (this.checkedObj[item.prop]) {
            flowConfig.push(item.prop)
          }
        }
      })
      data = [_.cloneDeep(this.autoNumberObj), flowConfig]
      return data
    },
    autoNumberObjCorrection () {
      let _count = 0
      for (let key in this.checkedObj) {
        if (this.checkedObj[key]) {
          _count++
        }
        if (this.autoNumberObj.hasOwnProperty(key)) {
          if (!this.checkedObj[key]) {
            this.autoNumberObj[key].value = false
          }
        }
      }
      this.checkAllObj = { isIndeterminate: _count !== 0 && _count !== 12, isCheckAll: _count === 12 }
    }
  }
}
</script>

<style lang="scss" scoped>
#custom-flow {
  text-align: center;
  .data-box {
    padding: 10px;
    .data-header-container {
      .data-header-content {
        height: 35px;
        border-bottom: 1px solid #efefef;
      }
    }
    .data-body-container {
      .data-item-chunk {
        .sort-icon {
          height: 54px !important;
          /*background-color: pink;*/
          visibility: hidden;
          .iconfont {
            font-size: 20px !important;
          }
        }
        &:hover {
          background-color: #E1EEFF;
          .sort-icon {
            visibility: visible;
            &:hover {
              cursor: grab;
            }
          }
        }
        .item {
          height: 54px;
          line-height: 54px;
          border-bottom: 1px solid #efefef;
        }
      }
    }
  }
}
</style>
