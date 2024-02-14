import $store from '@/store'
// import $api from '@/http/interface.js'

const ifAuthenticated = (to, from, next) => {
  if ($store.getters.isAuthenticated) {
    next()
    return
  }
  // next('/api/v1/oauth/login?next=' + to.path)
  // window.location.href = $api.oauthPath()
  next()
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
//     // next('/fc/login')
//     // return
//   }
//   if (!to.query.hasOwnProperty('ps') || !to.query.hasOwnProperty('p')) {
//     let _to = JSON.parse(JSON.stringify(to))
//     _to.query.ps = to.name === 'fc-flowfile-list' ? 10 : 12
//     _to.query.p = 1
//     next(_to)
//   } else {
//     next()
//   }
// }

const routes = [
  // {
  //   path: '/fc',
  //   name: 'fc',
  //   redirect: '/fc/flowfile'
  // },
  // {
  //   path: '/fc/login',
  //   name: 'login',
  //   meta: { layout: 'onlyHeader' },
  //   beforeEnter: ifNotAuthenticated,
  //   component: () => import('@/modules/flowchart/views/login.vue')
  // },
  // {
  //   path: '/fc/flowfile',
  //   name: 'fc-flowfile-list',
  //   meta: { layout: 'onlyHeader' },
  //   beforeEnter: beforeEnterList,
  //   component: () => import('@/modules/flowchart/views/flowfile-list.vue')
  // },
  {
    path: '/fcFlowfileEdit/:flowfileId',
    name: 'fc-flowfile-edit',
    meta: { layout: 'fullPage' },
    beforeEnter: ifAuthenticated,
    component: () => import('@/modules/flowchart/views/flowfile-edit.vue')
  },
  {
    path: '/xmlToImg/:flowfileId',
    name: 'xml-to-img',
    meta: { layout: 'fullPage' },
    beforeEnter: ifAuthenticated,
    component: () => import('@/modules/flowchart/views/xmlToImgPage.vue')
  },
  {
    path: '/fcFlowfilePdf/:sysinfo/:comId',
    name: 'fc-flowfile-pdf',
    meta: { layout: 'fullPage' },
    beforeEnter: ifAuthenticated,
    component: () => import('@/modules/flowchart/views/flowfile-pdf.vue')
  },
  {
    path: '/otherupload',
    name: 'otherupload',
    meta: { layout: 'admin', title: '多文件上传' },
    beforeEnter: ifAuthenticated,
    component: () => import('@/modules/home/views/other/uploadfile.vue')
  }
  // {
  //   path: '/fc/template/select',
  //   name: 'fc-template-select',
  //   meta: { layout: 'onlyHeader' },
  //   beforeEnter: beforeEnterList,
  //   component: () => import('@/modules/flowchart/views/template-select.vue')
  // },
  // {
  //   path: '/fc/template',
  //   name: 'fc-template-list',
  //   meta: { layout: 'admin' },
  //   beforeEnter: beforeEnterList,
  //   component: () => import('@/modules/flowchart/views/template-list.vue')
  // },
  // {
  //   path: '/fc/template/:templateId/train',
  //   name: 'fc-template-train',
  //   meta: { layout: 'onlyHeader' },
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('@/modules/flowchart/views/template-train.vue')
  // },
  // {
  //   path: '/fc/template/:templateId/edit',
  //   name: 'fc-template-edit',
  //   meta: { layout: 'onlyHeader' },
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('@/modules/flowchart/views/template-edit.vue')
  // },
  // {
  //   path: '/fc/filestyle/:type',
  //   name: 'fc-filestyle',
  //   meta: { layout: 'fullPage' },
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('@/modules/flowchart/views/filestyle-des.vue')
  // },
  // {
  //   path: '/fc/test',
  //   name: 'fc-test',
  //   meta: { layout: 'fullPage' },
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('@/modules/flowchart/views/test.vue')
  // },
  // {
  //   path: '/fc/doc',
  //   name: 'fc-test1',
  //   meta: { layout: 'fullPage' },
  //   beforeEnter: ifAuthenticated,
  //   component: () => import('@/modules/flowchart/views/doc.vue')
  // }
]

function mount () {
  this.$router.addRoutes(routes)
}

export default {
  mount
}
