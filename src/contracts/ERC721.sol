// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SimpleArweaveNFT is ERC721URIStorage {
    uint256 public nextId = 1;

    constructor() ERC721("ArweaveNFT", "ARW") {}

    function mint(string memory arweaveLink) external {
        uint256 tokenId = nextId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, arweaveLink);
    }
}
