import Vue from 'vue'
import Router from 'vue-router'
import DappWork from '@/components/dapp-work'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dapp-work',
      component: DappWork
    }
  ]
})
