import * as org from './org'
function mount () {
  Object.assign(this.$api, org)
}

export default {
  mount
}
