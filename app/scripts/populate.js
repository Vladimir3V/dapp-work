const Web3 = require('web3');
const ipfsApi = require('ipfs-api');
const contract = require('truffle-contract');
const contractData = require('../../build/contracts/DappWork.json');
const sampleData = require('../sample-data.json');

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const DappWork = contract(contractData);
DappWork.setProvider(web3.currentProvider);

const ipfs = new ipfsApi("localhost", 5001, {protocol: 'http'});

web3.eth.getAccounts((error, accounts) => {
    if (error) {
        console.error('Failed to get accounts. ', error);
        return;
    }
    DappWork.deployed().then(async instance => {
        // we're all set, let's stuff the contract with some sample data now
        await populate(instance, accounts);
    }).catch(error => {
        console.error(error);
    });
});

async function populate(dappWork, accounts) {
    try {
        // check if we have the owner's account
        if (await dappWork.owner.call() !== accounts[0]) {
            return console.log("account#0 is not an 'owner' in ", ethRPC);
        }
        else {
            console.log("Account#0 is contract 'owner'");
            await dappWork.addModer(accounts[1], {from: accounts[0]});
            console.log("Added account#1 as 'moder'");
            for (let i = 0; i < sampleData.orders.length; i++) {
                let order = sampleData.orders[i];
                let acc = accounts[i % 3 + 2];
                await dappWork.createOrder(order.title, order.email, order.contact, 
                    order.text_hash, order.file_hash,
                    {from: acc, value: web3.toWei(order.price, 'ether'), gas: 3000000});
                console.log("Added order <> Owned by account #", (i % 3 + 2), "(" + acc.slice(0, 6) + "..." + acc.slice(-4) + ")", "with title '" + order.title + "'");
            }
            let orders_length = await dappWork.getOrdersCount();
            console.log('Right now there are', orders_length.toNumber(), 'orders in the contract')
        }
    } catch (e) {
        if (/revert/.test(e.message)) {
            console.error('Transaction reverted. Contract data not empty?');
        } else {
            console.error('Failed to populate the contract with data. ', e.message);
        }
    }
}