
import user from './user'
import userInfo from './user-info'
import loading from './loading'

function mount () {
  this.$store.registerModule('user', user)
  this.$store.registerModule('userInfo', userInfo)
  this.$store.registerModule('loading', loading)
}

export default {
  mount
}
