import Vue from 'vue'
import _ from 'lodash'

export const INIT_TABLE_DATA = 'INIT_TABLE_DATA'
export const HANDLE_EDIT = 'HANDLE_EDIT'
export const HANDLE_EDIT_RISK_CONTROL_POINT = 'HANDLE_EDIT_RISK_CONTROL_POINT'
export const HANDLE_RISK_CONTROL_NO_AUTO_NUMBER = 'HANDLE_RISK_CONTROL_NO_AUTO_NUMBER'
export const HANDLE_SET_COLUMN_PROPS = 'HANDLE_SET_COLUMN_PROPS'
export const HANDLE_ADD_ROW = 'HANDLE_ADD_ROW' // 添加 新行, 复制一行使用同一个 -> 弃用, 粘贴用下
export const HANDLE_PASTE_ROWS = 'HANDLE_PASTE_ROWS' // 粘贴用
export const HANDLE_DEL_ROW = 'HANDLE_DEL_ROW'
export const HANDLE_XML_DATA_CHANGE = 'HANDLE_XML_DATA_CHANGE'
// 数据通过 tableData[currentTabId] 进行管理
export const HANDLE_CURRENT_TAB_ID_CHANGE = 'HANDLE_CURRENT_TAB_ID_CHANGE'
export const HANDLE_PAGE_NAME_CHANGE = 'HANDLE_PAGE_NAME_CHANGE'
export const TOGGLE_IS_NEW_EXCEL = 'TOGGLE_IS_NEW_EXCEL'
export const CORRECT_NEXT_STEP = 'CORRECT_NEXT_STEP'
export const RESET_VUEX_DATA = 'RESET_VUEX_DATA'
export const AUTO_NUMBER_FOR_R_CLICK = 'AUTO_NUMBER_FOR_R_CLICK'
export const NEXT_STEP_AUTO_GENERATE = 'NEXT_STEP_AUTO_GENERATE'
export const HANDLE_PAGE_DUPLICATED = 'HANDLE_PAGE_DUPLICATED'
export const SET_LOCAL_INFO = 'SET_LOCAL_INFO'
export const MUTATE_DISABLED = 'MUTATE_DISABLED'
export const UPDATE_ACTIVE_TIME_STAMP = 'UPDATE_ACTIVE_TIME_STAMP' // 更新活动时间戳
export const UPDATE_TABLE_DATA = 'UPDATE_TABLE_DATA'
export const UPDATE_DEPARTMENT_LIST = 'UPDATE_DEPARTMENT_LIST' // 更新部门顺序的列表
export const UPDATE_AUTO_NUMBER = 'UPDATE_AUTO_NUMBER'

/**
 * 数组复杂 split 方法
 * @param arr
 * @param rule
 * @returns {*}
 */
function arraySplit ({ arr, rule }) {
  let indexStr = ''
  arr.forEach((item, index, array) => {
    if (rule(item, index, array)) {
      indexStr += 'g' // gap
    } else {
      indexStr += index + 'c' // connector
    }
  })
  // debugger
  const indexArr = indexStr.split('g').map(item => item.split('c').filter(innerItem => Boolean(innerItem))).filter(item => item.length)
  return indexArr.map(item => item.map(innerItem => arr[innerItem]))
}

// 自动编号
// 可以设置起点
// 如果 第一条 为开始 或者 跨页引用 时, 编号从0 开始, 否则从 1 开始
function autoNumberFunc (_tableData, autoNumber) {
  let numberObj = {
    no: 0,
    risk_point_no: 1,
    control_point_no: 1
  }
  // let tempPropsArr = ['no', 'risk_point', 'control_point'] // 由于风险点/控制点编号规则与步骤编号不一致, 因此考虑使用
  let tempPropsArr = ['no']
  // now the step_type is the SHAPE_TYPE, but in component the type IS STEP_TYPE
  if (_tableData[0] && (_tableData[0].step_type === '1' || _tableData[0].step_type === '8')) {
    numberObj.no = 1
  } else {
    numberObj.no = 1
  }
  // numberObj.no = _.minBy(_tableData, item => Number(item.no)).no
  // numberObj.no = _tableData[0].no
  _tableData.forEach((dataItem, index) => {
    if (index === _tableData.length - 1) {
    } else {
      tempPropsArr.forEach(prop => {
        if (prop === 'no') {
          if (autoNumber[prop].value) {
            // dataItem[prop] = numberObj[prop]++ + ''
            Vue.set(dataItem, prop, numberObj[prop]++ + '')
          }
        } else {
          if (dataItem[prop] && autoNumber[prop + '_no'].value) {
            Vue.set(dataItem, prop + '_no', numberObj[prop + '_no']++ + '')
          }
        }
      })
    }
  })
}

