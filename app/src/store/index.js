import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getWeb3 from '../utils/getWeb3'
import ipfs from '../utils/getIPFS'
import pollWeb3 from '../utils/pollWeb3'
import getContract from '../utils/getTruffleContract'
import { getAllOrders, getOrder, createOrder, modifyOrder, removeOrder, completeOrder,
    setOrderFreelancer, unlockOrderOwner, unlockOrderFreelancer  } from '../utils/contractHelpers'

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
            let contract = state.contractInstance()

            state.contractEvents.LogModerAdded = contract.LogModerAdded
            state.contractEvents.LogModerRemoved = contract.LogModerRemoved         
            state.contractEvents.LogOrderCreated = contract.LogOrderCreated         
            state.contractEvents.LogOrderModified = contract.LogOrderModified         
            state.contractEvents.LogOrderStarted = contract.LogOrderStarted         
            state.contractEvents.LogOrderUnlockedByOwner = contract.LogOrderUnlockedByOwner         
            state.contractEvents.LogOrderUnlockedByFreelancer = contract.LogOrderUnlockedByFreelancer         
            state.contractEvents.LogOrderCompleted = contract.LogOrderCompleted         
            state.contractEvents.LogOrderRemoved = contract.LogOrderRemoved         
            state.contractEvents.LogOrderFreelancerAdded = contract.LogOrderFreelancerAdded         
        },
        updateOrdersMutation(state, payload) {
            console.log("[DEBUG] updateOrdersMutation being executed", payload)
            state.orders = payload
        },
        updateSingleOrderMutation(state, payload) {
            console.log("[DEBUG] updateSingleOrderMutation being executed", payload)
            Vue.set(state.orders, payload.id, payload)
        },
        removeSingleOrderMutation(state, id) {
            console.log("[DEBUG] removeSingleOrderMutation being executed", id)
            Vue.delete(state.orders, id)
        },
        setWeb3ProcessingMutation(state, payload) {
            console.log("[DEBUG] setWeb3ProcessingMutation being executed", payload)
            state.web3State.isProcessing = payload
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
        async getContractAction({ commit }) {
            try {
                console.log('[DEBUG] getContractAction being executed')
                let contract = await getContract
                commit('registerContractMutation', contract)
            } catch (err) {
                console.error("[ERROR] In getContractAction():", err)
            }
        },
        setWeb3ProcessingAction({commit}, payload) {
            console.log("[DEBUG] setWeb3ProcessingAction being executed")
            commit("setWeb3ProcessingMutation", payload)
        },
        async getOrdersListAction({ commit }) {
            commit('updateOrdersMutation', await getAllOrders())
        },
        async updateSingleOrderAction({commit}, id) {
            commit('updateSingleOrderMutation', await getOrder(id))
        },
        removeSingleOrderAction({commit}, id) {
            commit("removeSingleOrderMutation", id)
        },
        async createOrderAction({commit}, payload) {
            let ActionEvent = await createOrder(payload)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({'owner': state.web3State.coinbase})
            event.watch(async function(err, res) {
                if (err) {
                    console.error("[ERROR] While watching createOrderAction event:", err)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async modifyOrderAction({commit}, payload) {
            let id = payload.id
            let ActionEvent = await modifyOrder(payload)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({'id': id})
            event.watch(async function(err, res) {
                if (err) {
                    console.error("[ERROR] While watching modifyOrderAction event:", err)
                } else {
                    console.log("[DEBUG] Got response from modifyOrderAction for id #", id,":", res)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async removeOrderAction({commit}, id) {
            let ActionEvent = await removeOrder(id)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({'id': id})
            event.watch(async function(err, res) {
                if (err) {
                    console.error("[ERROR] While watching removeOrderAction event:", err)
                } else {
                    console.log("[DEBUG] Got response from removeOrderAction for id #", id,":", res)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async completeOrderAction({commit}, id) {
            let ActionEvent = await completeOrder(id)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({'id': id})
            event.watch(async function(err, res) {
                if (err) {
                    console.error("[ERROR] While watching completeOrderAction event:", err)
                } else {
                    console.log("[DEBUG] Got response from completeOrderAction for id #", id,":", res)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async setFreelancerAction({commit}, payload) {
            let id = payload.id
            let ActionEvent = await setOrderFreelancer(payload)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({'id': id})
            event.watch(async function(err, res) {
                if (err) {
                    console.error("[ERROR] While watching setFreelancerAction event:", err)
                } else {
                    console.log("[DEBUG] Got response from setFreelancerAction for id #", id,":", res)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async unlockOrderOwnerAction({commit}, id) {
            let ActionEvent = await unlockOrderOwner(id)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({'id': id})
            event.watch(async function(err, res) {
                if (err) {
                    console.error("[ERROR] While watching unlockOrderOwnerAction event:", err)
                } else {
                    console.log("[DEBUG] Got response from unlockOrderOwnerAction for id #", id,":", res)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async unlockOrderFreelancerAction({commit}, id) {
            let ActionEvent = await unlockOrderFreelancer(id)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({'id': id})
            event.watch(async function(err, res) {
                if (err) {
                    console.error("[ERROR] While watching unlockOrderFreelancerAction event:", err)
                } else {
                    console.log("[DEBUG] Got response from unlockOrderFreelancerAction for id #", id,":", res)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
    }
})
