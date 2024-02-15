//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

//ListItems: list NFTs on marketplace
//buyItem
//cancelItem : cancel a listing
//UpdateListing : update price
//withdrawProceeds : withdraw payment for my bought NFTs

//Custom errors
error NftMarketPlace__PriceMustBeAboveZero();
error NftMarketPlace__NotApprovedForMarketplace();
error NftMarketPlace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketPlace__NotOwner();
error NftMarketPlace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketPlace__PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error NftMarketPlace__NoProceeds();
error NftMarketPlace__TransferFailed();

contract NftMarketPlace is ReentrancyGuard {
    //--------------------------------------------------------------//
    //---------------------  Type Declaration  ---------------------//
    //--------------------------------------------------------------//
    struct Listing {
        uint256 price; //price of NFT
        address seller; // owner of that NFT
    }

    //--------------------------------------------------------------//
    //--------------------------  Events  --------------------------//
    //--------------------------------------------------------------//
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    //--------------------------------------------------------------//
    //---------------------  Global Variables  ---------------------//
    //--------------------------------------------------------------//
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => uint256) private s_proceeds; // seller->earned

    //--------------------------------------------------------------//
    //-----------------------  Constructor   -----------------------//
    //--------------------------------------------------------------//

    constructor() {}

    //--------------------------------------------------------------//
    //-------------------------  Modifiers  ------------------------//
    //--------------------------------------------------------------//

    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketPlace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NftMarketPlace__NotOwner();
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NftMarketPlace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    //--------------------------------------------------------------//
    //----------------------  Main Functions  ----------------------//
    //--------------------------------------------------------------//

    /*
     * @notice method for listing your NFT on the marketplace
     * @param nftAddress: Address of the NFT
     * @param tokenId: token Id of the NFT
     * @param price: sale price of the listed NFT
     * @dev Technically, we could have the contract be the escrow for the NFTs
     * but this way people can still hold their NFTs when listed
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        // address tokenPrice  // to sell in different coins
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert NftMarketPlace__PriceMustBeAboveZero();
        }
        //1. Send tge NFT to the contract. Transfer -> contract "hold the NFT.
        //2 Owner hold NFT and grant approval to nftmarketplace to sell the NFT for them.( they can withdraw approval at any time)
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketPlace__NotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(
        address nftAddress,
        uint256 tokenId
    ) external payable isListed(nftAddress, tokenId) nonReentrant {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert NftMarketPlace__PriceNotMet(nftAddress, tokenId, listedItem.price);
        }
        s_proceeds[listedItem.seller] += msg.value;
        // Not sending the to the seller instead we've created an array to record that how much a seller can pull(withdraw) from this contract
        // By doing this we are shifting the risk associated with transferring ether to the SELLER
        // https://fravoll.github.io/solidity-patterns/pull_over_push.html

        delete (s_listings[nftAddress][tokenId]); // delete the listing after being sold
        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);

        // check to make sure the NFT was transferred

        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    function cancelListing(
        address nftAddress,
        uint256 tokenId
    ) external isListed(nftAddress, tokenId) isOwner(nftAddress, tokenId, msg.sender) {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    ) external isListed(nftAddress, tokenId) isOwner(nftAddress, tokenId, msg.sender) {
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    function withdrawProceeds() external {
        uint256 proceed = s_proceeds[msg.sender];
        if (proceed <= 0) {
            revert NftMarketPlace__NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceed}("");
        if (!success) {
            revert NftMarketPlace__TransferFailed();
        }
    }

    //--------------------------------------------------------------//
    //---------------------  Getter Functions  ---------------------//
    //--------------------------------------------------------------//

    function getListing(
        address nftAddress,
        uint256 tokenId
    ) external view returns (Listing memory) {
        return s_listings[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
