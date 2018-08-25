pragma solidity ^0.4.24;

import "../app/node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Register for the DappWork caontract
 * @author drag0no (Pavel Krot - krotpv@gmail.com)
 */
contract DappWorkRegister is Ownable
{
    // Ownable - For contract administration

    // Address for a current contract instance
    address public backendContract;
    // Array of the previous contract addresses
    address[] public previousBackends;

    // Event for tracking new contract instance address
    event LogBackendContractChanged(address indexed backendContract);

    /**
    * @notice Setting up the the current contract instance address
    * @param currentBackend Address of the contract
    */
    constructor(address currentBackend) public
    {
        require(currentBackend != address(0), "0x0 address is not allowed");
        backendContract = currentBackend;
    }

    /**
    * @dev Classic fallback function to prevent unnecessary funds transfers
    */
    function() public payable 
    {
        revert("No plain funds transfer allowed");
    }

    /**
    * @notice Get the number of the stored addresses
    * @dev Use it in the frontend to iterate over addresses
    * @return The number of stored contract addresses
    */
    function getPreviousBackendsCount() public view returns(uint) {
        return previousBackends.length;
    }

    /**
    * @notice Setting up the new contract instance address
    * @param newBackend New contract address
    */
    function changeBackend(address newBackend) public onlyOwner
    {
        if (newBackend != backendContract) {
            previousBackends.push(backendContract);
            backendContract = newBackend;

            emit LogBackendContractChanged(backendContract);
        }
    }
}