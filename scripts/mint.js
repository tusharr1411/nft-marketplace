const { ethers, deployments, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-block");

const PRICE = ethers.parseEther("0.2");

async function mint() {
    const basicNft = await ethers.getContractAt(
        (await deployments.get("BasicNFT")).abi,
        (await deployments.get("BasicNFT")).address,
    );

    console.log("Minitin a Basic NFT ...");
    const mintTx = await basicNft.mintNFT();
    const mintTxReceipt = await mintTx.wait(1);
    const tokenId = mintTxReceipt.logs[0].args.tokenId;
    console.log(`Got tokenID: ${tokenId} of NFT Address: ${basicNft.target}`);

    if (network.config.chainId == 31337) {
        await moveBlocks(2, (sleepAmount = 1000));
    }
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
