var DappWork = artifacts.require("DappWork");

var houseEdge = 1;  // in %

module.exports = function(deployer) {
    deployer.deploy(DappWork, houseEdge);
  };
