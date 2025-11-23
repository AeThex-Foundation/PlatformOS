require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv/config");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: process.env.POLYGON_PRIVATE_KEY ? [process.env.POLYGON_PRIVATE_KEY.replace(/^0x/, '')] : [],
      chainId: 137,
    },
    polygonAmoy: {
      url: process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: process.env.POLYGON_PRIVATE_KEY ? [process.env.POLYGON_PRIVATE_KEY.replace(/^0x/, '')] : [],
      chainId: 80002,
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY || process.env.ETHERSCAN_API_KEY || "",
    customChains: [
      {
        network: "polygon",
        chainId: 137,
        urls: {
          apiURL: "https://api.polygonscan.com/api",
          browserURL: "https://polygonscan.com"
        }
      },
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
