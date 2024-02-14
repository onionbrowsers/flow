import $store from '@/store'
// import $api from '@/http/interface.js'

const ifAuthenticated = (to, from, next) => {
  if ($store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

// const ifNotAuthenticated = (to, from, next) => {
//   if (!$store.getters.isAuthenticated) {
//     next()
//     return
//   }
//   next('/')
// }

// function beforeEnterList (to, from, next) {
//   if (!$store.getters.isAuthenticated) {
//     next('/login')
//     return
//   }
//   if (!to.query.hasOwnProperty('ps') || !to.query.hasOwnProperty('p')) {
//     let _to = JSON.parse(JSON.stringify(to))
//     _to.query.ps = 10
//     _to.query.p = 1
//     next(_to)
//   } else {
//     next()
//   }
// }

const routes = [
]

function mount () {
  this.$router.addRoutes(routes)
}

export default {
  mount
}
