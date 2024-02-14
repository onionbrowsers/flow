import $store from '@/store'
// import $api from '@/http/interface.js'

const ifAuthenticated = (to, from, next) => {
  if ($store.getters.isAuthenticated) {
    next()
    return
  }
  // next('/api/v1/oauth/login?next=' + to.path)
  // window.location.href = $api.oauthPath()
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
  {
    path: '/home',
    name: 'home',
    redirect: '/home/my-folder',
    meta: { layout: 'admin', title: '' },
    component: () => import('@/modules/home/views/home.vue'),
    children: [
      {
        path: 'my-folder',
        name: 'my-folder',
        meta: { layout: 'admin', title: '我的项目' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/my-folder.vue')
      },
      {
        path: 'my-folder-detail/:id',
        name: 'my-flow-detail',
        meta: { layout: 'admin', title: '流程图' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/my-flow.vue')
      },
      {
        path: 'my-flow',
        name: 'my-flow',
        meta: { layout: 'admin', title: '流程图' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/my-flow.vue')
      },
      {
        path: 'riskctrl',
        name: 'riskctrl',
        meta: { layout: 'admin', title: '风险类型库' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/riskctrl.vue')
      },
      {
        path: 'systemctrl',
        name: 'systemctrl',
        meta: { layout: 'admin', title: '我的制度库' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/systemctrl.vue')
      },
      {
        path: 'riskdatastore',
        name: 'riskdatastore',
        meta: { layout: 'admin', title: '风险数据库' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/riskdatastore.vue')
      },
      {
        path: 'eviliststore',
        name: 'eviliststore',
        meta: { layout: 'admin', title: '' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/eviliststore.vue')
      },
      {
        path: 'myriskmatrix',
        name: 'myriskmatrix',
        meta: { layout: 'admin', title: '我的矩阵库' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/my-riskmatrix.vue')
      },
      {
        path: 'myriskidentifi',
        name: 'myriskidentifi',
        meta: { layout: 'admin', title: '我的风险识别库' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/my-riskidentifi.vue')
      },
      {
        path: 'myformfile',
        name: 'myformfile',
        meta: { layout: 'admin', title: '我的表单文件库' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/my-formfile.vue')
      },
      {
        path: 'interctrllib',
        name: 'interctrllib',
        meta: { layout: 'admin', title: '我的手册库' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/interctrllib.vue')
      },
      {
        path: 'myvisiolibrary',
        name: 'myvisiolibrary',
        meta: { layout: 'admin', title: '我的图库' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/my-gallery.vue')
      },
      {
        path: 'handbook',
        name: 'handbook',
        meta: { layout: 'admin', title: '编辑手册' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/handbook/index.vue')
      },
      {
        path: 'judge-handbook',
        name: 'judge-handbook',
        meta: { layout: 'admin', title: '评价手册' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/judge/index.vue')
      },
      {
        path: 'auth-handbook',
        name: 'auth-handbook',
        meta: { layout: 'admin', title: '内容管理授权手册' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/authorize/index.vue')
      },
      {
        path: 'condition-flow',
        name: 'condition-flow',
        meta: { layout: 'admin', title: '流程关系' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/flow-condition/index.vue')
      },
      {
        path: 'edit-condition-flow',
        name: 'edit-condition-flow',
        meta: { layout: 'admin', title: '编辑流程关系' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/home/views/flow-condition/createFlowCondition.vue')
      }
    ]
  }
]

function mount () {
  this.$router.addRoutes(routes)
}

export default {
  mount
}