// TODO: 添加编号的起点; 考虑新建函数, 使用其进行右键自动编号的逻辑
function autoNumberFuncForRClick (_tableData, rowIndex = 0, startNumber = 0) {
  let tempNo = _tableData[rowIndex].no + ''
  _tableData.forEach((item, index) => {
    if (!item.hasOwnProperty('no')) {
      return false
    }
    if (index <= rowIndex) {
      return false
    } else {
      // item.no = ++startNumber + ''
      item.no = tempNo.replace(/(([0-9]+)\.?)$/g, ++startNumber + '')
    }
  })
}
// function autoNumberFunc (_tableData) {
//   let start = 0 // 0 or 1
//   _tableData.forEach((dataItem, index) => {
//     if (index === _tableData.length - 1) {
//     } else {
//       dataItem.no = start++ + ''
//     }
//   })
// }

function nextStepAutoGenerate (tableData) {
  // 1. is next_step attr is [] (global_remark)
  // 2. if 1, autoGenerate, if not 1, do nothing
  //
  // autoGenerate
  // 2.1 for
  // 2.2 if (item.no not '' and item.step not '') and (item has next_step) and (nextItem.no not '' and nextItem.step not ''):
  //        _temp = {
  //             id: item.id, // 步骤id
  //             no: item.no, // 步骤编号
  //             description: '', // 连线描述
  //             checked: 1, // 选中状态: 0 未选中 1 选中,
  //             step: item.step
  //           }
  //      item.next_step.push(_temp)
  // debugger
  let needToBeGenerated = true
  for (let item of tableData) {
    if (item.id === 'global_remark') {
      continue
    }
    if (item.next_step.length !== 0) {
      needToBeGenerated = false
      console.log('这里就不行了', item, item.next_step)
      break
    }
  }
  if (!needToBeGenerated) {
    return false
  }
  tableData.forEach((item, index, arr) => {
    let nextItem = arr[index + 1] || null
    if (item.id === 'global_remark' || !nextItem) {
      return false
    }
    if ((item.no !== '' && item.step !== '') && item.hasOwnProperty('next_step') && (nextItem.no !== '' && nextItem.step !== '') && nextItem.hasOwnProperty('next_step')) {
      let _temp = {
        id: nextItem.id,
        no: nextItem.no,
        description: '',
        checked: 1,
        step: nextItem.step
      }
      item.next_step.push(_temp)
    }
  })
}

/**
 * state 数据访问器, 递归层级 区分 getter and setter
 * @param flag: getter and setter
 * @param scope 对于哪个变量, 此处为 state
 * @param hierarchicalArr 树状层级数组
 * @param initValue 初始值
 * @param index 数组索引
 * @returns {*}
 */
function dataAccessor (flag, scope, hierarchicalArr, initValue, index = 0) {
  if (flag === 'getter') {
    if (scope.hasOwnProperty(hierarchicalArr[index])) {
      if (index === hierarchicalArr.length - 1) {
        return scope[hierarchicalArr[index]]
      } else {
        return dataAccessor(flag, scope[hierarchicalArr[index]], hierarchicalArr, initValue, ++index)
      }
    } else {
      return initValue
    }
  } else if (flag === 'setter') {
    if (index !== hierarchicalArr.length - 1) {
      if (!scope.hasOwnProperty(hierarchicalArr[index])) {
        // scope[hierarchicalArr[index]] = {}
        Vue.set(scope, hierarchicalArr[index], {})
      }
      return dataAccessor(flag, scope[hierarchicalArr[index]], hierarchicalArr, initValue, ++index)
    } else {
      // scope[hierarchicalArr[index]] = initValue
      Vue.set(scope, hierarchicalArr[index], initValue)
    }
  }
}

