const Locker = artifacts.require('Locker');

module.exports = function (deployer) {
  deployer.deploy(Locker);
};
