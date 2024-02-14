
import orgInfo from './org-info'

function mount () {
  this.$store.registerModule('orgInfo', orgInfo)
}

export default {
  mount
}
