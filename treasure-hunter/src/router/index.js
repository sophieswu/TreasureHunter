import Vue from 'vue'
import Router from 'vue-router'
import ItemsList from '@/views/ItemsList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ItemsList',
      component: ItemsList
    }
  ]
})
