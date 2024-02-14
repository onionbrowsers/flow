import _ from 'lodash'

export const UPDATE_FLOWFILE_TAGS = 'UPDATE_FLOWFILE_TAGS'
export const UPDATE_FLOWTEMP_TAGS = 'UPDATE_FLOWTEMP_TAGS'

const state = {
  flowfileTags: [],
  flowtempTags: []
}
// 防抖，因为模板详情有新建流程图，新建流程图的弹框也得写这个请求，所以和流程图模块请求重复
const getFlowfileTags = _.debounce(function (store, context) {
  context.$api.getFlowfileTags().then(res => {
    store.commit(UPDATE_FLOWFILE_TAGS, res.data)
  }).catch(err => {
    context.$msgMnger.httpError(err)
  })
}, 100)

const getters = {
  flowfileTags: (state) => {
    return state.flowfileTags
  },
  flowtempTags: (state) => {
    return state.flowtempTags
  }
}

const actions = {
  [UPDATE_FLOWFILE_TAGS]: (store, { context }) => {
    getFlowfileTags(store, context)
  },
  [UPDATE_FLOWTEMP_TAGS]: (store, { context }) => {
    context.$api.getFlowtempTags().then(res => {
      store.commit(UPDATE_FLOWTEMP_TAGS, res.data)
    }).catch(err => {
      context.$msgMnger.httpError(err)
    })
  }
}

const mutations = {
  [UPDATE_FLOWFILE_TAGS]: (state, tags) => {
    state.flowfileTags = tags
  },
  [UPDATE_FLOWTEMP_TAGS]: (state, tags) => {
    state.flowtempTags = tags
  }
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
