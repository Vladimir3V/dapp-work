import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getWeb3 from '../utils/getWeb3'
import ipfs from '../utils/getIPFS'
import pollWeb3 from '../utils/pollWeb3'
import getContract from '../utils/getTruffleContract'
import { getAllOrders, createOrder } from '../utils/contractHelpers'

Vue.use(Vuex)

export const store = new Vuex.Store({
    strict: true,
    state,
    mutations: {
        registerWeb3Mutation(state, payload) {
            console.log('[DEBUG] registerWeb3Mutation being executed', payload)
            state.web3Instance = payload.web3

            let web3StateCopy = state.web3State
            web3StateCopy.coinbase = payload.coinbase
            web3StateCopy.networkId = payload.networkId
            web3StateCopy.balance = parseFloat(payload.balance)
            web3StateCopy.isInjected = payload.injectedWeb3
            state.web3State = web3StateCopy

            pollWeb3()
        },
        pollWeb3Mutation(state, payload) {
            console.log('[DEBUG] pollWeb3Mutation being executed', payload)
            state.web3State.coinbase = payload.coinbase
            state.web3State.balance = parseFloat(payload.balance)
        },
        registerIpfsMutation(state, payload) {
            console.log('[DEBUG] registerIpfsMutation being executed', payload)
            state.ipfsInstance = payload
        },
        registerContractMutation(state, payload) {
            console.log("[DEBUG] registerContractMutation being executed", payload)
            state.contractInstance = () => payload            
        },
        renewOrders(state, payload) {
            console.log("[DEBUG] renewOrders being executed", payload)
            state.orders = payload
        }
    },
    actions: {
        registerWeb3Action({ commit }) {
            console.log('[DEBUG] registerWeb3Action being executed')
            getWeb3.then(result => {
                console.log('[DEBUG] committing result to registerWeb3Mutation:', result)
                commit('registerWeb3Mutation', result)
            }).catch(e => {
                console.log('[DEBUG] error in action registerWeb3Action', e)
            })
        },
        pollWeb3Action({ commit }, payload) {
            console.log('[DEBUG] pollWeb3Action being executed')
            commit('pollWeb3Mutation', payload)
        },
        registerIpfsAction({ commit }) {
            console.log('[DEBUG] registerIpfsAction being executed')
            ipfs.id(function(err, res) {
                if (!err) console.log("Connected to IPFS node!", res.id, res.agentVersion, res.protocolVersion);
                else console.log("IPFS connection error:", err)
            });
            commit('registerIpfsMutation', ipfs)
        },
        getContractAction({ commit }) {
            getContract.then(result => {
                commit('registerContractMutation', result)
            }).catch(e => console.log(e))
        },
        async getOrdersListAction({ commit }) {
            commit('renewOrders', await getAllOrders())
        },
        async createOrderAction({commit}, payload) {
            await createOrder(payload)
        }
    }
})
