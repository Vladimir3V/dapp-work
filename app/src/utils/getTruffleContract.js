const CONTRACT_ADDRESS = "0xd166049f8c5a32459b041f6c7aba5823f8be4c7a";
const Web3 = require('web3');
const contract = require('truffle-contract');
const contractData = require('../../../build/contracts/DappWork.json');

let getContract = new Promise(function (resolve, reject) {
    let web3 = new Web3(window.web3.currentProvider)
    const DappWork = contract(contractData);
    DappWork.setProvider(web3.currentProvider);
    DappWork.deployed().then(async instance => {
        resolve(instance)
    }).catch(error => {
        console.error("[ERROR] in getTruffleContract.js deplayed():", error)
    })
    DappWork.at(CONTRACT_ADDRESS).then(async instance => {
        resolve(instance)
    }).catch(error => {
        console.error("[ERROR] in getTruffleContract.js at():", error)
    })
});
export default getContract