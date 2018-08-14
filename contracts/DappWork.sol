pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract DappWork is Pausable
{
    using SafeMath for uint;
    
    uint public constant minBudget = 0.01 ether;
    uint public houseEdge;
    uint public contractProfit;
    
    mapping(address => bool) public moders;
    
    struct Order {
        uint id;
        bytes32 title;
        address owner;
        bytes32 ownerContactEmail;
        bytes32 ownerContactAdditional;
        address freelancer;
        bytes32 freelancerContactEmail;
        uint budget;
        string ipfsTextDescription;
        string ipfsDetailsFile;
        bool ownerLock;
        bool freelancerLock;
    }
    
    struct OrderIndex {
        bool exists;
        uint index;
    }
    
    uint public lastOrderId;
    Order[] public ordersList;
    mapping(uint => OrderIndex) private ordersListIndex;
    mapping(address => uint[]) private ordersByOwner;
    mapping(address => mapping(uint => OrderIndex)) private ordersByOwnerIndex;
    
    event LogModerAdded(address indexed moder);
    event LogModerRemoved(address indexed moder);
    event LogOrderCreated(uint indexed id, bytes32 title, 
                            address indexed owner, bytes32 indexed ownerEmail,
                            uint budget, 
                            string ipfsTextDescription, string ipfsDetailsFile);
    event LogOrderModified(uint indexed id, address indexed modifiedBy,
                            bytes32 title, bytes32 indexed ownerEmail, bytes32 ownerAdditionalContact,
                            uint budget, string ipfsTextDescription, string ipfsDetailsFile,
                            bool ownerLock, bool freelancerLock);
    event LogOrderStarted(uint indexed id, address indexed freelancer, bytes32 indexed freelancerEmail);
    event LogOrderUnlockedByOwner(uint indexed id);
    event LogOrderUnlockedByFreelancer(uint indexed id);
    event LogOrderCompleted(uint indexed id);
    event LogOrderRemoved(uint indexed id, address indexed removedBy);
    event LogOrderFreelancerAdded(uint indexed id, address indexed freelancer, bytes32 indexed freelanerEmail);
    
    modifier onlyModers() {
        bool isModer = moders[msg.sender] == true;
        bool isContractOwner = msg.sender == owner;
        require(isModer || isContractOwner, "Current address is not a moderator");
        _;
    }
    
    modifier orderExists(uint _id) {
        require(ordersListIndex[_id].exists, "Order does not exist");
        _;
    }
    
    modifier onlyOrderOwner(uint _id) {
        require(ordersListIndex[_id].exists, "Order does not exist");
        require(ordersList[ordersListIndex[_id].index].owner == msg.sender, "Not the order owner");
        _;
    }

    modifier onlyOrderFreelancer(uint _id) {
        require(ordersListIndex[_id].exists, "Order does not exist");
        require(ordersList[ordersListIndex[_id].index].freelancer == msg.sender, "Not the order freelancer");
        _;
    }
    
    modifier orderNotLocked(uint _id) {
        require(ordersListIndex[_id].exists, "Order does not exist");
        require(ordersList[ordersListIndex[_id].index].ownerLock == false, "Locked by owner");
        require(ordersList[ordersListIndex[_id].index].freelancerLock == false, "Locked by freelancer");
        _;
    }
    
    constructor(uint _houseEdge) public
    {
        require(_houseEdge >= 0 && _houseEdge < 100, "House Edge shoud be between 0-100");
        houseEdge = _houseEdge;
    }
    
    function() public payable 
    {
        revert("No plain funds transfer allowed");
    }
    
    function withdrawContractProfit(uint amount) public onlyOwner
    {
        require(amount <= contractProfit, "Not enough funds on contract to withdraw");
        contractProfit = contractProfit.sub(amount);
        msg.sender.transfer(amount);
    }

    function addModer(address _moder) public onlyOwner
    {
        moders[_moder] = true;
        emit LogModerAdded(_moder);
    }
    
    function removeModer(address _moder) public onlyOwner
    {
        moders[_moder] = false;
        emit LogModerRemoved(_moder);
    }
    
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
    
    function getOrdersCount() public view returns(uint)
    {
        return ordersList.length;
    }

    function createOrder(bytes32 _title, 
                         bytes32 _ownerContactEmail, bytes32 _ownerContactAdditional,
                         string _ipfsTextDescription, string _ipfsDetailsFile)
        public payable whenNotPaused
    {
        require(msg.value >= minBudget, "Minimal budget is not fulfilled");
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
    
    function removeOrder(uint _id) public onlyOrderOwner(_id) orderNotLocked(_id) whenNotPaused
    {
        (uint budget, ,) = _removeOrder(_id);
        msg.sender.transfer(budget);
        emit LogOrderRemoved(_id, msg.sender);
    }

    function moderRemoveOrder(uint _id, uint _percentProportionToOwner) public onlyModers orderExists(_id)
    {
        require(_percentProportionToOwner >= 0 && _percentProportionToOwner <= 100, "Percent proportion should be between 0-100");

        (uint budget, address _owner, address _freelancer) = _removeOrder(_id);
        uint to_owner = budget.mul(_percentProportionToOwner).div(100);  // budget * (_percentProportionToOwner / 100)
        _owner.transfer(to_owner);
        
        if (_percentProportionToOwner < 100)
        {
            require(_freelancer != address(0), "Can't send coins to 0x0 address");
            uint rest_budget = budget.sub(to_owner);
            uint contract_profit = rest_budget.mul(houseEdge).div(100);
            uint to_freelancer = rest_budget.sub(contract_profit);
            contractProfit = contractProfit.add(contract_profit);
            _freelancer.transfer(to_freelancer);
        }
        
        emit LogOrderRemoved(_id, msg.sender);
    }
    
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

    function setOrderFreelancer(uint _id, address _freelancer, bytes32 _freelancerContactEmail) 
        public onlyOrderOwner(_id) orderNotLocked(_id) whenNotPaused
    {
        require(_freelancer != address(0), "Can't add 0x0 address as freelancer");
        require(_freelancerContactEmail[0] != 0, "Freelancer e-mail is required");

        uint _index = ordersListIndex[_id].index;

        // TODO: Check if current freelancer request added

        ordersList[_index].freelancer = _freelancer;
        ordersList[_index].freelancerContactEmail = _freelancerContactEmail;
        ordersList[_index].ownerLock = true;
        ordersList[_index].freelancerLock = true;
        
        emit LogOrderFreelancerAdded(_id, _freelancer, _freelancerContactEmail);
    }
    
    function isMyselfApprovedForOrder(uint _id) public view returns(bool)
    {
        return isAddressApprovedForOrder(_id, msg.sender);
    }
    
    function isAddressApprovedForOrder(uint _id, address _freelancer) 
        public view orderExists(_id) returns(bool)
    {
        uint _index = ordersListIndex[_id].index;
        if (_freelancer == ordersList[_index].freelancer
            && ordersList[_index].freelancerLock
            && ordersList[_index].ownerLock)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

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
    
    function unlockOrderOwner(uint _id) public onlyOrderOwner(_id) whenNotPaused
    {
        uint _index = ordersListIndex[_id].index;
        ordersList[_index].ownerLock = false;

        emit LogOrderUnlockedByOwner(_id);
    }
    
    function unlockOrderFreelancer(uint _id) public onlyOrderFreelancer(_id) whenNotPaused
    {
        uint _index = ordersListIndex[_id].index;
        ordersList[_index].freelancerLock = false;

        emit LogOrderUnlockedByFreelancer(_id);
    }
    
    function completeOrder(uint _id) public onlyOrderOwner(_id) whenNotPaused
    {
        (uint _budget, , address _freelancer) = _removeOrder(_id);
        require(_freelancer != address(0), "Can't send coins to 0x0 address");
        uint contract_profit = _budget.mul(houseEdge).div(100); // budget * houseEdge / 100
        uint to_freelancer = _budget.sub(contract_profit);  // budget - contract_profit
        contractProfit = contractProfit.add(contract_profit);
        _freelancer.transfer(to_freelancer);

        emit LogOrderCompleted(_id);
    }
}