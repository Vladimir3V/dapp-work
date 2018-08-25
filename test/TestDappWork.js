const DappWork = artifacts.require("DappWork");

// These tests cover most of the possible scenarios of the current contract.
// You can understand it by the amount of my tests. :)
// Most of the tests are self-explained by their names.
// I added the comments to the tests where additional explanation is needed.
// [REVERT] in the test means that the test was passed if the attempt to call the function was reverted.

// Function to check that the call was reverted.
async function hasReverted(contractCall) {
  try {
    await contractCall;
    return false;
  } catch (e) {
    return /revert/.test(e.message);
  }
}

// Constants that will be used in tests

// Zero address to check unassigned addresses
const zero_address = "0x0000000000000000000000000000000000000000";

// Sample data for the order
const order01_title = "Blockchain developer needed";
const order01_email = "eth_customer@gmail.com";
const order01_contact = "skype: eth_b0ss";

// Sample data for another order
const order02_title = "Smart guy needed";
const order02_email = "cool_guy@yahoo.com";
const order02_contact = "telegram: @c00l_guy";

// Shared data for both orders
const text_hash = "QmRKN4vhtxbS3qURZBhpD35eaQ81bmhqoJ3Su2Y2ahN6gn";
const file_hash = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";

const freelancer_contact = "freelance_do@gmail.com";

// The budget of both contracts
const price = web3.toWei(1, 'ether');

// The fee that we will collect from each completed order (in percentage)
const house_edge = 1;  // means 1% of each completed order

// Current contract profit (from fees)
let current_contract_profit = 0;

