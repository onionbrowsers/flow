import Vuex from 'vuex'
import Vue from 'vue'
// import user from './modules/user.js'
import tags from './modules/tags.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tags
  },
  strict: true
})
