# DappWork

DappWork is decentralized labor exchange [Smart Contract](https://en.wikipedia.org/wiki/Smart_contract) based on Ethereum network that allows placing the orders for the freelancers, complete these orders by freelancers and be sure that neither side will be deceived.

## Content

- [Architecture](#architecture)
- [Some Notes for Reviewers](#some-notes-for-reviewers)
- [Demo in Rinkeby Test Network](#demo-in-rinkeby-test-network)
- [Prerequisites and Setting Up the Test Environment](#prerequisites-and-setting-up-the-test-environment)
- [Getting Started for the Testing](#getting-started-for-the-testing)
- [Truffle Tests](#truffle-tests)
- [Avoiding Common Attacks](#avoiding-common-attacks)
- [Design Pattern Decisions](#design-pattern-decisions)
- [Author](#author)

## Architecture 

I will explain it by roles. It will be much easier to understand how all things work. Every address can be both the customer and the freelancer.

### Customer Role

You are the **customer** (order owner) and you have a good job to offer.
* You create a new order with your contact information. At the same time when you create the order, the budget will be sent from your account to the smart contract.
* Wait until you will be contacted by a freelancer that meets your requirements.
* While waiting for appropriate freelancer you find a mistake in your order. You can edit or remove the order (on the "Own Orders" page) while you haven't assigned a freelancer to this order. If you decide to remove the order you will be refunded with all your budget. If you modify the order's budget, the new budget will be set to the order and the old one will be refunded to you.
* You find the freelancer that you need and assign him to your contract.

Right now the order is LOCKED by smart contract (note there appear two locks: owner's and freelancer's) and you can't remove or modify it.

Let's imagine that all things went well:
* Freelancer makes a good job and sends it to you.
* You receive the result, you are happy with it and submit that the order is completed. You can submit that the order is completed only when it's locked (which means that someone is assigned to the order).
* Freelancer gets his money. Everyone is happy. The order is removed.

Another situation. The freelancer can't complete your job and he/she agrees with this fact.
* Unlock the order from your side.
* Ask the freelancer to unlock the order from his/her side.
* When the order is unlocked you can remove it, edit or assign the new freelancer to it.

The worst case. You have a conflict with the freelancer and he/she refuses to unlock the order.
In this case, you should contact moderators of this smart contract. Check the **Moderator Role** section to see how they can help you.

### Freelancer Role

You need some money to buy some food and you decide to take an order.
* You find the interesting order with a good budget.
* Contact with the order owner using the contact information. Find out that he is psycho. Well, let's find another order.
* Yeah! You find it and the customer is a nice guy. Ask the customer to assign you as the freelancer to the order and wait until the order will pop up on the frontend ("Assigned Order" page).
* When you see in the frontend that the order is poped up and it has your e-mail inside, that means that order is assigned to you and it has been **LOCKED**. Right now you can start to work on this order.
* Be sure to check your e-mail in the order. It will help the moderators to solve the possible conflict between you and the order owner.

Let's imagine that all things went well.
* You make your job and send it to a customer.
* The customer is happy and submits that the order is completed, then the smart contract will send you the budget of the order minus fee (for my contract it's the lowest possible value - 1%).
* You get and buy some nice taco to eat.

Another case. You can't deliver the job and you agree with it. You can give up on contract by unlocking it and don't forget to tell the customer that you unlocked the order (anyway he can notice that the order is unlocked in the frontend... but be a nice guy and keep the good relationships).

Worst case for you. You have fulfilled the originally agreed scope of work, but the customer constantly changes something and asks to do more without increasing the budget.
* **Do NOT unlock** the order in this case.
* Contact moderators. They will help you to solve the conflict.
Check the **Moderator Role** section to see how they can help you.

### Moderator Role

Moderators should contact both the customer and the freelancer, ask them to send their correspondence and solve the conflict.

Moderators can:
* Edit the order even if it's locked (they can't modify freelancer info and budget of the order tho).
* They can unlock the order for each side if they decide that the customer is the right in the conflict.
* They can remove the order and indicate the proportion in which the funds will be divided between the customer and the freelancer or send all the funds to the freelancer if he is right.

### Contract Owner Role

The contract owner is a moderator with additional features:
* Withdraw accumulated profit from the collected fees and send salary to the moderators.
* Add the new moderators and delete the old ones.
* Pause / Unpause the contract when issues were found or resolved.
* Setup a new contract address through the Register contract.
* Pass the ownership of the contract to another address.

## Some Notes for Reviewers

### EthPM

I used [OpenZeppelin Solidity](https://github.com/OpenZeppelin/openzeppelin-solidity) libraries through npm, because they are outdated in the EthPM (they were installed through EthPM and then replaced by the npm ones).

### IPFS

[IPFS](https://ipfs.io/) is used to store orders descriptions and files. But it is kinda unstable thing. Sometimes description can be missed or files not opened (hope you won't experience this) and uploading the file to IPFS through public API takes some time... Please, be patient here and trust my "loading" circles. :)

## Demo in Rinkeby Test Network

### Prerequisites
* You will need [MetaMask](https://metamask.io/) extension and understanding how to use it (they have a good video tutorial on their website).
* Check that you are connected to Rinkeby Test Network.
* If you have no Ether on your account use "Buy \ Deposit" button in MetaMask through Faucet requesting (test networks allow you to get some Ethereum for free to test DApps).
* Use one of the links listed below in `"The Web App is available on"` section.

The contracts addresses are listed in [deployed_addresses.txt](deployed_addresses.txt).

### The Web App is available on:
* Github Pages: https://drag0no.github.io/dapp-work (This one is the fresh one)
* IPFS: https://ipfs.io/ipfs/QmQTDwtPPzyHmEyUXJkUB9aqEmKgVeA8MC7BzPXuWbPYrh
* IPFS+ENS: http://dapp-work.thisisme.eth (You will need the [ENS Content Resolver](https://chrome.google.com/webstore/detail/ens-content-resolver/ifgfopmoihnnicfgcpafgibiinfkodjf) extension)

## Prerequisites and Setting Up the Test Environment

* **MetaMask Extension** for your browser (You can get it here: https://metamask.io/)

* **Node.js v8.11.4+**
```
> node -v
v8.11.3
```
If you got the error, install it from here: https://nodejs.org/en/download/package-manager/

* **npm v5.6.0+** (should be installed with the Node.js, but lets check it)
```
> npm -v
5.6.0
```

* **Git v2.7.4+**
```
> git --version
git version 2.7.4
```
If you got the error, install it from here: https://git-scm.com/downloads

* **Truffle v4.1.13+**
```
> truffle version
Truffle v4.1.13 (core: 4.1.13)
Solidity v0.4.24 (solc-js)
```
If you got the error, install it by executing command:
```
> npm install -g truffle
```

* **Ganache-CLI v6.1.6+**
```
> ganache-cli --version
Ganache CLI v6.1.6 (ganache-core: 2.1.5)
```
If you got the error, install it by executing command:
```
> npm install -g ganache-cli
```

## Getting Started for the Testing

1. Run Ganache in the separate command prompt:
```
> ganache-cli
```
2. Clone the repo and move to 'dapp-work/app' directory (notice that the app directory is located in separate directory):
```
> git clone https://github.com/drag0no/dapp-work.git
> cd dapp-work/app
```
3. Install dependencies:
```
> npm install
```
4. Move one directory back and test the contract with Truffle:
```
> cd ..
> truffle test
```
5. If all tests are passed let's deploy the fresh contract to play around:
```
> truffle migrate --reset
```
6. Move to app directory and run the app:
```
> cd app
> npm start
```
7. Open the link http://localhost:8080 and feel free to play around!

Loading files to IPFS through public node can take some time, please be patient while creating the order or modifying it.

8. (OPTIONAL) You can populate the app with the sample data. 

The script will add account#1 as moderator and create 11 orders from accounts #2, #3 & #4. Just to remind: account#0 is the contract owner!


Open the new command prompt, move to 'dapp-work/app' directory and run the script:
```
> cd dapp-work/app
> npm run populate
```

## Truffle Tests

The tests cover:
* Ownership of the contract;
* Authorized access to the restricted functions by roles;
* Create \ Modify \ Remove \ Set Freelancer \ Unlock \ Complete function for orders;
* Validating input, stored and output data;
* Most of the common scenarios of using this smart contract;
* Reverting state for the common exceptional cases;
* Upgradability.

## Avoiding Common Attacks

[Read here](avoiding_common_attacks.md)


## Design Pattern Decisions

[Read here](design_pattern_decisions.md)

## Author

* drag0no (Pavel Krot - krotpv@gmail.com)