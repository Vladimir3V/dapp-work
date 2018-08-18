import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getWeb3 from '../utils/getWeb3'
import pollWeb3 from '../utils/pollWeb3'

Vue.use(Vuex)

export const store = new Vuex.Store({
    strict: true,
    state,
    mutations: {
        registerWeb3Mutation(state, payload) {
            console.log('registerWeb3Mutation being executed', payload)
            let result = payload
            let web3Copy = state.web3
            web3Copy.coinbase = result.coinbase
            web3Copy.networkId = result.networkId
            web3Copy.balance = parseFloat(result.balance)
            web3Copy.isInjected = result.injectedWeb3
            web3Copy.web3Instance = result.web3
            state.web3 = web3Copy
            pollWeb3()
        },
        pollWeb3Mutation(state, payload) {
            console.log('pollWeb3Mutation being executed', payload)
            state.web3.coinbase = payload.coinbase
            state.web3.balance = parseFloat(payload.balance)
        }
    },
    actions: {
        registerWeb3Action({ commit }) {
            console.log('registerWeb3Action being executed')
            getWeb3.then(result => {
                console.log('committing result to registerWeb3Mutation mutation')
                commit('registerWeb3Mutation', result)
            }).catch(e => {
                console.log('error in action registerWeb3Action', e)
            })
        },
        pollWeb3Action({ commit }, payload) {
            console.log('pollWeb3Action being executed')
            commit('pollWeb3Mutation', payload)
        }
    }
})
