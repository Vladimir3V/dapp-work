import { store } from '../store/'

export async function getAllOrders() {
    let web3 = store.state.web3Instance()
    let dappWork = store.state.contractInstance()
    if (web3 === null || dappWork == null) {
        return
    }
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

        id = id.toString()
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
