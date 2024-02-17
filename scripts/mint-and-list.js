const { ethers, deployments } = require("hardhat");

const PRICE = ethers.parseEther("0.2");

async function interactWithMyContract() {
    const nftMarketplace = await ethers.getContractAt(
        (await deployments.get("NftMarketPlace")).abi,
        (await deployments.get("NftMarketPlace")).address,
    );
    const basicNft = await ethers.getContractAt(
        (await deployments.get("BasicNFT")).abi,
        (await deployments.get("BasicNFT")).address,
    );

    console.log("Minitin a Basic NFT ...");

    const mintTx = await basicNft.mintNFT();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.logs[0].args.tokenId;

    console.log("Approving NFT");
    const approvalTx = await basicNft.approve(nftMarketplace.target, tokenId);
    await approvalTx.wait(1);

    console.log("Listing NFT...");

    const listingTx = await nftMarketplace.listItem(basicNft.target, tokenId, PRICE);
    await listingTx.wait(1);
    console.log("Listed !");
}

interactWithMyContract()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
