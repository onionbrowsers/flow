
import _ from 'lodash'

function configTableData () {
  let _list = []
  let _item = {
    id: 1,
    no: '',
    department: '',
    position: '',
    step: '',
    step_type: '',
    // is_true: '1',
    risk_point: false,
    risk_point_no: '',
    control_point: false,
    control_point_no: '',
    dashed: false,
    next_step: [{
      id: 1,
      no: '',
      description: '',
      checked: 1,
      step: ''
    }],
    document: ''
    // remark: ''
  }

  // 开始id: 1, 结束id: 10
  for (let i = 1; i <= 10; i++) {
    let __item = _.cloneDeep(_item)
    __item.id = i
    __item.no = `${i}`
    if (i === 1) {
      __item.step = '开始'
      __item.step_type = '1'
    }

    // 对非结束步骤设置下一步骤的id，结束步骤next_step为空队列
    if (i < 10) {
      __item.next_step[0].id = __item.id + 1
    } else {
      __item.next_step = []
    }
    _list.push(__item)
  }
  return _list
}

export const initTableData = configTableData()

export default {
  initTableData
}
