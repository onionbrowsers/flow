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
    path: '/company',
    name: 'company',
    redirect: { name: 'company-info' },
    meta: { layout: 'onlyHeader', title: '' },
    component: () => import('@/modules/company/views/company.vue'),
    children: [
      {
        path: 'company-info',
        name: 'company-info',
        meta: { layout: 'onlyHeader', title: '' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/company/components/company-info.vue')
      },
      {
        path: 'member-mng',
        name: 'member-mng',
        meta: { layout: 'onlyHeader', title: '' },
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/company/components/member-mng.vue')
      },
      {
        path: 'org',
        name: 'org',
        redirect: { name: 'org-manage' },
        meta: { layout: 'onlyHeader', title: '', activeMenu: '/company/org' },
        component: () => import('@/modules/org/views/index.vue'),
        children: [
          {
            path: 'org-manage',
            name: 'org-manage',
            meta: { layout: 'onlyHeader', title: '', activeMenu: '/company/org' },
            beforeEnter: ifAuthenticated,
            component: () => import('@/modules/org/components/orgList.vue')
          },
          {
            path: 'org-detail',
            name: 'org-detail',
            meta: { layout: 'onlyHeader', title: '', activeMenu: '/company/org', activeSubMenu: '/company/org/org-manage' },
            beforeEnter: ifAuthenticated,
            component: () => import('@/modules/org/components/orgDetail.vue')
          },
          {
            path: 'org-chart',
            name: 'org-chart',
            meta: { layout: 'onlyHeader', title: '', activeMenu: '/company/org' },
            beforeEnter: ifAuthenticated,
            component: () => import('@/modules/org/components/orgChart.vue')
          },
          {
            path: 'staff-manage',
            name: 'staff-manage',
            meta: { layout: 'onlyHeader', title: '', activeMenu: '/company/org' },
            beforeEnter: ifAuthenticated,
            component: () => import('@/modules/org/components/staffList.vue')
          },
          {
            path: 'staff-detail',
            name: 'staff-detail',
            meta: { layout: 'onlyHeader', title: '', activeMenu: '/company/org', activeSubMenu: '/company/org/staff-manage' },
            beforeEnter: ifAuthenticated,
            component: () => import('@/modules/org/components/staffDetail.vue')
          },
          {
            path: 'job-manage',
            name: 'job-manage',
            meta: { layout: 'onlyHeader', title: '', activeMenu: '/company/org' },
            beforeEnter: ifAuthenticated,
            component: () => import('@/modules/org/components/jobList.vue')
          },
          {
            path: 'job-detail',
            name: 'job-detail',
            meta: { layout: 'onlyHeader', title: '', activeMenu: '/company/org', activeSubMenu: '/company/org/job-manage' },
            beforeEnter: ifAuthenticated,
            component: () => import('@/modules/org/components/jobDetail.vue')
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