contract('DappWork', accounts => {

    // Deploying the new contract
    let dappWork;
    before(async () => {
        dappWork = await DappWork.new(house_edge, {from: accounts[0]});
    });

    // Check the contract owner
    it("[OK] Check the 'owner' accounts#0)", async () => {
        assert.equal(await dappWork.owner.call(), accounts[0]);
    });

    // Adding the new moders and check their addresses
    it("[OK] Add three moders (accounts#1-3) from 'owner' account#0", async () => {
        await dappWork.addModer(accounts[1], {from: accounts[0]});
        await dappWork.addModer(accounts[2], {from: accounts[0]});
        await dappWork.addModer(accounts[3], {from: accounts[0]});
        assert.equal(await dappWork.moders.call(accounts[1]), true);
        assert.equal(await dappWork.moders.call(accounts[2]), true);
        assert.equal(await dappWork.moders.call(accounts[3]), true);
    });

    it("[REVERT] Add moder (account#3) from 'unknown' account#4", async () => {
        assert.ok( await hasReverted(
            dappWork.addModer(accounts[3], {from: accounts[4]})
        ));
    });

    it("[REVERT] Add moder (account#3) from 'moder' account#1", async () => {
        assert.ok( await hasReverted(
            dappWork.addModer(accounts[3], {from: accounts[1]})
        ));
    });

    it("[REVERT] Remove moder (account#3) from 'unknown' account#4", async () => {
        assert.ok(await hasReverted(
            dappWork.removeModer(accounts[3], {from: accounts[4]})
        ));
    });

    it("[REVERT] Remove moder (account#3) from 'moder' account#1", async () => {
        assert.ok(await hasReverted(
            dappWork.removeModer(accounts[3], {from: accounts[1]})
        ));
    });

    it("[OK] Remove moder (account#3) from 'owner' account#0", async () => {
        await dappWork.removeModer(accounts[3], {from: accounts[0]});
        assert.equal(await dappWork.moders.call(accounts[3]), false);
    });

    // Revert attempt to create order with the budget below allowed one
    it("[REVERT] Create order with low price", async () => {
        assert.ok(await hasReverted(
            dappWork.createOrder(order01_title, 
                order01_email, order01_contact, 
                text_hash, file_hash, 
                {from: accounts[3], value: web3.toWei(0.009, 'ether')})
        ));
    });

    it("[REVERT] Create order with empty email", async () => {
        assert.ok(await hasReverted(
            dappWork.createOrder(order01_title, 
                "", order01_contact, 
                text_hash, file_hash, 
                {from: accounts[3], value: price})
        ));
    });

    it("[REVERT] Get/modify/remove/setFreelancer/unlock/complete for a non-existent order", async () => {
        assert.ok(await hasReverted(
            dappWork.getOrderById(3, {from: accounts[4]})
        ));
        assert.ok(await hasReverted(
            dappWork.unlockOrderOwner(3, {from: accounts[4]})
        ));
        assert.ok(await hasReverted(
            dappWork.unlockOrderFreelancer(3, {from: accounts[4]})
        ));
        assert.ok(await hasReverted(
            dappWork.modifyOrder(3, order01_title, order01_email, order01_contact,
                text_hash, file_hash, {from: accounts[4], value: price*2})
        ));
        assert.ok(await hasReverted(
            dappWork.removeOrder(3, {from: accounts[4]})
        ));
        assert.ok(await hasReverted(
            dappWork.setOrderFreelancer(3, accounts[5], freelancer_contact, {from: accounts[4]})
        ));
        assert.ok(await hasReverted(
            dappWork.completeOrder(3, {from: accounts[4]})
        ));
    });

    it("[OK] Add two orders from account#3", async () => {
        await dappWork.createOrder(order01_title, order01_email, order01_contact, 
            text_hash, file_hash, {from: accounts[3], value: price});
        await dappWork.createOrder(order02_title, order02_email, order02_contact, 
            text_hash, file_hash, {from: accounts[3], value: price});
        
        // Check the current amount of orders in the contract
        let orders_length = await dappWork.getOrdersCount();
        assert.equal(orders_length, 2);
        
        // Read full order info by calling it by index
        let [o1_id, o1_title,
            o1_owner_addr, o1_owner_email, o1_owner_contact,
            o1_freelancer_addr, o1_freelancer_email,
            o1_budget, o1_ipfs_text, o1_ipfs_file,
            o1_owner_lock, o1_freelancer_lock] = await dappWork.ordersList.call(0);
        
        o1_title = web3.toUtf8(o1_title);
        o1_owner_email = web3.toUtf8(o1_owner_email);
        o1_owner_contact = web3.toUtf8(o1_owner_contact);
        o1_freelancer_email = web3.toUtf8(o1_freelancer_email);
        
        // Check the read order info with initial parameters
        // Its id must be "1"
        assert.equal(o1_id, 1);
        assert.equal(o1_title, order01_title);
        assert.equal(o1_owner_addr, accounts[3]);
        assert.equal(o1_owner_email, order01_email);
        assert.equal(o1_owner_contact, order01_contact);
        assert.equal(o1_freelancer_addr, zero_address);
        assert.equal(o1_freelancer_email, "");
        assert.equal(o1_budget, price);
        assert.equal(o1_ipfs_text, text_hash);
        assert.equal(o1_ipfs_file, file_hash);
        assert.equal(o1_owner_lock, false);
        assert.equal(o1_freelancer_lock, false);

        // Same for the second order
        let [o2_id, o2_title,
            o2_owner_addr, o2_owner_email, o2_owner_contact,
            o2_freelancer_addr, o2_freelancer_email,
            o2_budget, o2_ipfs_text, o2_ipfs_file,
            o2_owner_lock, o2_freelancer_lock] = await dappWork.ordersList.call(1);
        
        o2_title = web3.toUtf8(o2_title);
        o2_owner_email = web3.toUtf8(o2_owner_email);
        o2_owner_contact = web3.toUtf8(o2_owner_contact);
        o2_freelancer_email = web3.toUtf8(o2_freelancer_email);
        
        // Its id must be "2"
        assert.equal(o2_id, 2);
        assert.equal(o2_title, order02_title);
        assert.equal(o2_owner_addr, accounts[3]);
        assert.equal(o2_owner_email, order02_email);
        assert.equal(o2_owner_contact, order02_contact);
        assert.equal(o2_freelancer_addr, zero_address);
        assert.equal(o2_freelancer_email, "");
        assert.equal(o2_budget, price);
        assert.equal(o2_ipfs_text, text_hash);
        assert.equal(o2_ipfs_file, file_hash);
        assert.equal(o2_owner_lock, false);
        assert.equal(o2_freelancer_lock, false);

    });

    it("[REVERT] Remove first order#1 from 'unknown' account#4", async () => {
        assert.ok(await hasReverted(
            dappWork.removeOrder(1, {from: accounts[4]})
        ));
    });

    it("[OK] Remove first order#1 from 'owner' account#3", async () => {
        await dappWork.removeOrder(1, {from: accounts[3]});

        // After removing there should be only one order with id # 2
        let orders_length = await dappWork.getOrdersCount();
        assert.equal(orders_length, 1);

        let [o2_id, o2_title,
            o2_owner_addr, o2_owner_email, o2_owner_contact,
            o2_freelancer_addr, o2_freelancer_email,
            o2_budget, o2_ipfs_text, o2_ipfs_file,
            o2_owner_lock, o2_freelancer_lock] = await dappWork.ordersList.call(0);
        
        o2_title = web3.toUtf8(o2_title);
        o2_owner_email = web3.toUtf8(o2_owner_email);
        o2_owner_contact = web3.toUtf8(o2_owner_contact);
        o2_freelancer_email = web3.toUtf8(o2_freelancer_email);
        
        // Lets check it info. ID should be #2
        assert.equal(o2_id, 2);
        assert.equal(o2_title, order02_title);
        assert.equal(o2_owner_addr, accounts[3]);
        assert.equal(o2_owner_email, order02_email);
        assert.equal(o2_owner_contact, order02_contact);
        assert.equal(o2_freelancer_addr, zero_address);
        assert.equal(o2_freelancer_email, "");
        assert.equal(o2_budget, price);
        assert.equal(o2_ipfs_text, text_hash);
        assert.equal(o2_ipfs_file, file_hash);
        assert.equal(o2_owner_lock, false);
        assert.equal(o2_freelancer_lock, false);
    });

    it("[REVERT] Modify second order#2 from 'unknown' account#4", async () => {
        assert.ok(await hasReverted(
            dappWork.modifyOrder(2, order01_title, order01_contact, order01_contact,
                text_hash, text_hash, {from: accounts[4], value: price*2})
        ));
    });

    it("[OK] Modify second order#2 from 'owner' account#3", async () => {
        await dappWork.modifyOrder(2, order01_title, order01_email, order01_contact,
            text_hash, file_hash, {from: accounts[3], value: price*2});
        
        // Here instead of getting info about the order 
        // by calling it by index from the array
        // I'm testing getOrderById() function
        let [o2_title, o2_owner_addr, o2_owner_email, o2_owner_contact, 
            o2_freelancer_addr, o2_freelancer_email, 
            o2_budget, o2_ipfs_text, o2_ipfs_file, 
            o2_lock] = await dappWork.getOrderById(2);
        
        o2_title = web3.toUtf8(o2_title);
        o2_owner_email = web3.toUtf8(o2_owner_email);
        o2_owner_contact = web3.toUtf8(o2_owner_contact);
        o2_freelancer_email = web3.toUtf8(o2_freelancer_email);

        assert.equal(o2_title, order01_title);
        assert.equal(o2_owner_addr, accounts[3]);
        assert.equal(o2_owner_email, order01_email);
        assert.equal(o2_owner_contact, order01_contact);
        assert.equal(o2_freelancer_addr, zero_address);
        assert.equal(o2_freelancer_email, "");
        assert.equal(o2_budget, price*2);
        assert.equal(o2_ipfs_text, text_hash);
        assert.equal(o2_ipfs_file, file_hash);
        assert.equal(o2_lock, false);
    });

    it("[REVERT] Set freelancer for order#2 from 'unknown' account#4", async () => {
        assert.ok(await hasReverted(
            dappWork.setOrderFreelancer(2, accounts[5], freelancer_contact, {from: accounts[4]})
        ));
    });

    it("[REVERT] Set freelancer for order#2 from 'moder' account#1", async () => {
        assert.ok(await hasReverted(
            dappWork.setOrderFreelancer(2, accounts[5], freelancer_contact, {from: accounts[1]})
        ));
    });

    it("[REVERT] Set freelancer for order#2 from 'owner' account#3 but without email", async () => {
        assert.ok(await hasReverted(
            dappWork.setOrderFreelancer(2, accounts[5], "", {from: accounts[3]})
        ));
    });

    it("[OK] Set account#5 as freelancer for order#2 from 'owner' account#3", async () => {
        await dappWork.setOrderFreelancer(2, accounts[5], freelancer_contact, {from: accounts[3]});
        
        let [o2_title, o2_owner_addr, o2_owner_email, o2_owner_contact, 
            o2_freelancer_addr, o2_freelancer_email, 
            o2_budget, o2_ipfs_text, o2_ipfs_file, 
            o2_lock] = await dappWork.getOrderById(2);

        o2_freelancer_email = web3.toUtf8(o2_freelancer_email);

        assert.equal(o2_freelancer_addr, accounts[5]);
        assert.equal(o2_freelancer_email, freelancer_contact);
        assert.equal(o2_lock, true);
    });

    it("[OK] Check from account#5 that he was added to an order#2 and order has correct email", async () => {
        assert.equal(await dappWork.isMyselfApprovedForOrder(2, {from: accounts[5]}), true);
        assert.equal(await dappWork.isFreelancerEmailCorrectForOrder(2, freelancer_contact), true);
    });

    it("[REVERT] Unlock order#2 from 'unknown' account#4", async () => {
        assert.ok(await hasReverted(
            dappWork.unlockOrderOwner(2, {from: accounts[4]})
        ));
        assert.ok(await hasReverted(
            dappWork.unlockOrderFreelancer(2, {from: accounts[4]})
        ));
    });

    it("[REVERT] Modify or remove order#2 from 'owner' account#3 when the order is LOCKED", async () => {
        assert.ok(await hasReverted(
            dappWork.modifyOrder(2, order01_title, order01_contact, order01_contact,
                text_hash, text_hash, {from: accounts[3], value: price*2})
        ));
        assert.ok(await hasReverted(
            dappWork.removeOrder(2, {from: accounts[3]})
        ));
    });

    it("[REVERT] Modify or remove order#2 from 'owner' account#3 when the order is partially LOCKED", async () => {
        await dappWork.unlockOrderOwner(2, {from: accounts[3]});

        let [o1_id, o1_title,
            o1_owner_addr, o1_owner_email, o1_owner_contact,
            o1_freelancer_addr, o1_freelancer_email,
            o1_budget, o1_ipfs_text, o1_ipfs_file,
            o1_owner_lock, o1_freelancer_lock] = await dappWork.ordersList.call(0);

        let [o2_title, o2_owner_addr, o2_owner_email, o2_owner_contact, 
            o2_freelancer_addr, o2_freelancer_email, 
            o2_budget, o2_ipfs_text, o2_ipfs_file, 
            o2_lock] = await dappWork.getOrderById(2);

        assert.equal(o1_owner_lock, false);
        assert.equal(o1_freelancer_lock, true);
        assert.equal(o2_lock, true);

        assert.ok(await hasReverted(
            dappWork.modifyOrder(2, order01_title, order01_contact, order01_contact,
                text_hash, text_hash, {from: accounts[3], value: price*2})
        ));
        assert.ok(await hasReverted(
            dappWork.removeOrder(2, {from: accounts[3]})
        ));
    });

    it("[OK] Remove order#2 from 'owner' account#3 when order is UNLOCKED", async () => {
        await dappWork.unlockOrderFreelancer(2, {from: accounts[5]});
        await dappWork.removeOrder(2, {from: accounts[3]});

        let orders_length = await dappWork.getOrdersCount();
        assert.equal(orders_length, 0);
    });

    it("[OK] Create and complete order#3 by owner", async () => {
        // 1. Create order from account#4
        // 2. Set freelancer: account#5 
        // 3. Complete order
        // 4. Check balance of freelancer (it should be bigger)
        let freelancer_balance_before = await web3.eth.getBalance(accounts[5]).toNumber();
        let freelancer_balance_estimated = freelancer_balance_before + price * (100 - house_edge) / 100;

        await dappWork.createOrder(order01_title, order01_email, order01_contact,
            text_hash, file_hash, {from: accounts[4], value: price});
        
        let order_id = await dappWork.lastOrderId.call();
        
        await dappWork.setOrderFreelancer(order_id, accounts[5], freelancer_contact, {from: accounts[4]});
        await dappWork.completeOrder(order_id, {from: accounts[4]});

        let freelancer_balance_after = await web3.eth.getBalance(accounts[5]).toNumber();
        // console.log(freelancer_balance_before, freelancer_balance_estimated, freelancer_balance_after);
        
        assert.equal(order_id, 3);
        assert.equal(freelancer_balance_after, freelancer_balance_estimated);

        current_contract_profit = price * house_edge / 100;
        // console.log(current_contract_profit);
    });

    it ("[OK] Create order#4 and remove it by moder and partially satisfy in favor of the freelancer", async () => {
        // 1. Create order from account#3
        // 2. Set freelancer: account#4 
        // 3. Remove order by moder account#1 with 25% return for the owner
        // 4. Check balance of freelancer (it should be bigger)
        let math_round = 1000000;
        let freelancer_balance_before = await web3.eth.getBalance(accounts[4]).toNumber() / math_round;
        
        let math_price = price  / math_round;
        let percent = 25;
        let to_owner = math_price * percent / 100;
        let rest = math_price - to_owner;
        let contract_profit = rest * house_edge / 100;
        let to_freelancer = rest - contract_profit;

        // console.log(math_price);
        // console.log(to_owner);
        // console.log(rest);
        // console.log(contract_profit);
        // console.log(to_freelancer);

        let freelancer_balance_estimated = Math.round(freelancer_balance_before + to_freelancer);

        await dappWork.createOrder(order02_title, order02_email, order02_contact,
            text_hash, file_hash, {from: accounts[3], value: price});

        let order_id = await dappWork.lastOrderId.call();

        await dappWork.setOrderFreelancer(order_id, accounts[4], freelancer_contact, {from: accounts[3]});
        await dappWork.moderRemoveOrder(order_id, percent, {from: accounts[1]});
        
        current_contract_profit += contract_profit * math_round;
        let freelancer_balance_after = Math.round(await web3.eth.getBalance(accounts[4]).toNumber() / math_round);

        // console.log(freelancer_balance_before);
        // console.log(freelancer_balance_estimated);
        // console.log(freelancer_balance_after);
        
        assert.equal(order_id, 4);
        assert.equal(freelancer_balance_after, freelancer_balance_estimated);

        // console.log(current_contract_profit);
    });

    it("[REVERT] Withdraw contract profit by 'moder' and 'unknown' accounts", async () => {
        assert.ok(await hasReverted(
            dappWork.withdrawContractProfit(current_contract_profit, {from: accounts[1]})
        ));
        assert.ok(await hasReverted(
            dappWork.withdrawContractProfit(current_contract_profit, {from: accounts[4]})
        ));
    });

    it("[OK] Check and withdraw contract profit by 'owner' account", async () => {

        let current_profit = await dappWork.contractProfit.call();
        // console.log(current_profit);
        // console.log(current_contract_profit);
        assert.equal(current_profit, current_contract_profit);

        let owner_balance_before = await web3.eth.getBalance(accounts[0]).toNumber();
        await dappWork.withdrawContractProfit(current_contract_profit, {from: accounts[0]});
        let owner_balance_after = await web3.eth.getBalance(accounts[0]).toNumber();
        
        assert(owner_balance_after > owner_balance_before);  
        
        current_profit = await dappWork.contractProfit.call();
        assert.equal(current_profit, 0);
    });

    it ("[OK] Create order#5, set freelancer, unlock by 'moder', remove by 'owner'", async () => {
        // 1. Create order from account#5
        // 2. Set freelancer: account#4 
        // 3. Unlock (modify with passing unlock parameters) it by moder
        // 4. Remove it by owner after unlocking

        await dappWork.createOrder(order02_title, order02_email, order02_contact,
            text_hash, file_hash, {from: accounts[5], value: price});

        let order_id = await dappWork.lastOrderId.call();

        await dappWork.setOrderFreelancer(order_id, accounts[4], freelancer_contact, {from: accounts[5]});

        assert.equal(await dappWork.isMyselfApprovedForOrder(order_id, {from: accounts[4]}), true);

        let [o5_title, o5_owner_addr, o5_owner_email, o5_owner_contact, 
            o5_freelancer_addr, o5_freelancer_email, 
            o5_budget, o5_ipfs_text, o5_ipfs_file, 
            o5_lock] = await dappWork.getOrderById(order_id);

        await dappWork.moderModifyOrder(order_id, o5_title, o5_owner_email, o5_owner_contact,
            o5_ipfs_text, o5_ipfs_file, false, false, {from: accounts[1]});

        assert.equal(await dappWork.isMyselfApprovedForOrder(order_id, {from: accounts[4]}), false);

        await dappWork.removeOrder(order_id, {from: accounts[5]});

        assert.equal(await dappWork.getOrdersCount(), 0);
    });
});