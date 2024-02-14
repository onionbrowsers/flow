import * as planCenter from './planCenterApi'
import * as baseline from './baselineApi'
import * as createPlan from './createPlanApi'
import * as taskCenter from './taskCenterApi'
import * as Sample from './sampleApi'
import * as result from './resultApi'

function mount () {
  Object.assign(this.$api, planCenter, baseline, createPlan, taskCenter, Sample, result)
}

export default {
  mount
}
