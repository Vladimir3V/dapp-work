## Security

### Re-Entrancy

Only `transfer()` function is used to send Ether which sends 2300 gas which isn't enough for the destination address/contract to call another contract (i.e. re-enter the sending contract).

All logic that changes state variables happens before Ether is sent out of the contract.

Also added the function `isContract()` to prevent sending funds from another contract and create undeletable orders.

### Arithmetic Over/Under Flows

`SafeMath` library from OpenZeppelin is used to revert arithmetic operations that cause variables to over/underflow by checking the necessary conditions before and after operations.

### Unexpected Ether

Classic fallback `function()` is implemented to prevent unnecessary funds transfers.

Because contract accumulates  profit on itself by collecting fees variable `contractProfit` is used to track current profit. It helps us to avoid any reference to `this.balance` which can cause the vulnerabilty.

And as mentioned above `isContract()` is used to prevent sending Ether from other contracts.

### Block Timestamp Manipulation & Entropy Illusion 

Block variables are not used in this contract. There is no possibilities that contract execution can be manipulated by miners.