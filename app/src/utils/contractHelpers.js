import { store } from '../store/'

export async function getAllOrders() {
    let web3 = store.state.web3Instance()
    let dappWork = store.state.contractInstance()

    // console.log ("[LOG] getAllOrders() contract instance:", dappWork)
    let orders_length = await dappWork.getOrdersCount()
    let orders = {}
    for (let i = 0; i < orders_length; i++) {
        let [id, title, 
            owner_addr, owner_email, owner_contact,
            freelancer_addr, freelancer_email,
            budget, text_hash, file_hash,
            owner_lock, freelancer_lock
        ] = await dappWork.ordersList.call(i)

        id = id.toNumber()
        title = web3.toUtf8(title)
        owner_email = web3.toUtf8(owner_email)
        owner_contact = web3.toUtf8(owner_contact)
        freelancer_email = web3.toUtf8(freelancer_email)
        budget = parseFloat(web3.fromWei(budget, "ether"))

        orders[id] = {
            id, title, 
            owner_addr, owner_email, owner_contact,
            freelancer_addr, freelancer_email,
            budget, text_hash, file_hash,
            owner_lock, freelancer_lock
        }
    }
    
    // console.log("[LOG] New orders:", orders)

    return orders
}

export async function getOrder(_id) {
    let web3 = store.state.web3Instance()
    let dappWork = store.state.contractInstance()

    let index = await dappWork.getOrderIndex(_id)
    let [id, title, 
            owner_addr, owner_email, owner_contact,
            freelancer_addr, freelancer_email,
            budget, text_hash, file_hash,
            owner_lock, freelancer_lock
    ] = await dappWork.ordersList.call(index)

    id = id.toNumber()
    title = web3.toUtf8(title)
    owner_email = web3.toUtf8(owner_email)
    owner_contact = web3.toUtf8(owner_contact)
    freelancer_email = web3.toUtf8(freelancer_email)
    budget = parseFloat(web3.fromWei(budget, "ether"))

    let order = {
        id, title, 
        owner_addr, owner_email, owner_contact,
        freelancer_addr, freelancer_email,
        budget, text_hash, file_hash,
        owner_lock, freelancer_lock
    }
    
    return order  
}

export async function createOrder(payload) {
    try {
        let web3 = store.state.web3Instance()
        let dappWork = store.state.contractInstance()
        let ipfs = store.state.ipfsInstance
        let account = store.state.web3State.coinbase
    
        let {title, email_contact, additional_contact,
            description, file_buffer, budget} = payload
        
        budget = web3.toWei(budget, 'ether')

        let add_descr_response = await ipfs.add(Buffer.from(description))
        console.log("[DEBUG] Description added to IPFS:", add_descr_response)
        let text_hash = add_descr_response[0].hash
        
        let file_hash = ""
        if (file_buffer) {
            let add_file_response = await ipfs.add(Buffer.from(file_buffer))
            console.log("[DEBUG] File added to IPFS:", add_file_response)
            file_hash = add_file_response[0].hash
        }

        await dappWork.createOrder(title, email_contact, additional_contact, 
            text_hash, file_hash, {from: account, value: budget, gas: 3000000});

        console.log("[DEBUG] Order created:", {title, email_contact, additional_contact, 
            text_hash, file_hash, account, budget})

        return dappWork.LogOrderCreated
    } catch (err) {
        console.error("[ERROR] in createOrder():", err)
        return null
    }
}

export async function modifyOrder(payload) {
    try {
        let web3 = store.state.web3Instance()
        let dappWork = store.state.contractInstance()
        let ipfs = store.state.ipfsInstance
        let account = store.state.web3State.coinbase
    
        let {id, title, email_contact, additional_contact,
            text_hash, description,
            file_hash, file_buffer,
            budget} = payload
        
        let params = {
            from: account,
            gas: 3000000
        }
        if (budget !== null) {
            budget = web3.toWei(budget, 'ether')
            params["value"] = budget
        }

        if (description) {
            let add_descr_response = await ipfs.add(Buffer.from(description))
            console.log("[DEBUG] Description added to IPFS:", add_descr_response)
            text_hash = add_descr_response[0].hash
        }
        
        if (file_buffer) {
            let add_file_response = await ipfs.add(Buffer.from(file_buffer))
            console.log("[DEBUG] File added to IPFS:", add_file_response)
            file_hash = add_file_response[0].hash
        }

        await dappWork.modifyOrder(id, title, email_contact, additional_contact, 
            text_hash, file_hash, params);

        console.log("[DEBUG] Order MODIFIED:", {title, email_contact, additional_contact, 
            text_hash, file_hash, account, budget})

        return dappWork.LogOrderModified
    } catch (err) {
        console.error("[ERROR] in modifyOrder():", err)
        return null
    }
}

export async function removeOrder(id) {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        await dappWork.removeOrder(id, {from: account, gas: 3000000});

        console.log("[DEBUG] Order REMOVED:", {id})

        return dappWork.LogOrderRemoved
    } catch (err) {
        console.error("[ERROR] in removeOrder():", err)
        return null
    }
}

export async function completeOrder(id) {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        await dappWork.completeOrder(id, {from: account, gas: 3000000});

        console.log("[DEBUG] Order COMPLETED:", {id})

        return dappWork.LogOrderCompleted
    } catch (err) {
        console.error("[ERROR] in completeOrder():", err)
        return null
    }
}

export async function setOrderFreelancer(payload) {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        let {id, freelancer_addr, freelancer_email} = payload

        await dappWork.setOrderFreelancer(id, freelancer_addr, freelancer_email,
            {from: account, gas: 3000000});

        console.log("[DEBUG] Freelancer set:", payload)

        return dappWork.LogOrderFreelancerAdded
    } catch (err) {
        console.error("[ERROR] in removeOrder():", err)
        return null
    }
}

export async function unlockOrderOwner(id) {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        await dappWork.unlockOrderOwner(id, {from: account, gas: 3000000});

        console.log("[DEBUG] Order UNLOCKED by Owner:", {id})

        return dappWork.LogOrderUnlockedByOwner
    } catch (err) {
        console.error("[ERROR] in unlockOrderOwner():", err)
        return null
    }
}

export async function unlockOrderFreelancer(id) {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        await dappWork.unlockOrderFreelancer(id, {from: account, gas: 3000000});

        console.log("[DEBUG] Order UNLOCKED by Freelancer:", {id})

        return dappWork.LogOrderUnlockedByFreelancer
    } catch (err) {
        console.error("[ERROR] in unlockOrderFreelancer():", err)
        return null
    }
}
