
import myFolder from './my-folder'

const GET_COMPANIES_ACTION = 'GET_COMPANIES_ACTION' // 更新所有数据空间信息
const SET_COMPANIES_MUTATION = 'SET_COMPANIES_MUTATION' // 更新所有数据空间信息
const SET_CURRENT_DATA_SPACE_INIT_MUTATION = 'SET_CURRENT_DATA_SPACE_INIT_MUTATION' // 设置当前的数据空间, 用于初始化
const SET_CURRENT_DATA_SPACE_MUTATION = 'SET_CURRENT_DATA_SPACE_MUTATION' // 设置当前数据空间, 用于列表选中某个数据空间
const SET_CURRENT_FILE_DATA = 'SET_CURRENT_FILE_DATA'

const state = {
  // 全部数据空间
  companies: [],
  // 当前用户选中的数据空间
  currentCompany: {},
  currentHandleFileData: null
}

const getters = {
  // 全部数据空间 getter
  allDataSpaceGetter: state => state.companies,
  // 个人空间 getter
  personalDataSpaceGetter: state => state.companies.find(item => item.type === 2),
  // 企业空间 getter
  companyDataSpaceGetter: state => state.companies.filter(item => item.type !== 2),
  // 当前数据空间 getter
  currentDataSpaceGetter: state => state.currentCompany,
  // 当前数据空间的 id
  currentDataSpaceIdGetter: state => state.currentCompany.id || -1,
  // 当前要操作文件的 id
  currentHandleFileData: state => state.currentHandleFileData
}

const actions = {
  // 获取最新的数据空间列表
  [GET_COMPANIES_ACTION]: ({ commit }, context) => {
    return new Promise((resolve, reject) => {
      // 请求接口
      context.$api.getUserCompany().then(res => {
        if (res.data.length === 0) {
          reject(new Error('列表数据为空, 请重试'))
        } else {
          commit('SET_COMPANIES_MUTATION', res.data)
          commit('SET_CURRENT_DATA_SPACE_INIT_MUTATION')
          resolve()
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  // 更新列表
  [SET_COMPANIES_MUTATION]: (state, companies) => {
    state.companies = companies
  },
  // 设置当前的企业空间, 用于初始化
  [SET_CURRENT_DATA_SPACE_INIT_MUTATION]: state => {
    const currentDataSpaceId = (window.localStorage.getItem('currentDataSpaceId') || -1) - 0
    if (currentDataSpaceId !== -1) {
      state.currentCompany = state.companies.find(item => item.id === currentDataSpaceId) || state.companies[0]
    } else {
      state.currentCompany = state.companies[0]
    }
  },
  // 设置当前的企业空间, 用于用户手动选择
  [SET_CURRENT_DATA_SPACE_MUTATION]: (state, companyId) => {
    state.currentCompany = state.companies.find(item => item.id === companyId)
    window.localStorage.setItem('currentDataSpaceId', companyId)
  },
  // 设置当前要操作文件的 id
  [SET_CURRENT_FILE_DATA]: (state, data) => {
    state.currentHandleFileData = JSON.parse(JSON.stringify(data))
  }
}

const home = {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}

function mount () {
  this.$store.registerModule('myFolder', myFolder)
  this.$store.registerModule('home', home)
}

export default {
  mount
}
