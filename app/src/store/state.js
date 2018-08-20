let state = {
    web3State: {
        isInjected: false,
        networkId: -1,
        coinbase: "",
        balance: 0.0,
        error: null
    },
    web3Instance: null,
    contractInstance: null,
    orders: {},
    modalOrderInfo: null,
}
export default state
