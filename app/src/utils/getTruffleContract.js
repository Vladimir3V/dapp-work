const Web3 = require('web3');
const contract = require('truffle-contract');
const contractData = require('../../../build/contracts/DappWork.json');

let getContract = new Promise(function (resolve, reject) {
    let web3 = new Web3(window.web3.currentProvider)
    const DappWork = contract(contractData);
    DappWork.setProvider(web3.currentProvider);
    DappWork.deployed().then(async instance => {
        resolve(instance);
    }).catch(error => {
        reject(error);
    });
});
export default getContract