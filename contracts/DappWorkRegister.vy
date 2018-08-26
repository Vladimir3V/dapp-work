# Event for tracking new contract instance address
BackendChanged: event({newBackend: address})

# Owner of the contract
owner: public(address)
# Address for a current contract instance
backendContract: public(address)
# Array of the previous contract addresses
previousBackends: public(address[100])
# Counter for the array above
previousBackendsCount: public(uint256)

# Setting up the the current contract instance address
# Owner is set to the one who deploys the contract
@public
def __init__(currentBackend: address):
    self.owner = msg.sender
    self.backendContract = currentBackend

# Setting up the new contract instance address
@public
def changeBackend(newBackend: address):
    assert msg.sender == self.owner
    assert newBackend != self.backendContract

    self.previousBackends[self.previousBackendsCount] = self.backendContract
    self.previousBackendsCount += 1
    self.backendContract = newBackend

    log.BackendChanged(newBackend)
