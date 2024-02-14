import $store from '@/store'

const ifAuthenticated = (to, from, next) => {
  if ($store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

const routes = [
  {
    path: '/inner-control',
    name: 'home',
    redirect: '/inner-control/plan-center',
    component: () => import('@/modules/inner-control/views/index.vue'),
    children: [
      {
        path: 'plan-center',
        name: 'plan-center',
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/inner-control/views/plan-center.vue')
      },
      {
        path: 'task-center',
        name: 'task-center',
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/inner-control/views/task-center.vue')
      },
      {
        path: 'baseline',
        name: 'baseline',
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/inner-control/views/baseline.vue')
      },
      {
        path: 'sample',
        name: 'sample',
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/inner-control/views/sample.vue')
      },
      {
        path: 'result',
        name: 'result',
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/inner-control/views/result.vue')
      },
      {
        path: 'create-plan',
        name: 'create-plan',
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/inner-control/views/createPlan.vue')
      },
      {
        path: 'projectMan',
        name: 'projectMan',
        beforeEnter: ifAuthenticated,
        component: () => import('@/modules/inner-control/views/projectMan.vue')
      }
    ]
  }
]

function mount() {
  this.$router.addRoutes(routes)
}

export default {
  mount
}
