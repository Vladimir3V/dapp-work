pragma solidity ^0.4.24;

import "../app/node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "../app/node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title Decentralised Labor Exchange
 * @author drag0no (Pavel Krot - krotpv@gmail.com)
 */
contract DappWork is Pausable 
{
    // Pausable inerhits Ownable
    // Pausable - Circuit breaker template
    // Ownable - For contract administration

    // SafeMath library prevents overflow arithmetic operations
    using SafeMath for uint;
    
    // Minimum required budget for the new order
    uint public constant minBudget = 0.01 ether;
    // Fee from each completed order which will help me to buy some food
    uint public houseEdge;
    // Current profit (from fees) that is in the contract
    uint public contractProfit;
    
    // Address map of contract moderators (the owner of the CONTRACT is moderator by default)
    mapping(address => bool) public moders;
    
    struct Order {
        // Unique auto increment ID
        uint id;  
        // A small title of the order
        bytes32 title;  
        // Address of the ORDER creator (owner)
        address owner;  
        // Email of the ORDER owner (required for communication with a freelancer)
        bytes32 ownerContactEmail;  
        // Additional contact information
        // Can be a skype or telegram account, for ex. "skype: username"
        bytes32 ownerContactAdditional;
        // Freelancer address which needed to be assigned by the ORDER owner
        address freelancer;
        // Freelancer contact email 
        // Required for the moderators to resolve possible conflicts
        bytes32 freelancerContactEmail;
        // Funds locked on the contract
        uint budget;
        // IPFS hash of the order text description
        string ipfsTextDescription;
        // IPFS hash of the file with the detailed order information (can be *.zip, *.doc... i.e. any file)
        string ipfsDetailsFile;
        
        // Locks for the double lock system. 
        // Funds and order details can't be changed or removed when at leasе one lock is up
        // Owner lock can be released by ORDER owner only
        bool ownerLock;
        // Freelancer lock can be released by freelancer only 
        bool freelancerLock;
    }
    
    // A helper structure for binding an entity to an array index
    struct OrderIndex {
        bool exists;
        uint index;
    }
    
    // ID of the last created order (used for auto-incrementing)
    uint public lastOrderId;
    // List of the orders
    Order[] public ordersList;
    // Map to find index in the array by order ID
    mapping(uint => OrderIndex) private ordersListIndex;
    // Map to find orders that belong to the specified address
    mapping(address => uint[]) private ordersByOwner;
    // Two-dimensional map to find the order index for the specified address (a little bit complex, but the contract needs it, trust me :)
    mapping(address => mapping(uint => OrderIndex)) private ordersByOwnerIndex;
    
    // Events to track the addresses of current moderators
    event LogModerAdded(address indexed moder);
    event LogModerRemoved(address indexed moder);

    // Events to track the orders changes for apropriate functions
    // Self-explained names :)
    event LogOrderCreated(
        uint indexed id, 
        bytes32 title, 
        address indexed owner,
        bytes32 indexed ownerEmail,
        uint budget, 
        string ipfsTextDescription,
        string ipfsDetailsFile);
    event LogOrderModified(
        uint indexed id, 
        address indexed modifiedBy,
        bytes32 title, 
        bytes32 indexed ownerEmail, 
        bytes32 ownerAdditionalContact,
        uint budget, 
        string ipfsTextDescription, 
        string ipfsDetailsFile,
        bool ownerLock, 
        bool freelancerLock);
    event LogOrderUnlockedByOwner(uint indexed id);
    event LogOrderUnlockedByFreelancer(uint indexed id);
    event LogOrderCompleted(uint indexed id);
    event LogOrderRemoved(uint indexed id, address indexed removedBy);
    event LogOrderFreelancerAdded(
        uint indexed id, 
        address indexed freelancer, 
        bytes32 indexed freelanerEmail);
    
    /**
    * @dev Requirement the caller is the CONTRACT owner or the moderator
    */
    modifier onlyModers() {
        bool isModer = moders[msg.sender] == true;
        bool isContractOwner = msg.sender == owner;
        require(isModer || isContractOwner, "Current address is not a moderator");
        _;
    }
    
    /**
    * @dev Requirement the order exists
    * @param _id The order ID
    */
    modifier orderExists(uint _id) {
        require(ordersListIndex[_id].exists, "Order does not exist");
        _;
    }
    
    /**
    * @dev Requirement the order exists and the caller is the ORDER owner
    * @param _id The order ID
    */
    modifier onlyOrderOwner(uint _id) {
        require(ordersListIndex[_id].exists, "Order does not exist");
        require(ordersList[ordersListIndex[_id].index].owner == msg.sender, "Not the order owner");
        _;
    }

    /**
    * @dev Requirement the order exists and the caller is the order freelancer
    * @param _id The order ID
    */
    modifier onlyOrderFreelancer(uint _id) {
        require(ordersListIndex[_id].exists, "Order does not exist");
        require(ordersList[ordersListIndex[_id].index].freelancer == msg.sender, "Not the order freelancer");
        _;
    }
    
    /**
    * @dev Requirement the order is not locked
    * @param _id The order ID
    */
    modifier orderNotLocked(uint _id) {
        require(ordersListIndex[_id].exists, "Order does not exist");
        require(ordersList[ordersListIndex[_id].index].ownerLock == false, "Locked by owner");
        require(ordersList[ordersListIndex[_id].index].freelancerLock == false, "Locked by freelancer");
        _;
    }
    
    /**
    * @notice Setting up the fee (in the percentages) for completed orders while deploying contract
    * @param _houseEdge The amount of fee (in the percentages) will be set for the contract
    */
    constructor(uint _houseEdge) public
    {
        require(_houseEdge >= 0 && _houseEdge < 100, "House Edge shoud be between 0-100");
        houseEdge = _houseEdge;
    }
    
    /**
    * @dev Classic fallback function to prevent unnecessary funds transfers
    */
    function() public payable 
    {
        revert("No plain funds transfer allowed");
    }
    
    /**
    * @dev Private function to check that the address is the contract. 
    * It is needed to prevent creating undeletable orders by other contracts.
    * Because we can't transfer funds back to the order owner if it's the contract.
    * @param _addr The address to be checked
    * @return TRUE is the address is another contract and FALSE if it's not
    */
    function isContract(address _addr) view private returns (bool _isContract)
    {
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }

    /**
    * @notice Withdraw accumulated profit from the contract to buy some food. 
    * The function is only available for the CONTRACT owner.
    * @param amount The amount in (wei) to be withdrawn
    */
    function withdrawContractProfit(uint amount) public onlyOwner
    {
        require(amount <= contractProfit, "Not enough funds on contract to withdraw");
        contractProfit = contractProfit.sub(amount);
        msg.sender.transfer(amount);
    }

    /**
    * @notice Add new moderator who helps us to maintain contract 
    * and resolve conflicts between customers and freelancers. ;)
    * The function is only available for the CONTRACT owner.
    * @param _moder The address of the moderator to be added
    */
    function addModer(address _moder) public onlyOwner
    {
        moders[_moder] = true;
        emit LogModerAdded(_moder);
    }
    
    /**
    * @notice Remove the moderator who was like a brother but betrayed us.
    * The function is only available for the CONTRACT owner.
    * @param _moder The address of the moderator to be removed
    */
    function removeModer(address _moder) public onlyOwner
    {
        moders[_moder] = false;
        emit LogModerRemoved(_moder);
    }
    
    /**
    * @notice Get ther order information by its ID
    * @dev Adding more parameters to returns leads to a "Stack too deep" error.
    * That's why I unite ownerLock and freelancerLock to just "lock" variable.
    * To get the full information about locks use the chain of functions:
    * { fullData = ordersList.call(getOrderIndex(id)) }
    * @param _id The order ID
    * @return Order data where { lock = ownerLock || freelancerLock }
    */
    function getOrderById(uint _id) public view orderExists(_id) 
        returns(bytes32 title,
                address owner,
                bytes32 ownerContactEmail,
                bytes32 ownerContactAdditional,
                address freelancer,
                bytes32 freelancerContactEmail,
                uint budget,
                string ipfsTextDescription,
                string ipfsDetailsFile,
                bool lock)
    {
        uint _index = ordersListIndex[_id].index;
        Order storage order = ordersList[_index];

        lock =  ordersList[_index].ownerLock || ordersList[_index].freelancerLock;
        
        return (order.title, 
                order.owner, order.ownerContactEmail, order.ownerContactAdditional, 
                order.freelancer, order.freelancerContactEmail, 
                order.budget, 
                order.ipfsTextDescription, order.ipfsDetailsFile, 
                lock);
    }

    /**
    * @notice Get the order's index by its ID
    * @dev Use it in chain { fullData = ordersList.call(getOrderIndex(id)) }
    * to get the full order information
    * @param _id The order ID
    * @return Order's index
    */
    function getOrderIndex(uint _id) public view orderExists(_id)
        returns(uint index)
    {
        return ordersListIndex[_id].index;       
    }
        
    /**
    * @notice Get the number of the stored orders
    * @dev Use it in the frontend to iterate over orders
    * @return The number of orders
    */
    function getOrdersCount() public view returns(uint)
    {
        return ordersList.length;
    }

    /**
    * @notice Create a new order
    * @dev Use the event filtered by the creator address to get this order ID
    * @param _title The short title of the order
    * @param _ownerContactEmail Email of the order creator for communication (REQUIRED)
    * @param _ownerContactAdditional Additional contact information of the order creator
    * @param _ipfsTextDescription IPFS hash of the order's description
    * @param _ipfsDetailsFile IPFS hash of the file with detailed order information
    */
    function createOrder(
        bytes32 _title,
        bytes32 _ownerContactEmail,
        bytes32 _ownerContactAdditional,
        string _ipfsTextDescription,
        string _ipfsDetailsFile
    )
        public payable whenNotPaused
    {
        require(msg.value >= minBudget, "Minimal budget is not fulfilled");
        require(!isContract(msg.sender), "Contracts are not allowed to create orders!");
        require(_ownerContactEmail[0] != 0, "E-mail is required");

        uint order_id = lastOrderId.add(1);
        lastOrderId = order_id;

        Order memory order = Order(
            order_id,
            _title,
            msg.sender,
            _ownerContactEmail,
            _ownerContactAdditional,
            address(0),
            "",
            msg.value,
            _ipfsTextDescription,
            _ipfsDetailsFile,
            false,
            false
        );
        
        uint _index1 = ordersList.push(order) - 1;
        ordersListIndex[order_id].exists = true;
        ordersListIndex[order_id].index = _index1;

        uint _index2 = ordersByOwner[msg.sender].push(order_id) - 1;
        ordersByOwnerIndex[msg.sender][order_id].exists = true;
        ordersByOwnerIndex[msg.sender][order_id].index = _index2;
        
        emit LogOrderCreated(order_id, _title,
            msg.sender, _ownerContactEmail,
            msg.value,
            _ipfsTextDescription, _ipfsDetailsFile);
    }
    
    /**
    * @notice Remove the order by its ID. Funds return to the contract owner.
    * @dev Function can be executed only by ORDER owner when the order is not locked
    * @dev For the CONTRACT owner and moders there is another function to remove the order
    * @param _id The order ID
    */
    function removeOrder(uint _id) public onlyOrderOwner(_id) orderNotLocked(_id) whenNotPaused
    {
        (uint budget, ,) = _removeOrder(_id);
        msg.sender.transfer(budget);
        emit LogOrderRemoved(_id, msg.sender);
    }

    /**
    * @notice Remove the order by its ID.
    * Funds are split between the freelancer and the owner depends on the parameter.
    * @dev Function can be executed only by CONTRACT owner and moders
    * @param _id The order ID
    * @param _percentProportionToOwner The percentage of the budget that will be 
    * refunded to the order owner, the rest will go to the freelancer exclude a small fee
    */
    function moderRemoveOrder(uint _id, uint _percentProportionToOwner) public onlyModers orderExists(_id)
    {
        require(_percentProportionToOwner >= 0 && _percentProportionToOwner <= 100, "Percent proportion should be between 0-100");

        (uint budget, address _owner, address _freelancer) = _removeOrder(_id);
        uint to_owner = budget.mul(_percentProportionToOwner).div(100);  // budget * (_percentProportionToOwner / 100)
        
        if (_percentProportionToOwner < 100)
        {
            require(_freelancer != address(0), "Can't send coins to 0x0 address");
            uint rest_budget = budget.sub(to_owner);
            uint contract_profit = rest_budget.mul(houseEdge).div(100);
            uint to_freelancer = rest_budget.sub(contract_profit);
            contractProfit = contractProfit.add(contract_profit);
            _freelancer.transfer(to_freelancer);
        }
        
        _owner.transfer(to_owner);
        emit LogOrderRemoved(_id, msg.sender);
    }
    
    /**
    * @dev Private function to remove duplicate code in public remove functions
    * @param _id The order ID
    * @return Amount of the budget, order owner address and freelancer address
    */
    function _removeOrder(uint _id) private returns(uint _budget, address _owner, address _freelancer)
    {
        uint _index = ordersListIndex[_id].index;
        _budget = ordersList[_index].budget;
        _owner = ordersList[_index].owner;
        _freelancer = ordersList[_index].freelancer;
        
        ordersListIndex[_id].exists = false;
        if (ordersList.length > 1) {
            ordersList[_index] = ordersList[ordersList.length - 1];
            ordersListIndex[ordersList[_index].id].index = _index;
        }
        ordersList.length--;

        ordersByOwnerIndex[_owner][_id].exists = false;
        if (ordersByOwner[_owner].length > 1) {
            uint _index_t = ordersByOwnerIndex[_owner][_id].index;
            ordersByOwner[_owner][_index_t] = ordersByOwner[_owner][ordersByOwner[_owner].length - 1];
            ordersByOwnerIndex[_owner][ordersByOwner[_owner][_index_t]].index = _index_t;
        }
        ordersByOwner[_owner].length--;

        return (_budget, _owner, _freelancer);
    }
    
    /**
    * @notice Modify the existing order.
    * @dev Function can be executed only by ORDER owner when the order is not locked
    * @dev For the CONTRACT owner and moders there is another function to modify the order
    * @param _id The order ID (it won't change)
    * @param _title New title of the order
    * @param _ownerContactEmail New email of the order creator for communication
    * @param _ownerContactAdditional New additional contact information of the order creator
    * @param _ipfsTextDescription New IPFS hash of the order's description
    * @param _ipfsDetailsFile New IPFS hash of the file with detailed order information
    */
    function modifyOrder(uint _id, bytes32 _title, 
            bytes32 _ownerContactEmail, bytes32 _ownerContactAdditional,
            string _ipfsTextDescription, string _ipfsDetailsFile)
        public payable onlyOrderOwner(_id) orderNotLocked(_id) whenNotPaused
    {
        uint _index = _modifyOrder(_id, _title, _ownerContactEmail, _ownerContactAdditional,
            _ipfsTextDescription, _ipfsDetailsFile);

        if (msg.value > minBudget)
        {
            uint new_budget = msg.value;
            uint old_budget = ordersList[_index].budget;
            ordersList[_index].budget = new_budget;
            msg.sender.transfer(old_budget);
        }
        else if (msg.value > 0)
        {
            msg.sender.transfer(msg.value);
        }

        emit LogOrderModified(_id, msg.sender,
            _title, _ownerContactEmail, _ownerContactAdditional,
            ordersList[_index].budget, _ipfsTextDescription, _ipfsDetailsFile,
            ordersList[_index].ownerLock, ordersList[_index].freelancerLock);
    }

    /**
    * @notice Modify the existing order. Helps to solve the conflict between
    * the customer and the freelancer by modifying their locks or order info.
    * @dev Function can be executed only by CONTRACT owner and moders
    * @param _id The order ID (it won't change)
    * @param _title New title of the order
    * @param _ownerContactEmail New email of the order creator for communication
    * @param _ownerContactAdditional New additional contact information of the order creator
    * @param _ipfsTextDescription New IPFS hash of the order's description
    * @param _ipfsDetailsFile New IPFS hash of the file with detailed order information
    * @param _ownerLock Allows moder to remove or set owner's lock
    * @param _freelancerLock Allows moder to remove or set freelancer's lock
    */
    function moderModifyOrder(uint _id, bytes32 _title,
            bytes32 _ownerContactEmail, bytes32 _ownerContactAdditional, 
            string _ipfsTextDescription, string _ipfsDetailsFile, 
            bool _ownerLock, bool _freelancerLock)
        public onlyModers orderExists(_id)
    {
        uint _index = _modifyOrder(_id, _title, _ownerContactEmail, _ownerContactAdditional,
            _ipfsTextDescription, _ipfsDetailsFile);

        ordersList[_index].ownerLock = _ownerLock;
        ordersList[_index].freelancerLock = _freelancerLock;

        emit LogOrderModified(_id, msg.sender,
            _title, _ownerContactEmail, _ownerContactAdditional,
            ordersList[_index].budget, _ipfsTextDescription, _ipfsDetailsFile,
            _ownerLock, _freelancerLock);
    }

    /**
    * @dev Private function to remove duplicate code in public modify functions
    * @param _id The order ID (it won't change)
    * @param _title New title of the order
    * @param _ownerContactEmail New email of the order creator for communication
    * @param _ownerContactAdditional New additional contact information of the order creator
    * @param _ipfsTextDescription New IPFS hash of the order's description
    * @param _ipfsDetailsFile New IPFS hash of the file with detailed order information
    * @return The order ID
    */
    function _modifyOrder(uint _id, bytes32 _title, 
            bytes32 _ownerContactEmail, bytes32 _ownerContactAdditional,
            string _ipfsTextDescription, string _ipfsDetailsFile)
        private returns(uint)
    {
        uint _index = ordersListIndex[_id].index;
        
        ordersList[_index].title = _title;
        ordersList[_index].ownerContactEmail = _ownerContactEmail;
        ordersList[_index].ownerContactAdditional = _ownerContactAdditional;
        ordersList[_index].ipfsTextDescription = _ipfsTextDescription;
        ordersList[_index].ipfsDetailsFile = _ipfsDetailsFile;
        
        return _index;
    }

    /**
    * @notice Set the freelancer for the order by its ID
    * and lock the order to prevent editing and removing this order.
    * @param _id The order ID
    * @param _freelancer Freelancer's address
    * @param _freelancerContactEmail Freelancer's contact information to help moders to solve conflicts.
    */
    function setOrderFreelancer(uint _id, address _freelancer, bytes32 _freelancerContactEmail) 
        public onlyOrderOwner(_id) orderNotLocked(_id) whenNotPaused
    {
        require(_freelancer != address(0), "Can't add 0x0 address as freelancer");
        require(_freelancerContactEmail[0] != 0, "Freelancer e-mail is required");

        uint _index = ordersListIndex[_id].index;

        ordersList[_index].freelancer = _freelancer;
        ordersList[_index].freelancerContactEmail = _freelancerContactEmail;
        ordersList[_index].ownerLock = true;
        ordersList[_index].freelancerLock = true;
        
        emit LogOrderFreelancerAdded(_id, _freelancer, _freelancerContactEmail);
    }
    
    /**
    * @notice Helps the caller to check if he\she was assigned to the order by its ID
    * @param _id The order ID
    * @return TRUE if assigned and FALSE if not
    */
    function isMyselfApprovedForOrder(uint _id) public view returns(bool)
    {
        return isAddressApprovedForOrder(_id, msg.sender);
    }
    
    /**
    * @notice Helps to check if address was assigned as freelancer to the order by its ID
    * @param _id The order ID
    * @param _freelancer Address to check
    * @return TRUE if assigned and FALSE if not
    */
    function isAddressApprovedForOrder(uint _id, address _freelancer) 
        public view orderExists(_id) returns(bool)
    {
        uint _index = ordersListIndex[_id].index;
        // TODO: Think about that freelancer may need only his own lock
        if (_freelancer == ordersList[_index].freelancer
            && ordersList[_index].freelancerLock)
            // && ordersList[_index].ownerLock)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
    * @notice Helps to check if freelancer's email added to the order is correct
    * @param _id The order ID
    * @param _freelancerContactEmail Email to check
    * @return TRUE if assigned and FALSE if not
    */
    function isFreelancerEmailCorrectForOrder(uint _id, bytes32 _freelancerContactEmail)
        public view orderExists(_id) returns(bool)
    {
        uint _index = ordersListIndex[_id].index;
        if (_freelancerContactEmail == ordersList[_index].freelancerContactEmail)
        {
            return true;
        }
        else
        {
            return false;
        }    
    }
    
    /**
    * @notice Removes owner's lock from the order. Which means that the order
    * owner wants to cancel working with currently assigned freelancer.
    * @dev Can be executed only by ORDER owner.
    * @param _id The order ID
    */
    function unlockOrderOwner(uint _id) public onlyOrderOwner(_id) whenNotPaused
    {
        uint _index = ordersListIndex[_id].index;
        ordersList[_index].ownerLock = false;

        emit LogOrderUnlockedByOwner(_id);
    }
    
    /**
    * @notice Removes freelancer's lock from the order. Which means that the
    * freelancer wants to give up to complete this order.
    * @dev Can be executed only by freelancer assigned to the order.
    * @param _id The order ID
    */
    function unlockOrderFreelancer(uint _id) public onlyOrderFreelancer(_id) whenNotPaused
    {
        uint _index = ordersListIndex[_id].index;
        ordersList[_index].freelancerLock = false;

        emit LogOrderUnlockedByFreelancer(_id);
    }
    
    /**
    * @notice Complete the order. 
    * The funds is transferred to the freelancer (exclude the small fee). 
    * The order is removed.
    * @dev Can be executed only by ORDER owner.
    * @param _id The order ID
    */
    function completeOrder(uint _id) public onlyOrderOwner(_id) whenNotPaused
    {
        uint _index = ordersListIndex[_id].index;
        bool isLocked = ordersList[_index].freelancerLock || ordersList[_index].ownerLock;
        require(isLocked, "Order is not locked. You can't complete fully unlocked order");
        require(_freelancer != ordersList[_index].freelancer, "Can't send coins to 0x0 address");
        (uint _budget, , address _freelancer) = _removeOrder(_id);
        uint contract_profit = _budget.mul(houseEdge).div(100); // budget * houseEdge / 100
        uint to_freelancer = _budget.sub(contract_profit);  // budget - contract_profit
        contractProfit = contractProfit.add(contract_profit);
        _freelancer.transfer(to_freelancer);

        emit LogOrderCompleted(_id);
    }
}
