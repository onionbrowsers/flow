export const TEST_EDIT_NAME = 'TEST_EDIT_NAME'
export const SET_FLOW_ID = 'SET_FLOW_ID'
export const MUTATE_DRAW_IO_STATE = 'MUTATE_DRAW_IO_STATE'

const state = {
  editNameTest: '',
  flowId: '',
  iframeLeft: 50,
  penetrate: null,
  newTableWidth: 20,
  drawIOState: false // drawIO 的加载状态, false 表示 未加载完成, true 表示已加载完成
}

const getters = {
  editNameTest: (state) => {
    return state.editName
  },
  getIframe: (state) => {
    return state.iframeLeft
  },
  penetrate: (state) => {
    return state.penetrate
  },
  newTableWidth: (state) => {
    return state.newTableWidth
  },
  drawIOStateGetter: state => {
    return state.drawIOState
  }
}

const actions = {
  [TEST_EDIT_NAME]: ({ commit, dispatch }, editName) => {
    commit(TEST_EDIT_NAME, editName)
  }
}

const mutations = {
  [TEST_EDIT_NAME]: (state, editName) => {
    state.editNameTest = editName
  },
  [SET_FLOW_ID]: (state, flowId) => {
    state.flowId = flowId
  },
  getIframe (state, iframeLeft) {
    state.iframeLeft = iframeLeft
  },
  setpenetrate (state, penetrate) {
    state.penetrate = penetrate
  },
  setTableWidth (state, tableWidth) {
    state.newTableWidth = tableWidth
  },
  /**
   * 改变 drawIO 加载状态
   */
  [MUTATE_DRAW_IO_STATE]: (state, { flag }) => {
    state.drawIOState = flag === 'done'
  }
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
