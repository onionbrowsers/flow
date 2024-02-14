
const state = {}

const getters = {}

const actions = {}

const mutations = {}

const innerControl = {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}

function mount () {
  this.$store.registerModule('innerControl', innerControl)
}

export default {
  mount
}
