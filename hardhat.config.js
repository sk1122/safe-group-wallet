/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv/config");

const { HARDHAT_PORT } = process.env;

module.exports = {
  solidity: "0.7.3",
  networks: {
    localhost: { url: `http://127.0.0.1:${HARDHAT_PORT}` },
    hardhat: {
      accounts: [{"privateKey":"0xcb7debf1c454a7c98b0aad509aee279a8bb0ee873878283ebcdd1d1918ebd697","balance":"1000000000000000000000"},{"privateKey":"0x2d1d83d601f250ac6a5816c114a6d099c5519f4877f0ea3dfbe5385141f6e055","balance":"1000000000000000000000"},{"privateKey":"0x0463fd0a78179446952ef214a489832bf044c430ea4a830554331ee2753de834","balance":"1000000000000000000000"},{"privateKey":"0xfb1e778b9b1cf1ea1d51b7216a236c23ca7f86c60f6bf69f9d5b039a52174534","balance":"1000000000000000000000"},{"privateKey":"0x64f1308bfbb1bd03e660b623b0bab9c9f06bd6497a400cb4587d17311eaad991","balance":"1000000000000000000000"},{"privateKey":"0x74fb1417900ac4d5352a76de980469ddff3b86fbe6b9d89073404ccf7419be38","balance":"1000000000000000000000"},{"privateKey":"0x485a6e4119f08b86613ca3c3e9c48c8eb82b0b86eabf84c11e8f63c2b93f31c9","balance":"1000000000000000000000"},{"privateKey":"0x808fc1e18016184982a160ca09464aa3202c83aeb01cfe43ee14eecfa1b05329","balance":"1000000000000000000000"},{"privateKey":"0xa46fed55fde9cac8cb99c261f9c3cb0236b91189990f4c320dcec475f36d4868","balance":"1000000000000000000000"},{"privateKey":"0xd8bec2c5facda9d428623e800bd72835f6e3820b56ee42b2057391c1883a1c28","balance":"1000000000000000000000"}]
    },
  },
  paths: {
    sources: './contracts',
    tests: './__tests__/contracts',
    cache: './cache',
    artifacts: './artifacts',
  },
};