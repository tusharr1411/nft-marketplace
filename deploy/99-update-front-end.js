const { ethers, deployments, network } = require("hardhat");
const fs = require("fs");
require("dotenv").config();
const forntEndContractsFiles =
    "../nft-marketplace-frontend/frontend-moralis/constants/networkMapping.json";

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("updating front end ... ");
        await updateContractAddresses();
    }
};

async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContractAt(
        (await deployments.get("NftMarketPlace")).abi,
        (await deployments.get("NftMarketPlace")).address,
    );

    const chainId = network.config.chainId.toString();
    const contractAddresses = JSON.parse(fs.readFileSync(forntEndContractsFiles, "utf8"));
    // console.log(contractAddresses);

    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketPlace"].includes(nftMarketplace.target)) {
            contractAddresses[chainId]["NftMarketPlace"].push(nftMarketplace.target);
        }
    } else {
        contractAddresses[chainId] = { NftMarketPlace: [nftMarketplace.target] };
    }
    fs.writeFileSync(forntEndContractsFiles, JSON.stringify(contractAddresses));
}

module.exports.tags = ["all", "frontend"];
