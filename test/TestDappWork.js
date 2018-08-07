const DappWork = artifacts.require("DappWork");

async function hasReverted(contractCall) {
  try {
    await contractCall;
    return false;
  } catch (e) {
    return /revert/.test(e.message);
  }
}

contract('DappWork', accounts => {
    let dappWork;
  
    beforeEach(async () => {
      dappWork = await DappWork.deployed();
    });

    it('Check the owner', async () => {
        assert.equal(await dappWork.owner.call(), accounts[0]);
    });
});