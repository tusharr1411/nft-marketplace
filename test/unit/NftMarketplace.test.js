const { DEVELOPMENT_CHAINS, networkConfig } = require("../../helper-hardhat-config");
const { network, deployments, ethers, getNamedAccounts,  } = require("hardhat");
const {assert, expact} = require("chai");



!DEVELOPMENT_CHAINS.includes(network.name)
? describe.skip
: describe("NFT Marketplace Unit Tests:", () => {
    
    let nftMarketplaceContract,nftMarketplace, basicNft, deployer, player;
    const PRICE = ethers.parseEther("0.1");
    const TOKEN_ID = 0;

    
    
    beforeEach( async()=>{
        console.log("0000000000")
        deployer = (await getNamedAccounts()).deployer;
        // player = (await getNamedAccounts()).player;

        const accounts = await ethers.getSigners();
        player = accounts[1];

        await deployments.fixture(["all"]);

        nftMarketplace = await ethers.getContract("NftMarketPlace");// ethers.getContract grab whatever the 0th account i.e., deployer
        // nftMarketplace = await nftMarketplace.connect(player)// player is connected to NFT marketplace
        basicNft = await ethers.getContract("BasicNFT"); // connected to deployer


        await basicNft.mintNft()// minted by deployer
        //The approve function allows an NFT owner to give permission for a specific address to transfer their NFT token on their behalf.
        await basicNft.approve(nftMarketplace.address, TOKEN_ID)

        // Test 1: It can be listed:
        it("lists and can be bought", async()=>{
            await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);// deployer listed it
            const playerConnectedToNftMakrketplace = nftMarketplace.connect(player);
            await playerConnectedToNftMakrketplace.buyItem(basicNft.address, TOKEN_ID,{value: PRICE});

            const newOwner = await basicNft.ownerOf(TOKEN_ID)// NFTs bult in function
            const deployerProceeds = await nftMarketplace.getProceeds(deployer);

            assert(newOwner.toString() == player.address);
            assert(deployerProceeds.toString() == PRICE.toString());

            // console.log("--------")
            // console.log(deployer)
            // console.log("--------")
            // console.log(player)
        })



    })




});
