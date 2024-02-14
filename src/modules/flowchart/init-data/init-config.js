// prop <-> title map
export const mapPropInitData = {
  // id: {
  //   title: '唯一标识',
  //   initValue: () => { return +new Date() }
  // },
  no: {
    title: '步骤编号',
    initValue: ''
  },
  department: {
    title: '部门',
    initValue: ''
  },
  position: {
    title: '岗位',
    initValue: ''
  },
  step: {
    title: '步骤',
    initValue: ''
  },
  step_type: {
    title: '步骤类型',
    initValue: ''
  },
  // is_true: {
  //   title: '判断',
  //   initValue: false
  // },
  risk_point: {
    title: '风险点',
    initValue: false
  },
  risk_point_no: {
    title: '风险点编号',
    initValue: ''
  },
  control_point: {
    title: '控制点',
    initValue: false
  },
  control_point_no: {
    title: '控制点编号',
    initValue: ''
  },
  dashed: {
    title: '是否边框虚线',
    initValue: false
  },
  next_step: {
    title: '下一步骤',
    initValue: []
  },
  document: {
    title: '节点文档框',
    initValue: ''
  }
}

// prop <-> placeholder map
export const mapPropPlaceholder = {
  no: '输入步骤编号',
  department: '部门',
  position: '岗位',
  step: '步骤描述',
  step_type: '请选择',
  is_true: '判断',
  risk_point: '风险点',
  risk_point_no: '编号',
  control_point: '控制点',
  control_point_no: '编号',
  dashed: '是否',
  next_step: '连线描述',
  document: '节点文档说明',
  // remark: '步骤备注',
  global_remark: '流程图备注'
}

// props <-> label map
export const columnsConfig = [
  {
    id: 1,
    prop: ['no'],
    label: '步骤编号',
    component: 'cell-reuse-input',
    width: 40,
    isNecessary: true
  },
  {
    id: 2,
    prop: ['step'],
    label: '步骤',
    component: 'cell-reuse-input',
    width: 150,
    isNecessary: true
  },
  {
    id: 3,
    prop: ['step_type'],
    label: '步骤类型',
    component: 'cell-dropdown',
    width: 120,
    isNecessary: true
  },
  {
    id: 4,
    prop: ['next_step'],
    label: '下一步骤',
    component: 'cell-popover',
    width: 80,
    isNecessary: true
  },
  {
    id: 5,
    prop: ['department', 'position'],
    label: '部门/岗位',
    component: 'cell-reuse-input',
    width: 150,
    isNecessary: false
  },
  {
    id: 6,
    prop: ['risk_point', 'risk_point_no', 'control_point', 'control_point_no'],
    label: '风险点/控制点',
    component: 'cell-radio-input',
    width: 150,
    isNecessary: false
  },
  {
    id: 7,
    prop: ['dashed'],
    label: '是否边框虚线',
    component: 'cell-radio',
    width: 88,
    isNecessary: false
  },
  {
    id: 8,
    prop: ['document'],
    label: '节点文档框',
    component: 'cell-reuse-input',
    width: 150,
    isNecessary: false
  }
  // {
  //   id: 9,
  //   prop: ['remark'],
  //   label: '步骤描述',
  //   component: 'cell-reuse-input',
  //   width: 150,
  //   isNecessary: false
  // }
]

// stepType <-> stepType description map
// 作参照用, 不调用
export const mapShapes = [
  {
    type: '1',
    label: '开始或结束'
  },
  {
    type: '2',
    label: '流程'
  },
  {
    type: '3',
    label: '判定'
  },
  {
    type: '4',
    label: '文档'
  },
  {
    type: '5',
    label: '子流程'
  },
  {
    type: '6',
    label: '风险点'
  },
  {
    type: '7',
    label: '控制点'
  },
  {
    type: '8',
    label: '离页'
  }
]

export const mapStepType = [
  {
    type: '1',
    label: '开始',
    icon: 'iconjieshu',
    shapeType: '1'
  },
  {
    type: '2',
    label: '流程',
    icon: 'iconliucheng',
    shapeType: '2'
  },
  {
    type: '3',
    label: '判断',
    icon: 'iconpanduan',
    shapeType: '3'
  },
  {
    type: '4',
    label: '文档',
    icon: 'iconwendang',
    shapeType: '4'
  },
  {
    type: '5',
    label: '子流程',
    icon: 'iconziliucheng',
    shapeType: '5'
  },
  {
    type: '6',
    label: '跨页引用',
    icon: 'iconkuayeyinyong',
    shapeType: '8'
  },
  {
    type: '7',
    label: '结束',
    icon: 'iconjieshu',
    shapeType: '1'
  }
]

// 流程图 和 名字 map
export const mapFlowNName = {
  'initBasicFlow': {
    name: '基本流程图',
    icon: 'iconjibenliuchengtu',
    imgSrc: require('../assets/editable-table/basic-flow-copy.png')
  },
  'initGeneralCrossFunctionFlow': {
    name: '通用跨职能流程图',
    icon: 'icontongyongkuazhineng',
    imgSrc: require('../assets/editable-table/general-cross-function-flow-copy.png')
  },
  'initKPMGCrossFunctionFlow': {
    name: '咨询业专用跨职能流程图',
    icon: 'iconXXXzhuanyong',
    imgSrc: require('../assets/editable-table/XXX-cross-function-flow-copy.png')
  },
  'initCustomFlow': {
    name: '自定义流程图',
    icon: 'iconzidingyi',
    imgSrc: require('../assets/editable-table/custom-flow-copy.png')
  }
}

// 初始化基本流程图
export const initBasicFlow = ['no', 'step', 'step_type', 'next_step']

// 默认 基本流程图
export const initDefaultFlow = ['no', 'step', 'step_type', 'next_step', 'department', 'position', 'risk_point', 'risk_point_no', 'control_point', 'control_point_no', 'dashed', 'document']

// 初始化通用跨职能流程图
export const initGeneralCrossFunctionFlow = ['no', 'step', 'step_type', 'next_step', 'department']
// 毕马威专用跨职能流程图
export const initKPMGCrossFunctionFlow = []
// 自定义流程图
export const initCustomFlow = []

export default {
  mapPropPlaceholder,
  columnsConfig,
  mapStepType,
  initBasicFlow,
  initGeneralCrossFunctionFlow,
  initKPMGCrossFunctionFlow,
  initCustomFlow,
  mapShapes,
  mapFlowNName,
  initDefaultFlow,
  mapPropInitData
}
