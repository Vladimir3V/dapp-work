# DappWork

DappWork is decentralized labor exchange [Smart Contract](https://en.wikipedia.org/wiki/Smart_contract) based on Ethereum network that allows placing an orders for the freelancer, complete these orders by freelancer and be sure that neither side will be deceived.

## Architecture

I will explain it by roles. It will be much easier to understand how all things work. Every address can be both the customer and the freelancer.

### Customer Role

You are the **customer** (order owner) and you have a good job to offer.
* You create a new order with your contact information.
* Waite while you will be contacted by a freelancer that meets your requirements.
* While waiting for your lovely freelancer you find a mistake in your order. You can edit or remove the order while you haven't assigned a freelancer to this order. If you decide to remove the order you will be refunded with all your budget. If you modify order's budget the new budget will be set to the order and the old one will be refunded to you.
* You find the freelancer that you need and assign him to your contract.

Right now the contract is **LOCKED** (by you and the freelancer) and you can't remove or modify it.

Let's imagine that all things went well:
* Freelancer made a good job and send it to you.
* You receive the result, you are happy with it and submit that the order is completed. You can submit that the order is completed only when it's locked (which means that someone is assigned to the order).
* Freelancer gets his money. Everyone is happy. The order is removed.

Another situation. The freelancer can't complete your job and he\she is agreed with it.
* Unlock the order from your side.
* Ask the freelancer to unlock the order from his side.
* When the order is unlocked you can remove it, edit or assign the new freelancer to it.

The worst case. You have a conflict with the freelancer and he\she refuses to unlock the order.
In this case, you should contact moderators of this smart contract. Check the **Moderator Role** section to see how they can help you.

### Freelancer Role

You need some money to buy some food and you decide to take an order.
* You find the interesting order with a good budget.
* Contact with the order owner. Find out that he is psycho. Well, let's find another order.
* Yeah! You found it and the customer is a nice guy.

Let's imagine that all things went well.
* You made your job and send it to a customer.
* The customer is happy and submits that the order is completed.
* You get your money and buy some nice taco to eat.

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
* Pause \ Unpause the contract when issues were found or resolved.
* Setup a new contract address through the Registry contract.
* Pass the ownership of the contract to another address.


## Prerequests

* Node.js v8.11.4+: https://nodejs.org/en/download/package-manager/
* NPM v6.3.0+: Installing with the Node.js

## Getting Started

How to install Node.js: 