require("@nomicfoundation/hardhat-toolbox")//
require("dotenv").config()
require("hardhat-deploy")


/** @type import('hardhat/config').HardhatUserConfig */


//mainnet variables
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL
const MAINNET_PVT_KEY = process.env.MAINNET_PVT_KEY

//sepolia variables
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const SEPOLIA_PVT_KEY = process.env.SEPOLIA_PVT_KEY

// rinkeby variables
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const RINKEBY_PVT_KEY = process.env.RINKEBY_PVT_KEY

// polygon variables
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL
const POLYGON_MAINNET_PVT_KEY = process.env.POLYGON_MAINNET_PVT_KEY

// API KEY for contract verification
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY


//gas reporter -coinmarket-api-key
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const GAS_REPORTER = process.env.GAS_REPORTER || false;



module.exports = {
    solidity: {
      compilers:[
        {version:"0.8.7"},
        {version:"0.4.24"},
        {version:"0.8.20"},

      ]
    },


    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            // // If you want to do some forking, uncomment this
            // forking: {
            //   url: MAINNET_RPC_URL
            // }
        },
        localhost: {
            chainId: 31337,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            chainId: 11155111,
            accounts: SEPOLIA_PVT_KEY !== undefined ? [SEPOLIA_PVT_KEY] : [],
            // accounts:{
            //   mnemonic:MNEMONIC,
            // },
            saveDeployments: true,
            blockConfirmations: 6,
        },
        rinkeby: {
            url: MAINNET_RPC_URL,
            chainId: 1,
            accounts: MAINNET_PVT_KEY !== undefined ? [MAINNET_PVT_KEY] : [],
            // accounts:{
            //   mnemonic:MNEMONIC,
            // },
            saveDeployments: true,
            blockConfirmations: 6,
        },
        mainnet: {
            url: MAINNET_RPC_URL,
            chainId: 4,
            accounts: MAINNET_PVT_KEY !== undefined ? [MAINNET_PVT_KEY] : [],
            // accounts:{
            //   mnemonic:MNEMONIC,
            // },
            saveDeployments: true,
        },
        polygon: {
            url: POLYGON_MAINNET_RPC_URL,
            chainId: 137,
            accounts: POLYGON_MAINNET_PVT_KEY != undefined ? [POLYGON_MAINNET_PVT_KEY] : [],
            saveDeployments: true,
        },
    },


    namedAccounts:{
        deployer:{
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        player:{
            default:1,
        }
    },

    etherscan: {
        //npx hardhat verify --network NETWORK_NAME DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
        apiKey: {
            mainnet: ETHERSCAN_API_KEY,
            sepolia: ETHERSCAN_API_KEY,
            polygon: POLYGONSCAN_API_KEY,
        },
    },

    gasReporter:{
      enabled: GAS_REPORTER,
      currency:"USD",
      outputFile:"gas-report.txt",
      noColors:true,
      coinmarketcap: COINMARKETCAP_API_KEY,
    },


    mocha:{
      timeout:200000, // 200 seconds max for running tests  
    },

    contractSizer:{
      runCompile: false,
      only:["NftMarketplace"],
    },
}
