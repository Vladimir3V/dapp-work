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

        let { title, email_contact, additional_contact,
            description, file_buffer, budget } = payload

        title = web3.fromAscii(title)
        email_contact = web3.fromAscii(email_contact)

        additional_contact = (additional_contact) ? additional_contact : "None"
        additional_contact = web3.fromAscii(additional_contact)

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
            text_hash, file_hash, { from: account, value: budget, gas: 3000000 });

        console.log("[DEBUG] Order created:", {
            title, email_contact, additional_contact,
            text_hash, file_hash, account, budget
        })

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

        let { id, title, email_contact, additional_contact,
            text_hash, description,
            file_hash, file_buffer,
            budget } = payload

        title = web3.fromAscii(title)
        email_contact = web3.fromAscii(email_contact)
        
        additional_contact = (additional_contact) ? additional_contact : "None"
        additional_contact = web3.fromAscii(additional_contact)
        
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

        console.log("[DEBUG] Order MODIFIED:", payload)

        return dappWork.LogOrderModified
    } catch (err) {
        console.error("[ERROR] in modifyOrder():", err)
        return null
    }
}

export async function moderModifyOrder(payload) {
    try {
        let dappWork = store.state.contractInstance()
        let ipfs = store.state.ipfsInstance
        let account = store.state.web3State.coinbase

        let { id, title, email_contact, additional_contact,
            text_hash, description,
            file_hash, file_buffer,
            owner_lock, freelancer_lock } = payload

        title = web3.fromAscii(title)
        email_contact = web3.fromAscii(email_contact)
        
        additional_contact = (additional_contact) ? additional_contact : "None"
        additional_contact = web3.fromAscii(additional_contact)

        let params = {
            from: account,
            gas: 3000000
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

        await dappWork.moderModifyOrder(id, title, email_contact, additional_contact,
            text_hash, file_hash, owner_lock, freelancer_lock, params);

        console.log("[DEBUG] Order MODIFIED:", payload)

        return dappWork.LogOrderModified
    } catch (err) {
        console.error("[ERROR] in moderModifyOrder():", err)
        return null
    }
}

export async function removeOrder(id) {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        await dappWork.removeOrder(id, { from: account, gas: 3000000 });

        console.log("[DEBUG] Order REMOVED:", { id })

        return dappWork.LogOrderRemoved
    } catch (err) {
        console.error("[ERROR] in removeOrder():", err)
        return null
    }
}

export async function moderRemoveOrder(payload) {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        let { id, proportion } = payload

        await dappWork.moderRemoveOrder(id, proportion, { from: account, gas: 3000000 });

        console.log("[DEBUG] Order REMOVED:", payload)

        return dappWork.LogOrderRemoved
    } catch (err) {
        console.error("[ERROR] in moderRemoveOrder():", err)
        return null
    }
}

export async function completeOrder(id) {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        await dappWork.completeOrder(id, { from: account, gas: 3000000 });

        console.log("[DEBUG] Order COMPLETED:", { id })

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

        let { id, freelancer_addr, freelancer_email } = payload

        freelancer_addr = freelancer_addr
        freelancer_email = web3.fromAscii(freelancer_email)


        await dappWork.setOrderFreelancer(id, freelancer_addr, freelancer_email,
            { from: account, gas: 3000000 });

        console.log("[DEBUG] Freelancer set:", payload)

        return dappWork.LogOrderFreelancerAdded
    } catch (err) {
        console.error("[ERROR] in setOrderFreelancer():", err)
        return null
    }
}

export async function unlockOrderOwner(id) {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        await dappWork.unlockOrderOwner(id, { from: account, gas: 3000000 });

        console.log("[DEBUG] Order UNLOCKED by Owner:", { id })

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

        await dappWork.unlockOrderFreelancer(id, { from: account, gas: 3000000 });

        console.log("[DEBUG] Order UNLOCKED by Freelancer:", { id })

        return dappWork.LogOrderUnlockedByFreelancer
    } catch (err) {
        console.error("[ERROR] in unlockOrderFreelancer():", err)
        return null
    }
}

export async function checkAccountRoles() {
    try {
        if (!store.state.contractInstance) {
            console.warn("[WARNING] in checkAccountRoles => Contract Instance not initialized to check roles:", dappWork)
            return null
        }

        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        let owner = await dappWork.owner.call()
        let isOwner = (account === owner) ? true : false

        let isModer = false
        if (isOwner) isModer = true
        else isModer = await dappWork.moders.call(account)

        let res = { isOwner, isModer }
        console.log("[DEBUG] Account roles checked:", res)

        return res
    } catch (err) {
        console.error("[ERROR] in checkAccountRoles():", err)
        return null
    }
}

export async function getContractProfit() {
    try {
        let web3 = store.state.web3Instance()
        let dappWork = store.state.contractInstance()
        let profit = await dappWork.contractProfit.call()
        profit = parseFloat(web3.fromWei(profit, "ether"))
        return profit
    } catch (err) {
        console.error("[ERROR] in getContractProfit():", err)
        return null
    }
}

export async function withdrawContractProfit(amount) {
    try {
        let web3 = store.state.web3Instance()
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase
        amount = web3.toWei(amount, "ether")
        await dappWork.withdrawContractProfit(amount, { from: account, gas: 3000000 })
    } catch (err) {
        console.error("[ERROR] in checkAccountRoles():", err)
    }
}

export async function addModer(address) {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        await dappWork.addModer(address, { from: account, gas: 3000000 })
        console.log("[DEBUG] Moderator ADDED:", address)
    } catch (err) {
        console.error("[ERROR] in addModer():", err)
    }
}

export async function removeModer(address) {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        await dappWork.removeModer(address, { from: account, gas: 3000000 })
        console.log("[DEBUG] Moderator REMOVED:", address)
    } catch (err) {
        console.error("[ERROR] in removeModer():", err)
    }
}

export async function getPauseStatus() {
    try {
        let dappWork = store.state.contractInstance()
        let status = await dappWork.paused.call()
        console.log("[DEBUG] Contract Pause status:", status)
        return status
    } catch (err) {
        console.error("[ERROR] in getPauseStatus():", err)
        return null
    }
}

export async function pause() {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        await dappWork.pause({ from: account, gas: 3000000 })
        console.log("[DEBUG] Contract PAUSED")
    } catch (err) {
        console.error("[ERROR] in pause():", err)
    }
}

export async function unpause() {
    try {
        let dappWork = store.state.contractInstance()
        let account = store.state.web3State.coinbase

        await dappWork.unpause({ from: account, gas: 3000000 })
        console.log("[DEBUG] Contract UNPAUSED")
    } catch (err) {
        console.error("[ERROR] in unpause():", err)
    }
}