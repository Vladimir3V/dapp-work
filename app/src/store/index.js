import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getWeb3 from '../utils/getWeb3'
import ipfs from '../utils/getIPFS'
import pollWeb3 from '../utils/pollWeb3'
import getContract from '../utils/getTruffleContract'
import {
    getAllOrders, getOrder, createOrder, modifyOrder, removeOrder, completeOrder,
    setOrderFreelancer, unlockOrderOwner, unlockOrderFreelancer,
    checkAccountRoles, getPauseStatus, getContractProfit,
    moderModifyOrder, moderRemoveOrder,
    withdrawContractProfit, addModer, removeModer,
    pause, unpause
} from '../utils/contractHelpers'

Vue.use(Vuex)

export const store = new Vuex.Store({
    strict: true,
    state,
    mutations: {
        registerWeb3Mutation(state, payload) {
            console.log('[DEBUG] registerWeb3Mutation() being executed', payload)
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
            console.log('[DEBUG] pollWeb3Mutation() being executed', payload)
            state.web3State.coinbase = payload.coinbase
            state.web3State.balance = parseFloat(payload.balance)
        },
        registerIpfsMutation(state, payload) {
            console.log('[DEBUG] registerIpfsMutation() being executed', payload)
            state.ipfsInstance = payload
        },
        registerContractMutation(state, payload) {
            console.log("[DEBUG] registerContractMutation() being executed", payload)
            state.contractInstance = () => payload
            let contract = state.contractInstance()

            state.contractEvents.LogModerAdded = contract.LogModerAdded
            state.contractEvents.LogModerRemoved = contract.LogModerRemoved
            state.contractEvents.LogOrderCreated = contract.LogOrderCreated
            state.contractEvents.LogOrderModified = contract.LogOrderModified
            state.contractEvents.LogOrderUnlockedByOwner = contract.LogOrderUnlockedByOwner
            state.contractEvents.LogOrderUnlockedByFreelancer = contract.LogOrderUnlockedByFreelancer
            state.contractEvents.LogOrderCompleted = contract.LogOrderCompleted
            state.contractEvents.LogOrderRemoved = contract.LogOrderRemoved
            state.contractEvents.LogOrderFreelancerAdded = contract.LogOrderFreelancerAdded
            state.contractEvents.Pause = contract.Pause
            state.contractEvents.Unpause = contract.Unpause

        },
        setContractRolesMutation(state, payload) {
            console.log("[DEBUG] setContractRolesMutation() being executed", payload)
            state.contractModer = payload.isModer
            state.contractOwner = payload.isOwner
        },
        updatePauseStatusMutation(state, payload) {
            console.log("[DEBUG] updatePauseStatusMutation() being executed", payload)
            state.contractPaused = payload
        },
        updateContractProfitMutation(state, payload) {
            console.log("[DEBUG] updateContractProfitMutation() being executed", payload)
            state.contractProfit = payload
        },
        updateOrdersMutation(state, payload) {
            console.log("[DEBUG] updateOrdersMutation() being executed", payload)
            state.orders = payload
        },
        updateSingleOrderMutation(state, payload) {
            console.log("[DEBUG] updateSingleOrderMutation() being executed", payload)
            Vue.set(state.orders, payload.id, payload)
        },
        removeSingleOrderMutation(state, id) {
            console.log("[DEBUG] removeSingleOrderMutation() being executed", id)
            Vue.delete(state.orders, id)
        },
        setWeb3ProcessingMutation(state, payload) {
            console.log("[DEBUG] setWeb3ProcessingMutation() being executed", payload)
            state.web3State.isProcessing = payload
        }
    },
    actions: {
        registerWeb3Action({ commit }) {
            console.log('[DEBUG] registerWeb3Action() being executed')
            getWeb3.then(result => {
                commit('registerWeb3Mutation', result)
            }).catch(e => {
                console.error('[ERROR] in registerWeb3Action()', e)
            })
        },
        pollWeb3Action({ commit }, payload) {
            console.log('[DEBUG] pollWeb3Action() being executed:', payload)
            commit('pollWeb3Mutation', payload)
        },
        registerIpfsAction({ commit }) {
            console.log('[DEBUG] registerIpfsAction() being executed')
            ipfs.id(function (err, res) {
                if (err) console.log("[ERROR] In registerIpfsAction() => IPFS connection error:", err)
                else  console.log("Connected to IPFS node!", res.id, res.agentVersion, res.protocolVersion);
            });
            commit('registerIpfsMutation', ipfs)
        },
        async getContractAction({ commit }) {
            try {
                console.log('[DEBUG] getContractAction() being executed')
                let contract = await getContract
                commit('registerContractMutation', contract)
            } catch (err) {
                console.error("[ERROR] In getContractAction():", err)
            }
        },
        async setContractRolesActions({ commit }) {
            console.log('[DEBUG] setContractRolesActions() being executed')
            let res = await checkAccountRoles()
            if (res) commit("setContractRolesMutation", res)
            else console.warn("[WARNING] setContractRolesActions() got:", res)
        },
        async updatePauseStatusAction({ commit }) {
            console.log('[DEBUG] updatePauseStatusAction() being executed')
            let res = await getPauseStatus()
            if (res !== null) commit("updatePauseStatusMutation", res)
            else console.warn("[WARNING] updatePauseStatusAction() got:", res)
        },
        async updateContractProfitAction({ commit }) {
            console.log('[DEBUG] updateContractProfitAction() being executed')
            commit("updateContractProfitMutation", await getContractProfit())
        },
        setWeb3ProcessingAction({ commit }, payload) {
            console.log("[DEBUG] setWeb3ProcessingAction() being executed:", payload)
            commit("setWeb3ProcessingMutation", payload)
        },
        async getOrdersListAction({ commit }) {
            console.log("[DEBUG] getOrdersListAction() being executed")
            commit('updateOrdersMutation', await getAllOrders())
        },
        async updateSingleOrderAction({ commit }, id) {
            console.log("[DEBUG] updateSingleOrderAction() being executed:", id)
            commit('updateSingleOrderMutation', await getOrder(id))
        },
        removeSingleOrderAction({ commit }, id) {
            console.log("[DEBUG] removeSingleOrderAction() being executed:", id)
            commit("removeSingleOrderMutation", id)
        },
        async createOrderAction({ commit }, payload) {
            console.log("[DEBUG] createOrderAction() being executed:", payload)
            let ActionEvent = await createOrder(payload)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({ 'owner': state.web3State.coinbase })
            event.watch(async function (err, res) {
                if (err) {
                    console.error("[ERROR] While watching createOrderAction() event:", err)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async modifyOrderAction({ commit }, payload) {
            console.log("[DEBUG] modifyOrderAction() being executed:", payload)
            let id = payload.id
            let ActionEvent = await modifyOrder(payload)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({ 'id': id })
            event.watch(async function (err, res) {
                if (err) {
                    console.error("[ERROR] While watching modifyOrderAction() event:", err)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async moderModifyOrderAction({ commit }, payload) {
            console.log("[DEBUG] moderModifyOrderAction() being executed:", payload)
            let id = payload.id
            let ActionEvent = await moderModifyOrder(payload)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({ 'id': id })
            event.watch(async function (err, res) {
                if (err) {
                    console.error("[ERROR] While watching moderModifyOrderAction() event:", err)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async removeOrderAction({ commit }, id) {
            console.log("[DEBUG] removeOrderAction() being executed:", id)
            let ActionEvent = await removeOrder(id)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({ 'id': id })
            event.watch(async function (err, res) {
                if (err) {
                    console.error("[ERROR] While watching removeOrderAction() event:", err)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async moderRemoveOrderAction({ commit }, payload) {
            console.log("[DEBUG] moderRemoveOrderAction() being executed:", payload)
            let id = payload.id
            let ActionEvent = await moderRemoveOrder(payload)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({ 'id': id })
            event.watch(async function (err, res) {
                if (err) {
                    console.error("[ERROR] While watching moderRemoveOrderAction() event:", err)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async completeOrderAction({ commit }, id) {
            console.log("[DEBUG] completeOrderAction() being executed:", id)
            let ActionEvent = await completeOrder(id)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({ 'id': id })
            event.watch(async function (err, res) {
                if (err) {
                    console.error("[ERROR] While watching completeOrderAction() event:", err)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async setFreelancerAction({ commit }, payload) {
            console.log("[DEBUG] setFreelancerAction() being executed:", payload)
            let id = payload.id
            let ActionEvent = await setOrderFreelancer(payload)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({ 'id': id })
            event.watch(async function (err, res) {
                if (err) {
                    console.error("[ERROR] While watching setFreelancerAction() event:", err)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async unlockOrderOwnerAction({ commit }, id) {
            console.log("[DEBUG] unlockOrderOwnerAction() being executed:", id)
            let ActionEvent = await unlockOrderOwner(id)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({ 'id': id })
            event.watch(async function (err, res) {
                if (err) {
                    console.error("[ERROR] While watching unlockOrderOwnerAction() event:", err)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async unlockOrderFreelancerAction({ commit }, id) {
            console.log("[DEBUG] unlockOrderFreelancerAction() being executed:", id)
            let ActionEvent = await unlockOrderFreelancer(id)
            if (!ActionEvent) {
                commit('setWeb3ProcessingMutation', false)
                return
            }

            let event = await ActionEvent({ 'id': id })
            event.watch(async function (err, res) {
                if (err) {
                    console.error("[ERROR] While watching unlockOrderFreelancerAction() event:", err)
                }
                commit('setWeb3ProcessingMutation', false)
            })
        },
        async withdrawContractProfitAction({commit}, amount) {
            console.log("[DEBUG] withdrawContractProfitAction() being executed:", amount)
            await withdrawContractProfit(amount)
        },
        async addModerAction({commit}, address) {
            console.log("[DEBUG] addModerAction() being executed:", address)
            await addModer(address)
        },
        async removeModerAction({commit}, address) {
            console.log("[DEBUG] removeModerAction() being executed:", address)
            await removeModer(address)
        },
        async pauseAction({commit}) {
            console.log("[DEBUG] pauseAction() being executed")
            await pause()
        },
        async unpauseAction({commit}) {
            console.log("[DEBUG] unpauseAction() being executed")
            await unpause()
        }
    }
})
