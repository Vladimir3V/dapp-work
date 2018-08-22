let state = {
    web3State: {
        isInjected: false,
        isProcessing: false,
        networkId: -1,
        coinbase: "",
        balance: 0.0,
        error: null
    },
    web3Instance: null,
    ipfsInstance: null,
    contractInstance: null,
    contractEvents: {
        LogModerAdded: null,  // address indexed moder
        LogModerRemoved: null,  // address indexed moder
        LogOrderCreated: null,  // uint indexed id, bytes32 title, 
                                // address indexed owner, bytes32 indexed ownerEmail,
                                // uint budget, 
                                // string ipfsTextDescription, string ipfsDetailsFile
        LogOrderModified: null, // uint indexed id, address indexed modifiedBy,
                                // bytes32 title, bytes32 indexed ownerEmail, bytes32 ownerAdditionalContact,
                                // uint budget, string ipfsTextDescription, string ipfsDetailsFile,
                                // bool ownerLock, bool freelancerLock)
        LogOrderStarted: null,  // uint indexed id, address indexed freelancer, bytes32 indexed freelancerEmail
        LogOrderUnlockedByOwner: null,  // uint indexed id
        LogOrderUnlockedByFreelancer: null,  // uint indexed id
        LogOrderCompleted: null,  // uint indexed id
        LogOrderRemoved: null,  // uint indexed id, address indexed removedBy
        LogOrderFreelancerAdded: null // uint indexed id, address indexed freelancer, bytes32 indexed freelanerEmail
    },
    orders: {}
}
export default state
