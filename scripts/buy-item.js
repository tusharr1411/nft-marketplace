const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-block");

const TOKEN_ID = 2; //hardhcoded from moralis server

async function buy() {
    const nftMarketplace = await ethers.getContractAt(
        (await deployments.get("NftMarketPlace")).abi,
        (await deployments.get("NftMarketPlace")).address,
    );
    const basicNft = await ethers.getContractAt(
        (await deployments.get("BasicNFT")).abi,
        (await deployments.get("BasicNFT")).address,
    );

    const listing = await nftMarketplace.getListing(basicNft.target, TOKEN_ID);
    const price = listing.price.toString();

    const tx = await nftMarketplace.buyItem(basicNft.target, TOKEN_ID, { value: price });
    await tx.wait(1);
    console.log("Bought NFT");
    if ((network.name = "localhost")) {
        await moveBlocks(2, (sleepAmount = 1000));
    }
}

buy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
