const state = {
  coloredFolders: [
    { icon: 'iconfolder1', label: '默认', value: 1 },
    { icon: 'iconfolder2', label: '蓝色', value: 2 },
    { icon: 'iconfolder3', label: '绿色', value: 3 },
    { icon: 'iconfolder4', label: '黄色', value: 4 },
    { icon: 'iconfolder5', label: '红色', value: 5 },
    { icon: 'iconfolder6', label: '橙色', value: 6 }
  ]
}

const getters = {
  coloredFoldersGetter: state => state.coloredFolders
}

const actions = {
}

const mutations = {
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
