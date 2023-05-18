

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sepolia",
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/ddjZNEsR3zxQO5M2V9PpnSoA-QM5jJl4", //alchemyのURL
      accounts: [
        "9391d36cd1267ed78dd7bcb39782a1138843f5b0adba9b6150a84e01101aec77",
      ],//metamaskの秘密鍵
    },

  },

};
