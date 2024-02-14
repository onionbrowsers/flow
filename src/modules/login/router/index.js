const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { layout: 'fullPage' },
    component: () => import('@/modules/login/views/login.vue')
  }
]

function mount () {
  this.$router.addRoutes(routes)
}

export default {
  mount
}
