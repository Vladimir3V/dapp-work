const DappWork = artifacts.require("DappWork");
const DappWorkRegister = artifacts.require("DappWorkRegister");

async function hasReverted(contractCall) {
  try {
    await contractCall;
    return false;
  } catch (e) {
    return /revert/.test(e.message);
  }
}

contract("DappWorkRegister", accounts => {
    let register, dappWork01, dappWork02;
    const house_edge = 1;

    before(async () => {
        dappWork01 = await DappWork.new(house_edge, {from: accounts[0]});
        dappWork02 = await DappWork.new(house_edge, {from: accounts[0]});
        register = await DappWorkRegister.new(dappWork01.address, {from: accounts[0]});
    });

    it("[OK] Check the owner account#0 of main and registry contracts", async () => {
        assert.equal(await dappWork01.owner.call(), accounts[0]);
        assert.equal(await register.owner.call(), accounts[0]);
    });

    it("[OK] Check the backend address and length of previous backends array", async () => {
        assert.equal(await register.backendContract.call(), dappWork01.address);
        assert.equal(await register.getPreviousBackendsCount(), 0);
    });

    it("[REVERT] Change backend address from 'unknown' account#1", async () => {
        assert.ok(await hasReverted(
            register.changeBackend(dappWork02.address, {from: accounts[1]})
        ));
    });

    it("[OK] Change backend address from 'owner' account#0 and check new address", async () => {
        await register.changeBackend(dappWork02.address, {from: accounts[0]});
        assert.equal(await register.backendContract.call(), dappWork02.address);
    });

    it("[OK] Check that previous contract address was saved", async () => {
        assert.equal(await register.getPreviousBackendsCount(), 1);
        assert.equal(await register.previousBackends.call(0), dappWork01.address);
    });
});
