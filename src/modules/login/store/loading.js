// import Vue from 'vue'
const MUTATE_LOADING_STACK = 'MUTATE_LOADING_STACK'

const state = {
  // 主栈
  loadingStack: [],
  // 模块栈
  loadingModuleStack: {}
}

const getters = {
  // loadingGetter: state => state.loadingStack.length !== 0
  loadingGetter: state => {
    // 计算 loading 栈内容总个数
    let stackLengthCount = 0
    stackLengthCount += state.loadingStack.length
    for (const module in state.loadingModuleStack) {
      if (!state.loadingModuleStack.hasOwnProperty(module)) {
        continue
      }
      const moduleStack = state.loadingModuleStack[module]
      stackLengthCount += moduleStack.length
    }
    return stackLengthCount !== 0
  }
}

const mutations = {
  [MUTATE_LOADING_STACK]: (state, { flag, module }) => {
    // console.log('loading log: ', flag, module)
    state.loadingStack = flag === 'start' ? [1] : []
  }
}

export default {
  namespaced: false,
  state,
  getters,
  mutations
}
