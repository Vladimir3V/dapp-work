import Web3 from 'web3'
import { store } from '../store/'

let pollWeb3 = function (state) {
    let web3 = window.web3
    web3 = new Web3(web3.currentProvider)

    let storeWeb3Instance = store.state.web3Instance
    let storeWeb3State = store.state.web3State

    setInterval(() => {
        if (web3 && storeWeb3Instance) {
            if (web3.eth.coinbase !== storeWeb3State.coinbase) {
                let newCoinbase = web3.eth.coinbase
                web3.eth.getBalance(web3.eth.coinbase, function (err, newBalance) {
                    if (err) {
                        console.log(err)
                    } else {
                        store.dispatch('pollWeb3Action', {
                            coinbase: newCoinbase,
                            balance: web3.fromWei(newBalance, "ether")
                        })
                    }
                })
            } else {
                web3.eth.getBalance(storeWeb3State.coinbase, (err, polledBalance) => {
                    polledBalance = parseFloat(web3.fromWei(polledBalance, "ether"))
                    if (err) {
                        console.log(err)
                    } else if (polledBalance !== storeWeb3State.balance) {
                        store.dispatch('pollWeb3Action', {
                            coinbase: storeWeb3State.coinbase,
                            balance: polledBalance
                        })
                    }
                })
            }
        }
    }, 500)
}

export default pollWeb3