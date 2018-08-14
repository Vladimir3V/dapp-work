pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract DappWorkRegister is Ownable
{
    address public backendContract;
    address[] public previousBackends;

    event LogBackendContractChanged(address indexed backendContract);

    constructor(address currentBackend) public
    {
        require(currentBackend != address(0), "0x0 address is not allowed");
        backendContract = currentBackend;
    }

    function() public payable 
    {
        revert("No plain funds transfer allowed");
    }

    function getPreviousBackendsCount() public view returns(uint) {
        return previousBackends.length;
    }

    function changeBackend(address newBackend) public onlyOwner
    {
        if (newBackend != backendContract) {
            previousBackends.push(backendContract);
            backendContract = newBackend;

            emit LogBackendContractChanged(backendContract);
        }
    }
}