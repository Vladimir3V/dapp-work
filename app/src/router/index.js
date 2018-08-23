import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import OwnerOrders from '@/components/owner-orders'
import FreelancerOrders from '@/components/freelancer-orders'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/owner-orders',
      name: 'owner-orders',
      component: OwnerOrders
    },
    {
      path: '/freelancer-orders',
      name: 'freelancer-orders',
      component: FreelancerOrders
    }
  ]
})
