import * as myFolder from './my-folder'
import * as myFlow from './my-flow'
import * as myrisk from './riskctr'// 风险类型库
import * as mysystem from './systemctrl'// 我的制度库
import * as myriskidentifi from './my-riskidentifi'// 我的风险识别和表单文件
import * as judgeHandbook from './judge-handbook' // 评价手册相关
import * as handbook from './handbook' // 内控手册相关
import * as authorize from './authorize-hanbook' // 权限手册相关
import * as flowCondition from './flow-condition' // 流程关系页面

export const version = '/api/v2'

function mount () {
  Object.assign(this.$api, myFolder, myFlow, myrisk, mysystem, myriskidentifi, judgeHandbook, handbook, authorize, flowCondition)
}

export default {
  mount
}
