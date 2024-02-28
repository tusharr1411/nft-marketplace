const { network } = require("hardhat");
const { DEVELOPMENT_CHAINS } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const args = [];

    const basicNft = await deploy("BasicNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    //verify the deployed contract if not on development chains(not on hardhat or ganache)
    if (!DEVELOPMENT_CHAINS.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying the contract...");
        await verify(basicNft.address, args);
    }
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "basicNft"];
