const { network } = require("hardhat")
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");



module.exports = async({getNamedAccounts, deployments})=>{
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();


    let args = [];

    const nftMarketplace = await deploy("NftMarketPlace",{
        from:deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.waitConfirmations || 1
    })


    //verify the deployed contract if not on development chains(not on hardhat or ganache)
    if(!DEVELOPMENT_CHAINS.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log("Verifying the contract...");
        await verify(nftMarketplace.address, args);
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all",]