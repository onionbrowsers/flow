export const UPDATE_TAGS = 'UPDATE_TAGS'
export const ADD_TAG = 'ADD_TAG'

function updateRouter (tags, context) {
  let routeTagsStr = context.$route.query.tags
  if (routeTagsStr) {
    let routeTagsArr = routeTagsStr.split(',')
    let resultTags = []
    let allTagsNames = tags.map(el => {
      return el.name
    })
    routeTagsArr.forEach(el => {
      if (allTagsNames.indexOf(el) > -1) {
        resultTags.push(el)
      }
    })
    let obj = { // copy $route object
      name: context.$route.name,
      params: JSON.parse(JSON.stringify(context.$route.params)),
      query: JSON.parse(JSON.stringify(context.$route.query))
    }
    if (resultTags.length) {
      obj.query.tags = resultTags.join(',')
    } else {
      delete obj.query['tags']
    }
    context.$router.push(obj)
  }
}

const state = {
  tags: []
}

const getters = {
  tags: (state) => {
    return state.tags
  }
}

const actions = {
  [UPDATE_TAGS]: (store, { context, type }) => {
    context.$api.getTags(type).then(res => {
      updateRouter(res.data, context)
      store.commit(UPDATE_TAGS, res.data)
    }).catch(err => {
      context.$msgMnger.httpError(err)
    })
  }
}

const mutations = {
  [UPDATE_TAGS]: (state, tags) => {
    state.tags = tags
  },
  [ADD_TAG]: (state, tag) => {
    state.tags.push(tag)
  }
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
