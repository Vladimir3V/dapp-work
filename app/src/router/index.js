import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import OwnerOrders from '@/components/owner-orders'
import FreelancerOrders from '@/components/freelancer-orders'
import ModerOrders from '@/components/moder-orders'
import ContractOwnerPanel from '@/components/contract-owner-panel'
import Contacts from '@/components/contacts'

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
    },
    {
      path: '/moder-orders',
      name: 'moder-orders',
      component: ModerOrders
    },
    {
      path: '/contract-owner-panel',
      name: 'contract-owner-panel',
      component: ContractOwnerPanel
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: Contacts
    }
  ]
})