const state = {
  // tableData data organization
  // tableData: {
  //   [tabId]: {
  //     data: [{}],
  //     name: pageName,
  //     columnProps: {
  //       flag: flowName,
  //       props: _flowConfig,
  //       autoNumber: {
  //         no: {
  //           value: true
  //         },
  //         risk_point_no: {
  //           value: false
  //         },
  //         control_point_no: {
  //           value: false
  //         }
  //       },
  //       departmentList: []
  //     },
  //     // 表格本地信息
  //     localInfo: {
  //       multiSelectList: [],
  //       pageNum: -1
  //     }
  //   }
  // },
  tableData: {},
  xmlData: '',
  currentTabId: -1,
  isNewExcel: false, // 判断是否为新 excel, 如果是, 进行自动编号, 否, 不作编号处理
  disabled: true, // 如果ws未开启或者执行了关闭，则流程图整个页面为不可编辑状态（disabled === true）
  activeTimeStamp: 0,
  // 风险点/控制点的样式，是否带前面的字母
  numberStyle: {
    riskConfig: '1',
    controlConfig: '1'
  }
}

const getters = {
  tableDataGetter: state => state.tableData[state.currentTabId] ? (state.tableData[state.currentTabId].data ? state.tableData[state.currentTabId].data : []) : [],
  columnPropsGetter: state => state.tableData[state.currentTabId] ? (state.tableData[state.currentTabId].columnProps ? state.tableData[state.currentTabId].columnProps : []) : [],
  xmlDataGetter: state => state.xmlData,
  dataGetter: state => state.tableData,
  currentTabIdGetter: state => state.currentTabId,
  // 返回 no 编号的数组
  dataNoArrGetter: state => {
    if (state.tableData[state.currentTabId] && state.tableData[state.currentTabId].data) {
      // 有数据, 返回数组
      return state.tableData[state.currentTabId].data.map(item => {
        return item.no
      })
    }
  },
  isNewExcelGetter: state => state.isNewExcel,
  // noAndStepGetter: state => {
  //   if (!state.tableData[state.currentTabId] || !state.tableData[state.currentTabId].data) {
  //     return []
  //   } else {
  //     return state.tableData[state.currentTabId].data.map(item => ({ id: item.id, no: item.no, step: item.step }))
  //   }
  // }
  pageNameGetter: state => state.tableData[state.currentTabId].name,
  multiSelectListGetter: (state) => {
    return dataAccessor('getter', state, ['tableData', state.currentTabId, 'localInfo',
      'multiSelectList'], [])
  },
  pageNumGetter: (state) => dataAccessor('getter', state, ['tableData', state.currentTabId, 'localInfo',
    'pageNum'], -1),
  departmentListGetter: (state) => dataAccessor('getter', state, ['tableData', state.currentTabId, 'columnProps', 'departmentList'], 0),
  disabledGetter: state => state.disabled,
  activeTimeStampGetter: state => state.activeTimeStamp
}
const actions = {
}

