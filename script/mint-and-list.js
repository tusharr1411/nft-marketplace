const { ethers } = require("hardhat");

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMakretPlace");
    const basicNft = await ethers.getContract(basic)
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(0);
    });
