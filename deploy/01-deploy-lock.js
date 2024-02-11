// script to deploy compiled smartcontract

const { network } = require("hardhat")
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");



module.exports = async()=>{



    //deploy the contract




    //verify the deployed contract if not on development chains(not on hardhat or ganache)
    if(!DEVELOPMENT_CHAINS.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log("Verifying the contract...");
        await verify()
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all",]