var DappWork = artifacts.require("DappWork");
var DappWorkRegister = artifacts.require("DappWorkRegister")

var houseEdge = 1;  // in %

module.exports = function(deployer) {
    deployer.deploy(DappWork, houseEdge)
      .then(() => DappWork.deployed())
      .then(dappWork => deployer.deploy(DappWorkRegister, dappWork.address));
  };
