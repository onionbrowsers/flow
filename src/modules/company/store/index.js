
import usrInfo from './usr-info'

function mount () {
  this.$store.registerModule('usrInfo', usrInfo)
}

export default {
  mount
}
