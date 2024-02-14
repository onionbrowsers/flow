export const commonTableColumn = [
  {
    prop: 'column1',
    text: '索引',
    type: 'text',
    dropMenu: ['addRowInDown'],
    prefix: 'addIcon'
  },
  {
    prop: 'column2',
    text: '业务事项',
    type: 'text',
    dropMenu: ['addRowInDown'],
    minWidth: '150'
  },
  {
    prop: 'column3',
    text: '业务单位（部门）负责人',
    type: 'select',
    dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
  },
  {
    prop: 'column4',
    text: '主责部门负责人',
    type: 'select',
    dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
  },
  {
    prop: 'column5',
    text: '相关部门',
    type: 'select',
    dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
  },
  {
    prop: 'column6',
    text: '分管领导',
    type: 'select',
    dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
  },
  {
    prop: 'column7',
    text: '领导小组/委员会',
    type: 'select',
    dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
  },
  {
    prop: 'column8',
    text: '总经理',
    type: 'select',
    dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
  },
  {
    prop: 'column9',
    text: '总经理办公会',
    type: 'select',
    dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
  },
  {
    prop: 'column10',
    text: '党委副书记',
    type: 'select',
    dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
  },
  {
    prop: 'column12',
    text: '党委书记',
    type: 'select',
    dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
  },
  {
    prop: 'column13',
    text: '党委会',
    type: 'select',
    dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
  },
  {
    prop: 'column14',
    text: '董事会',
    type: 'select',
    dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
  },
  {
    prop: 'column15',
    text: '股东会',
    type: 'select',
    dropMenu: ['addRowInDown', 'addColumnInLeft', 'addColumnInRight', 'deleteColumn']
  },
  {
    prop: 'column16',
    text: '备注',
    type: 'text',
    dropMenu: ['addRowInDown'],
    minWidth: '150'
  }
]

export const dropMenuList = [
  {
    name: '在上方添加行',
    type: 'addRowInUp'
  },
  {
    name: '在下方添加行',
    type: 'addRowInDown'
  },
  {
    name: '在左侧添加列',
    type: 'addColumnInLeft'
  },
  {
    name: '在右侧添加列',
    type: 'addColumnInRight'
  },
  {
    name: '删除当前行',
    type: 'deleteRow'
  },
  {
    name: '删除当前列',
    type: 'deleteColumn'
  },
  {
    name: '绑定流程图',
    type: 'bindFlowChart'
  }
]
