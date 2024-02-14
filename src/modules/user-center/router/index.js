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
    path: '/user-center',
    name: 'user-center',
    meta: { layout: 'onlyHeader', title: '' },
    beforeEnter: ifAuthenticated,
    redirect: 'user-center/quota-mng',
    component: () => import('@/modules/user-center/views/usr-center.vue'),
    children: [
      {
        path: 'quota-mng',
        name: 'quota-mng',
        meta: { layout: 'onlyHeader', title: '' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/user-center/views/quota-mng.vue')
      },
      {
        path: 'download-record',
        name: 'download-record',
        meta: { layout: 'onlyHeader', title: '' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/user-center/views/download-record.vue')
      },
      {
        path: 'usr-info',
        name: 'usr-info',
        redirect: 'usr-info/my-company',
        meta: { layout: 'onlyHeader', title: '' },
        component: () => import('@/modules/user-center/views/usr-info.vue'),
        children: [
          {
            path: 'my-company',
            name: 'my-company',
            meta: { layout: 'onlyHeader', title: '我的企业' },
            beforeEnter: ifAuthenticated,
            component: () => import('@/modules/user-center/components/my-company.vue')
          },
          {
            path: 'my-info',
            name: 'my-info',
            meta: { layout: 'onlyHeader', title: '' },
            beforeEnter: ifAuthenticated,
            component: () => import('@/modules/user-center/components/my-info.vue')
          },
          {
            path: 'pwd-reset',
            name: 'pwd-reset',
            meta: { layout: 'onlyHeader', title: '' },
            beforeEnter: ifAuthenticated,
            component: () => import('@/modules/user-center/components/pwd-reset.vue')
          },
          {
            path: 'phone-reset',
            name: 'phone-reset',
            meta: { layout: 'onlyHeader', title: '' },
            beforeEnter: ifAuthenticated,
            component: () => import('@/modules/user-center/components/phone-reset.vue')
          }
        ]
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
