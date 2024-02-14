import Vue from 'vue'

export const GET_USER_INFO = 'GET_USER_INFO'
export const SET_USER_INFO = 'SET_USER_INFO'
export const DELETE_USER_INFO = 'DELETE_USER_INFO'
export const SET_RECEIVED_LIST = 'SET_RECEIVED_LIST'
export const GET_RECEIVED_LIST = 'GET_RECEIVED_LIST'

const state = {
  userInfo: {},
  receivedList: []
}

const getters = {
  userInfo: (state) => {
    return state.userInfo
  },
  receivedList: (state) => {
    return state.receivedList
  }
}

const actions = {
  [GET_USER_INFO]: ({ commit, dispatch }, context) => {
    return new Promise((resolve, reject) => {
      context.$api.getUserInfo().then(res => {
        commit('SET_USER_INFO', res.data)
        resolve(res)
      }).catch(err => {
        context.$msgMnger.httpError(err)
        reject(err)
      })
    })
  },
  [DELETE_USER_INFO]: ({ commit, dispatch }) => {
    commit(DELETE_USER_INFO)
  },
  [GET_RECEIVED_LIST]: ({ commit, dispatch }, context) => {
    return new Promise((resolve, reject) => {
      context.$api.getReceivedList().then(res => {
        commit('SET_RECEIVED_LIST', res.data)
        resolve(res)
      }).catch(err => {
        context.$msgMnger.httpError(err)
        reject(err)
      })
    })
  }
}

const mutations = {
  [SET_USER_INFO]: (state, userInfo) => {
    state.userInfo = {}
    for (let key in userInfo) {
      if (!userInfo.hasOwnProperty(key)) {
        continue
      }
      Vue.set(state.userInfo, key, userInfo[key])
    }
  },
  [DELETE_USER_INFO]: (state) => {
    state.userInfo = {}
  },
  [SET_RECEIVED_LIST]: (state, data) => {
    state.receivedList = JSON.parse(JSON.stringify(data))
  }
}
export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
