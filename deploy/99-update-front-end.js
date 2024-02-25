const { ethers, deployments, network } = require("hardhat");
const fs = require("fs");
require("dotenv").config();
const forntEndContractsFiles = "../nft-marketplace-frontend/frontend-moralis/constants/networkMapping.json";
const frontEndAbiLocation = "../nft-marketplace-frontend/frontend-moralis/constants/";

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("updating front end ... ");
        await updateContractAddresses();
        await updateAbi();
    }
};

async function updateAbi() {
    const nftMarketplace = await ethers.getContractAt(
        (await deployments.get("NftMarketPlace")).abi,
        (await deployments.get("NftMarketPlace")).address,
    );
    fs.writeFileSync(`${frontEndAbiLocation}NftMarketPlace.json`, nftMarketplace.interface.formatJson());

    const basicNft = await ethers.getContractAt(
        (await deployments.get("BasicNFT")).abi,
        (await deployments.get("BasicNFT")).address,
    );
    fs.writeFileSync(`${frontEndAbiLocation}BasicNFT.json`, basicNft.interface.formatJson());

}

async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContractAt(
        (await deployments.get("NftMarketPlace")).abi,
        (await deployments.get("NftMarketPlace")).address,
    );
    console.log(network)

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
