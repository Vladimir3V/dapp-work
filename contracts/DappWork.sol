pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract DappWork is Ownable
{
    using SafeMath for uint;
    
    uint public constant minBudget = 0.01 ether;
    uint public houseEdge;
    
    mapping(address => bool) moders;
    
    struct Order {
        uint id;
        address owner;
        address freelancer;
        bytes32 title;
        bytes32 contactEmail;
        bytes32 contactAdditional;
        uint budget;
        uint ipfsTextDescription;
        uint ipfsDetailesFile;
        bool ownerLock;
        bool freelancerLock;
    }
    uint public lastOrderId;
    
    struct OrderIndex {
        bool exists;
        uint index;
    }
    
    Order[] public ordersList;
    mapping(uint => OrderIndex) public ordersInfo;
    mapping(address => uint[]) public ordersByOwner;
    
    struct Request {
        uint id;
        uint orderId;
        address owner;
        bytes32 contactEmail;
        bytes32 contactAdditional;
    }
    uint public lastRequestId;
    
    struct RequestIndex {
        bool exists;
        uint index;
    }
    
    Request[] public requestsList;
    mapping(uint => RequestIndex) public requestsInfo;
    mapping(address => uint[]) public requestsByFreelancer;
    
    mapping(uint => uint[]) public requestsByOrderId;
    
    
    struct CustomerInfo {
        uint jobsPaid;
        uint totalPaid;
        uint8 rating;
        address[] workedWith;
    }
    mapping(address => CustomerInfo) customerInfoMap;
    
    struct FreelancerInfo {
        uint jobsDone;
        uint totalEarned;
        uint8 rating;
        address[] workedWith;
    }
    mapping(address => FreelancerInfo) freelancerInfoMap;
    
    event LogOrderCreated(uint oId, address owner);
    event LogOrderModified(uint oId);
    event LogOrderRemoved(uint oId);
    event LogOrderFreelancerAdded(uint id, address freelancer);
    event LogRequestCreated(uint rId, uint oId, address owner);
    event LogRequestDeleted(uint rId);
    
    modifier onlyModers() {
        bool isModer = moders[msg.sender] == true;
        bool isContractOwner = msg.sender == owner;
        require(isModer || isContractOwner, "Current address is not a moderator");
        _;
    }
    
    modifier orderExists(uint _id) {
        require(ordersInfo[_id].exists, "Order does not exist");
        _;
    }
    
    modifier onlyOrderOwner(uint _id) {
        require(ordersInfo[_id].exists, "Order does not exist");
        require(ordersList[ordersInfo[_id].index].owner == msg.sender, "Not the order owner");
        _;
    }
    
    modifier onlyOrderFreelancer(uint _id) {
        require(ordersInfo[_id].exists, "Order does not exist");
        require(ordersList[ordersInfo[_id].index].freelancer == msg.sender, "Not the order freelancer");
        _;
    }
    
    modifier orderNotLocked(uint _id) {
        require(ordersInfo[_id].exists, "Order does not exist");
        require(ordersList[ordersInfo[_id].index].ownerLock == false, "Locked by owner");
        require(ordersList[ordersInfo[_id].index].freelancerLock == false, "Locked by freelancer");
        _;
    }
    
    modifier onlyRequestOwner(uint _id) {
        require(requestsInfo[_id].exists, "Request does not exist");
        require(requestsList[requestsInfo[_id].index].owner == msg.sender, "Not the request owner");
        _;
    }
    
    constructor(uint _houseEdge) public
    {
        require(_houseEdge >= 0 && _houseEdge < 100, "House Edge shoud be between 0-100");
        houseEdge = _houseEdge;
    }
    
    function() public payable 
    {
        revert();
    }
    
    function addModer(address _moder) public onlyOwner
    {
        moders[_moder] = true;
    }
    
    function removeModer(address _moder) public onlyOwner
    {
        moders[_moder] = false;
    }
    
    function getOrderById(uint _id) public view orderExists(_id) 
        returns(uint, address, address,
            bytes32, bytes32, bytes32, uint,
            uint, uint)
    {
        uint _index = ordersInfo[_id].index;
        Order storage order = ordersList[_index];
        
        return (order.id, order.owner, order.freelancer, 
            order.title, order.contactEmail, order.contactAdditional, order.budget, 
            order.ipfsTextDescription, order.ipfsDetailesFile);
    }
    
    function isOrderLocked(uint _id) public view orderExists(_id)
        returns(bool)
    {
        uint _index = ordersInfo[_id].index;
        bool _ownerLock = ordersList[_index].ownerLock;
        bool _freelancerLock = ordersList[_index].freelancerLock;
        return _ownerLock || _freelancerLock;
    }
    
    function createOrder(bytes32 _title, bytes32 _contactEmail, bytes32 _contactAdditional, uint _ipfsTextDescription, uint _ipfsDetailesFile)
        public payable returns(uint orderId)
    {
        require(msg.value >= minBudget, "Minimal budget is not fulfilled");

        orderId = lastOrderId.add(1);
        lastOrderId = orderId;
        
        Order memory order = Order(
            orderId,
            msg.sender,
            address(0),
            _title,
            _contactEmail,
            _contactAdditional,
            msg.value,
            _ipfsTextDescription,
            _ipfsDetailesFile,
            false,
            false
        );
        
        uint _index = ordersList.push(order) - 1;
        ordersInfo[orderId].exists = true;
        ordersInfo[orderId].index = _index;
        ordersByOwner[msg.sender].push(orderId);
        
        emit LogOrderCreated(orderId, msg.sender);
        
        return orderId;
    }
    
    function removeOrder(uint _id) public onlyOrderOwner(_id) orderNotLocked(_id) returns(bool)
    {
        (uint budget, ,) = _removeOrder(_id);
        msg.sender.transfer(budget);
        emit LogOrderRemoved(_id);
        return true;
    }
    
    function removeOrderModer(uint _id, uint _percentProportionToOwner) public onlyModers orderExists(_id) returns(bool)
    {
        require(_percentProportionToOwner >= 0 && _percentProportionToOwner <= 100, "Percent proportion should be between 0-100");

        (uint budget, address _owner, address _freelancer) = _removeOrder(_id);
        uint to_owner = budget.mul(_percentProportionToOwner.div(100));  // budget * (_percentProportionToOwner / 100)
        _owner.transfer(to_owner);
        
        if (_percentProportionToOwner < 100)
        {
            require(_freelancer != address(0), "Can't send coins to 0x0 address");
            uint to_freelancer = budget.sub(to_owner).mul(100 - houseEdge).div(100);  // (budget - to_owner) * (100 - houseEdge) / 100)
            _freelancer.transfer(to_freelancer);
        }
        
        emit LogOrderRemoved(_id);
        return true;
    }
    
    function _removeOrder(uint _id) private returns(uint _budget, address _owner, address _freelancer)
    {
        uint _index = ordersInfo[_id].index;
        _budget = ordersList[_index].budget;
        _owner = ordersList[_index].owner;
        _freelancer = ordersList[_index].freelancer;
        
        ordersInfo[_id].exists = false;
        
        if (ordersList.length > 1) {
            Order memory swap_order_elem = ordersList[ordersList.length - 1];
            uint swap_order_id = swap_order_elem.id;
            
            ordersList[_index] = swap_order_elem;
            ordersInfo[swap_order_id].index = _index;
        }
        
        ordersList.length--;
        
        return (_budget, _owner, _freelancer);
    }
    
    function modifyOrder(uint _id, bytes32 _title, bytes32 _contactEmail, bytes32 _contactAdditional, uint _ipfsTextDescription, uint _ipfsDetailesFile)
        public payable onlyOrderOwner(_id) orderNotLocked(_id) returns(bool)
    {
        uint _index = _modifyOrder(_id, _title, _contactEmail, _contactAdditional, _ipfsTextDescription, _ipfsDetailesFile);
        if (msg.value > minBudget)
        {
            uint new_budget = msg.value;
            uint old_budget = ordersList[_index].budget;
            ordersList[_index].budget = new_budget;
            msg.sender.transfer(old_budget);
        }
        emit LogOrderModified(_id);
        return true;
    }
    
    function modifyOrderModer(uint _id, bytes32 _title, bytes32 _contactEmail, bytes32 _contactAdditional, 
            uint _ipfsTextDescription, uint _ipfsDetailesFile, 
            bool _ownerLock, bool _freelancerLock)
        public onlyModers orderExists(_id) returns(bool)
    {
        uint _index = _modifyOrder(_id, _title, _contactEmail, _contactAdditional, _ipfsTextDescription, _ipfsDetailesFile);
        ordersList[_index].ownerLock = _ownerLock;
        ordersList[_index].freelancerLock = _freelancerLock;
        emit LogOrderModified(_id);
        return true;
    }
    
    function _modifyOrder(uint _id, bytes32 _title, bytes32 _contactEmail, bytes32 _contactAdditional, uint _ipfsTextDescription, uint _ipfsDetailesFile)
        private returns(uint)
    {
        uint _index = ordersInfo[_id].index;
        
        ordersList[_index].title = _title;
        ordersList[_index].contactEmail = _contactEmail;
        ordersList[_index].contactAdditional = _contactAdditional;
        ordersList[_index].ipfsTextDescription = _ipfsTextDescription;
        ordersList[_index].ipfsDetailesFile = _ipfsDetailesFile;
        
        return _index;
    }
    
    function setOrderFreelancer(uint _id, address _freelancer) public onlyOrderOwner(_id) orderNotLocked(_id) returns(bool)
    {
        uint _index = ordersInfo[_id].index;

        // TODO: Check if current freelancer request added

        ordersList[_index].freelancer = _freelancer;
        ordersList[_index].ownerLock = true;
        ordersList[_index].freelancerLock = true;
        
        emit LogOrderFreelancerAdded(_id, _freelancer);
        return true;
    }
    
    function isMyselfApprovedForOrder(uint _id) public view returns(bool)
    {
        return isAddressApprovedForOrder(_id, msg.sender);
    }
    
    function isAddressApprovedForOrder(uint _id, address _freelancer) public view orderExists(_id) returns(bool)
    {
        uint _index = ordersInfo[_id].index;
        if (_freelancer == ordersList[_index].freelancer)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    function unlockOrderByOwner(uint _id) public onlyOrderOwner(_id) returns(bool)
    {
        uint _index = ordersInfo[_id].index;
        ordersList[_index].ownerLock = false;
        return true;
    }
    
    function unlockOrderByFreelancer(uint _id) public onlyOrderFreelancer(_id) returns(bool)
    {
        uint _index = ordersInfo[_id].index;
        ordersList[_index].freelancerLock = false;
        return true;
    }
    
    function completeOrder(uint _id) public onlyOrderOwner(_id) returns(bool)
    {
        (uint _budget, , address _freelancer) = _removeOrder(_id);
        require(_freelancer != address(0), "Can't send coins to 0x0 address");
        uint to_freelancer = _budget.mul(100 - houseEdge).div(100);  // budget * (100 - houseEdge) / 100)
        _freelancer.transfer(to_freelancer);
        return true;
    }
}