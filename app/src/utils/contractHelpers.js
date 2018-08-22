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

export async function createOrder(payload) {
    try {
        let web3 = store.state.web3Instance()
        let dappWork = store.state.contractInstance()
        let ipfs = store.state.ipfsInstance
        let account = store.state.web3State.coinbase
    
        let {title, email_contact, additional_contact,
            description, file_buffer, budget} = payload
        
        console.log("[DEBUG] Create order inputs:", {title, email_contact, additional_contact,
            description, file_buffer, budget})

        budget = web3.toWei(budget, 'ether')

        let add_descr_response = await ipfs.add(Buffer.from(description))
        console.log("[DEBUG] Description add to IPFS:", add_descr_response)
        let text_hash = add_descr_response[0].hash
        
        let add_file_response = await ipfs.add(Buffer.from(file_buffer))
        console.log("[DEBUG] File added to IPFS:", add_file_response)
        let file_hash = add_file_response[0].hash

        await dappWork.createOrder(title, email_contact, additional_contact, 
            text_hash, file_hash, {from: account, value: budget});

        console.log("[DEBUG] Order created:", {title, email_contact, additional_contact, 
            text_hash, file_hash, account, budget})
    } catch (err) {
        console.log("[ERROR] in createOrder():", err)
    }


}
