## Design pattern decisions

### Fail early and fail loud

All the functions perform crucial `require()` in their beginning to revert if something wrong is with input data.

### Restricted access

All the public functions except `createOrder()` are covered with modifiers that check thе role assigned. `createOrder()` is covered with the `require(!isContract(msg.sender))` to prevent access from other contracts.

### Mortal

Not used here, because the contract accumulates the funds of the customers on it and if the contract can be destroyed by the owner to gather these funds it can raise the mistrust between the contract owner and its users.

### Circuit Breaker

Implemented pausable circuit breaker template by inheriting  OpenZeppelin `Pausable` contract. When the contract is paused, no one can Create / Remove / Modify / Set Freelancer / Unlock / Complete the order (except the approved moderators). Once unpaused, it operates normally again.

### Pull over Push payments

Pull is used to withdraw accumulated profit from collected fees.

### Upgradable

Register contract `DappWorkRegister` allows us to change the current contract address from the old one to a new one. The frontends can dynamically update contract address by listening to the appropriate event.