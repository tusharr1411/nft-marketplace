const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-block");

const TOKEN_ID = 0; //hardhcoded from moralis server

async function cancel() {
    const nftMarketplace = await ethers.getContractAt(
        (await deployments.get("NftMarketPlace")).abi,
        (await deployments.get("NftMarketPlace")).address,
    );
    const basicNft = await ethers.getContractAt(
        (await deployments.get("BasicNFT")).abi,
        (await deployments.get("BasicNFT")).address,
    );

    const tx = await nftMarketplace.cancelListing(basicNft.target, TOKEN_ID);
    await tx.wait(1);
    console.log("NFT listing canceled form the marketplace");
    if ((network.name = "localhost")) {
        await moveBlocks(2, (sleepAmount = 1000));
    }
}

cancel()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