const mutations = {
  changeNumberStyle: (state, data) => {
    state.numberStyle = data
  },
  [HANDLE_EDIT]: (state, { rowIndex, prop, value }) => {
    state.tableData[state.currentTabId].data[rowIndex][prop] = value
    console.log('In vuex: 编辑完成', rowIndex, prop, value)
    // if prop is STEP_TYPE, then trigger the AUTO_NUMBER_FUNC
    // if (state.isNewExcel && prop === 'step_type') {
    //   autoNumberFunc(state.tableData[state.currentTabId].data) // 自动编号
    // }
    if (prop === 'no' || prop === 'step_type') {
      autoNumberFunc(state.tableData[state.currentTabId].data, state.tableData[state.currentTabId].columnProps.autoNumber) // 自动编号
    }
    if (prop === 'next_step') {
      // mutations['CORRECT_NEXT_STEP'](state, state.currentTabId)
    }
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
  },
  [INIT_TABLE_DATA]: (state, { tableData }) => {
    if (!state.tableData[state.currentTabId]) {
      Vue.set(state.tableData, state.currentTabId, {})
    }
    Vue.set(state.tableData[state.currentTabId], 'data', tableData)
    // if (state.isNewExcel) {
    //   autoNumberFunc(state.tableData[state.currentTabId].data) // 自动编号
    // }
    autoNumberFunc(state.tableData[state.currentTabId].data, state.tableData[state.currentTabId].columnProps.autoNumber) // 自动编号
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
  },
  [HANDLE_EDIT_RISK_CONTROL_POINT]: (state, { rowIndex, data }) => {
    let propsArr = ['risk_point', 'risk_point_no', 'control_point', 'control_point_no']
    propsArr.forEach(item => {
      Vue.set(state.tableData[state.currentTabId].data[rowIndex], item, data[item] === undefined ? '' : data[item])
    })
    // autoNumberFunc(state.tableData[state.currentTabId].data, state.tableData[state.currentTabId].columnProps.autoNumber) // 自动编号
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
    // 进行自动编号
    mutations[HANDLE_RISK_CONTROL_NO_AUTO_NUMBER](state)
  },
  [HANDLE_RISK_CONTROL_NO_AUTO_NUMBER]: (state) => {
    const autoNumber = dataAccessor('getter', state, ['tableData', state.currentTabId, 'columnProps',
      'autoNumber'], {})
    // 1. 判断是否需要自动编号
    if (!autoNumber.control_point_no.value && !autoNumber.risk_point_no.value) {
      return
    }
    // 2. 进行自动编号 (考虑既是风险点又是控制点的情况)
    // 2.0 数据准备
    const data = dataAccessor('getter', state, ['tableData', state.currentTabId, 'data'], []) // 数组数据
    const thumbnailRiskControlList = [] // 临时数组, 保存有可能编号改动的数据 thumbnail { index, control_point, risk_point, value: 预期值 }
    const { riskConfig, controlConfig } = state.numberStyle
    let riskPointList // 风险点列表
    const riskPointTemplate = riskConfig === '1' ? 'R$' : '$' // 风险点模板
    let controlPointList // 控制点列表
    let controlPointTemplate = controlConfig === '1' ? 'C$1.$2' : '$1.$2' // 控制点模板
    // 风险点自己编号, 控制点按照风险点进行分组
    // 2.1 遍历数组, 找出需要修改的数组
    data.forEach((item, index) => {
      // 不处理备注行, 非控制点&非风险点不计入
      if (item.id === 'global_remark' || (!item.control_point && !item.risk_point)) {
        return
      }
      thumbnailRiskControlList.push({ index, control_point: item.control_point, risk_point: item.risk_point, value: '' })
    })
    // 2.2 计算风险点数组: 过滤 + 赋值
    riskPointList = thumbnailRiskControlList.filter(item => item.risk_point).map((item, index) => {
      item.value = riskPointTemplate.replace('$', index + 1 + '')
      return item
    })
    // 2.3 计算控制点数组: 分组 + 赋值 + 组合
    controlPointList = arraySplit({
      arr: thumbnailRiskControlList,
      rule: item => item.risk_point
    }).map((item, index) => {
      return item.map((innerItem, innerIndex) => {
        innerItem.value = controlPointTemplate.replace('$1', index + 1 + '').replace('$2', innerIndex + 1 + '')
        return innerItem
      })
    }).reduce((prev, item) => prev.concat(item), [])
    // 3. 赋值
    controlPointList.concat(riskPointList).forEach(item => {
      Vue.set(state.tableData[state.currentTabId].data[item.index], item.risk_point ? 'risk_point_no' : 'control_point_no', item.value)
    })
  },
  // vuex 中 存入 自定义列
  [HANDLE_SET_COLUMN_PROPS]: (state, { columnProps }) => {
    // debugger
    if (!state.tableData[state.currentTabId]) {
      Vue.set(state.tableData, state.currentTabId, {})
    }
    Vue.set(state.tableData[state.currentTabId], 'columnProps', columnProps)
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
    // 进行自动编号
    mutations[HANDLE_RISK_CONTROL_NO_AUTO_NUMBER](state)
  },
  // add a new row
  [HANDLE_ADD_ROW]: (state, { rowIndex, rowData, flag }) => {
    // 1. reset local info: pageNum
    mutations[SET_LOCAL_INFO](state, { attr: 'pageNum', value: -1 })
    let _rowIndex
    if (flag === 'before') {
      _rowIndex = rowIndex
      // state.tableData[state.currentTabId].data.splice(rowIndex, 0, rowData)
    } else {
      _rowIndex = rowIndex + 1
      // state.tableData[state.currentTabId].data.splice(rowIndex + 1, 0, rowData)
    }
    let _temp = null
    let _no = -1
    const preRowData = state.tableData[state.currentTabId].data[_rowIndex - 1] || {}
    let nextRowData = state.tableData[state.currentTabId].data[_rowIndex] || {}
    // console.log('nextRowData is: ', nextRowData)
    // 修正上一步骤的编号, 使之连续
    if (!preRowData.hasOwnProperty('id')) {
    } else if (preRowData.id === 'global_remark') {
    } else {
      // 1. 拿到 preRowData 的 next_step
      const _nextStep = preRowData.next_step
      // 2. 看是否与 nextRowData 相连, 若相连, 则修正 next_step 中的改项为 与 rowData 相连
      const _nextRowIndex = _nextStep.findIndex(item => item.id === nextRowData.id)
      if (_nextRowIndex !== -1) {
        const _tempStep = {
          id: rowData.id,
          no: rowData.no,
          description: '',
          checked: 1,
          step: rowData.step
        }
        _nextStep.splice(_nextRowIndex, 1, _tempStep)
        console.log('连起来喽')
      }
    }
    // 修正下一步骤的编号
    if (!nextRowData.hasOwnProperty('id')) {
    } else if (nextRowData.id === 'global_remark') {
    } else {
      _temp = {
        id: nextRowData.id,
        no: nextRowData.no,
        description: '',
        checked: 1,
        step: nextRowData.step
      }
      if (nextRowData.no === '') {
        _no = ''
      } else {
        let tempNo = Number(nextRowData.no)
        if (isNaN(tempNo)) {
          _no = ''
        } else {
          _no = Number(nextRowData.no) - 1
        }
      }
    }
    rowData.no = _temp ? _no : rowData.no
    rowData.next_step = _temp ? [_temp] : rowData.next_step
    state.tableData[state.currentTabId].data.splice(_rowIndex, 0, rowData)
    // if (state.isNewExcel) {
    //   autoNumberFunc(state.tableData[state.currentTabId].data) // 自动编号
    // }
    autoNumberFunc(state.tableData[state.currentTabId].data, state.tableData[state.currentTabId].columnProps.autoNumber) // 自动编号
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
    // 风险点控制点自动编号
    mutations[HANDLE_RISK_CONTROL_NO_AUTO_NUMBER](state)
  },
  [HANDLE_PASTE_ROWS]: (state, { rowIndex, rowData }) => {
    // 1. reset local info: pageNum
    mutations[SET_LOCAL_INFO](state, { attr: 'pageNum', value: -1 })
    // 2. calc index
    let _rowIndex = rowIndex + 1
    // 3. paste
    let tmpIndex = 0
    rowData.forEach(item => {
      state.tableData[state.currentTabId].data.splice(_rowIndex + tmpIndex++, 0, item)
    })
    // 4. auto number
    autoNumberFunc(state.tableData[state.currentTabId].data, state.tableData[state.currentTabId].columnProps.autoNumber) // 自动编号
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
    // 风险点控制点自动编号
    mutations[HANDLE_RISK_CONTROL_NO_AUTO_NUMBER](state)
  },
  // del a row
  [HANDLE_DEL_ROW]: (state) => {
    // 1. reset local info: pageNum
    mutations[SET_LOCAL_INFO](state, { attr: 'pageNum', value: -1 })
    // 2. do del
    state.tableData[state.currentTabId].data = state.tableData[state.currentTabId].data.filter(dataItem =>
      state.tableData[state.currentTabId].localInfo.multiSelectList.findIndex(
        selectedItem => selectedItem === dataItem.id
      ) === -1)
    // state.tableData[state.currentTabId].data.splice(rowIndex, 1)
    // if (state.isNewExcel) {
    //   autoNumberFunc(state.tableData[state.currentTabId].data) // 自动编号
    // }
    dataAccessor('setter', state, ['tableData', state.currentTabId, 'localInfo', 'multiSelectList'], [])
    autoNumberFunc(state.tableData[state.currentTabId].data, state.tableData[state.currentTabId].columnProps.autoNumber) // 自动编号
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
    // 风险点控制点自动编号
    mutations[HANDLE_RISK_CONTROL_NO_AUTO_NUMBER](state)
  },
  [HANDLE_XML_DATA_CHANGE]: (state, xmlData) => {
    state.xmlData = xmlData
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
  },
  [HANDLE_CURRENT_TAB_ID_CHANGE]: (state, currentTabId) => {
    state.currentTabId = currentTabId
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
  },
  [HANDLE_PAGE_NAME_CHANGE]: (state, pageName) => {
    if (!state.tableData[state.currentTabId]) {
      Vue.set(state.tableData, state.currentTabId, {})
    }
    Vue.set(state.tableData[state.currentTabId], 'name', pageName)
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
  },
  [TOGGLE_IS_NEW_EXCEL]: (state, isNewExcel) => {
    state.isNewExcel = isNewExcel
  },
  [CORRECT_NEXT_STEP]: (state, tabId) => {
    let tempData = _.cloneDeep(state.tableData[tabId].data)
    // 过滤掉 next_step 中 tableData 中没有的
    tempData.forEach((outerItem, outerIndex, arr) => {
      if (outerItem.id === 'global_remark' || !outerItem.hasOwnProperty('next_step')) {
        return false
      }
      outerItem.next_step = outerItem.next_step.filter(middleItem => {
        return arr.some(innerItem => innerItem.id === middleItem.id)
      })
    })
    // 修正值
    tempData.forEach((outerItem, outerIndex, arr) => {
      if (outerItem.id === 'global_remark' || !outerItem.hasOwnProperty('next_step')) {
        return false
      }
      outerItem.next_step.forEach(middleItem => {
        arr.forEach(innerItem => {
          if (outerItem.id === 'global_remark' || !outerItem.hasOwnProperty('next_step')) {
            return false
          } else if (innerItem.id === middleItem.id) {
            middleItem.step = innerItem.step
            middleItem.no = innerItem.no
          }
        })
      })
      // 修正之后再进行过滤
      const _ids = []
      outerItem.next_step = outerItem.next_step.filter(middleItem => {
        // 验证 no 和 step
        const bool1 = Boolean(middleItem.no !== '' && middleItem.step !== '')
        // 去重, 验证 id 的重复性
        let bool2 = true
        if (_ids.indexOf(middleItem.id) === -1) {
          _ids.push(middleItem.id)
        } else {
          bool2 = false
        }
        return bool1 && bool2
      })
    })
    state.tableData[tabId].data = tempData
    console.log('correct the next step: done')
  },
  [NEXT_STEP_AUTO_GENERATE]: (state, tabId) => {
    // 如果下一步骤都为空, 则填充下一步骤的值
    nextStepAutoGenerate(state.tableData[tabId].data)
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
  },
  [RESET_VUEX_DATA]: state => {
    state.tableData = {}
    state.xmlData = ''
    state.isNewExcel = false
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
  },
  [AUTO_NUMBER_FOR_R_CLICK]: (state, { rowIndex, startNumber }) => {
    autoNumberFuncForRClick(state.tableData[state.currentTabId].data, rowIndex, startNumber)
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
  },
  [HANDLE_PAGE_DUPLICATED]: (state, { curTabId }) => {
    Vue.set(state.tableData, curTabId, _.cloneDeep(state.tableData[state.currentTabId]))
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
  },
  /**
   * 设置本地信息
   * @param state
   * @param flag
   * @param attr
   * @param value
   * @param initValue
   */
  [SET_LOCAL_INFO]: (state, { attr, value }) => {
    dataAccessor('setter', state, ['tableData', state.currentTabId, 'localInfo', attr], value)
    // console.log('设置成功, attr is: ', attr, ', value is: ', value)
    // 更新活动时间
    mutations[UPDATE_ACTIVE_TIME_STAMP](state)
  },
  [MUTATE_DISABLED]: (state, { disabled }) => {
    state.disabled = disabled
  },
  [UPDATE_ACTIVE_TIME_STAMP]: (state) => {
    state.activeTimeStamp = +new Date()
  },
  [UPDATE_TABLE_DATA]: (state, { data, tabId }) => {
    const _tabId = tabId || state.currentTabId
    dataAccessor('setter', state, ['tableData', _tabId, 'data'], data)
  },
  [UPDATE_DEPARTMENT_LIST]: (state, { departmentList, tabId }) => {
    const _tabId = tabId || state.currentTabId
    dataAccessor('setter', state, ['tableData', _tabId, 'columnProps', 'departmentList'], departmentList)
  },
  [UPDATE_AUTO_NUMBER]: (state, { autoNumber, tabId }) => {
    const _tabId = tabId || state.currentTabId
    dataAccessor('setter', state, ['tableData', _tabId, 'columnProps', 'autoNumber'], autoNumber)
  }
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
