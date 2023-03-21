const Erc20Locker = artifacts.require('ERC20Locker');
const LpLocker = artifacts.require('LPLocker');

module.exports = function (deployer) {
  deployer.deploy(Erc20Locker, 250);
  deployer.deploy(LpLocker, 250);
};
