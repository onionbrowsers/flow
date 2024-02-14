import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './http/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import '../static/theme/index.css'
// import '../static/icon-font/iconfont.css'
import axios from 'axios'
// import _ from 'lodash'
// import userx from 'bayesba-js-components'

import Admin from './layouts/Admin.vue'
import OnlyHeader from './layouts/OnlyHeader.vue'
import FullPage from './layouts/FullPage.vue'
import './styles/index.scss'
import './utils/el-loading'
import msgMnger from './msg-mnger/index.js'

import flowchart from './modules/flowchart/index'
import login from './modules/login/index'
import home from './modules/home/index'
import innerControl from './modules/inner-control/index'
import userCenter from './modules/user-center/index'
import orgManage from './modules/org/index'
import company from './modules/company/index'

const batchImportModule = function (modules) {
  modules.forEach(element => {
    Vue.use(element, { $router: router, $store: store })
  })
}

var $ = require('jquery')
window.jQuery = $
Vue.config.productionTip = false
Vue.use(api)
Vue.use(ElementUI)
Vue.use(msgMnger)
batchImportModule([login, flowchart, home, innerControl, userCenter, orgManage, company])

// userx.config(axios)
axios.defaults.headers.common['Pragma'] = 'no-cache'

Vue.component('admin-layout', Admin)
Vue.component('onlyHeader-layout', OnlyHeader)
Vue.component('fullPage-layout', FullPage)

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

// 判断组件中内容的显示隐藏指令 `v-progressive`
// 自定义指令
// 使用: v-progressive="{ _self: _self, prop: prop }"
Vue.directive('progressive', {
  // inserted: function (el, binding) {
  //   let { _self: _this, prop } = binding.value
  //   let columns = _this.$store.getters.customColumnsGetter
  //   if (columns.length) {
  //     let _index = columns.findIndex(item => {
  //       return item === prop
  //     })
  //     if (_index !== -1) { // 说明存在, 不做处理
  //       el.style.display = 'block'
  //     } else {
  //       el.style.display = 'none'
  //     }
  //   }
  // },
  componentUpdated: function (el, binding) {
    let { _self: _this, prop } = binding.value
    let columns = _this.$store.getters.columnPropsGetter.props
    if (!columns) {
      return false
    }
    if (columns.length) {
      let _index = columns.findIndex(item => {
        return item === prop
      })
      if (_index !== -1) { // 说明存在, 不做处理
        el.style.display = 'block'
      } else {
        el.style.display = 'none'
      }
    }
  }
})

// function createDiv () {
//   let div = document.createElement('div')
//   div.style.position = 'absolute'
//   div.style.width = '100%'
//   div.style.height = '100%'
//   div.style.top = '0'
//   div.style.left = '0'
//   div.style.backgroundColor = 'rgba(255, 255, 255, .5)'
//   div.style.zIndex = '3'
//   return div
// }

// v-mask="{ _self: _self, pos: ['begin', 'end'], rowIndex: rowIndex }"
// 用伪类做遮罩层
// Vue.directive('mask', {
//   inserted: function (el, binding) {
//     let { _self: _this, pos, rowIndex, props } = binding.value
//     let data = _this.$store.getters.tableDataGetter
//     if (!data || !data.length) {
//       return false
//     }
//     let length = data.length
//     // if (pos.some(item => item === 'begin')) {
//     //   if (rowIndex === 0) {
//     //
//     //   }
//     // } else if (pos.some(item => item === 'end')) {
//     //   if (rowIndex === length - 2) {
//     //     el.appendChild(createDiv())
//     //     console.log('end')
//     //   }
//     // }
//     pos.forEach(item => {
//       // 部门岗位
//       if ((item === 'begin' && rowIndex === 0) || (item === 'end' && rowIndex === length - 2)) {
//         // 没有 props 表明不是 cell-reuse-input
//         if (!props) {
//           el.appendChild(createDiv())
//           return false
//         }
//         // 有 props 且 等于 ['department', 'position'], 说明禁用 部门 / 岗位
//         if (_.isEqual(props, ['department', 'position'])) {
//           el.appendChild(createDiv())
//           return false
//         }
//       }
//     })
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
