//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

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

contract NftMarketPlace {
    //---------------------  Type Declaration  ---------------------//
    struct Listing {
        uint256 price; //price of NFT
        address seller; // owner of that NFT
    }

    //--------------------------  Events  --------------------------//
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    //---------------------  Global Variables  ---------------------//
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    //-----------------------  Constructor   -----------------------//
    constructor() {}

    //-------------------------  Modifier  -------------------------//

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

    //----------------------  Main Functions  ----------------------//
    /*
    
    */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
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
}
