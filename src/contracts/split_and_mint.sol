// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ArweaveMint is ERC721, ReentrancyGuard {
    uint256 public tokenIdCounter;

    // Optional: small platform fee, can be 0 if you don't want a fee
    uint256 public constant PLATFORM_FEE = 0; // in wei

    // Wallet that collects the platform fee
    address public immutable feeReceiver;

    // Hardcoded payout wallet (fixed)
    address public payoutWallet = 0x2990731080E4511D12892F96D5CDa51bF1B9D56c; // your wallet

    // tokenId => arweave hash
    mapping(uint256 => string) public arweaveHashes;

    event Minted(
        address indexed minter,
        uint256 indexed tokenId,
        string arweaveHash,
        uint256 totalPaid,
        address payoutWallet
    );

event PayoutSent(address indexed payoutWallet, uint256 amount);
    constructor() ERC721("Arweave NFT", "ARW") {
        feeReceiver = msg.sender; // deployer collects the fee
    }

    function mint(
        string calldata arweaveHash
        
    ) external payable nonReentrant {
        require(msg.value > PLATFORM_FEE, "Insufficient ETH sent");
        require(payoutWallet != address(0), "Invalid payout wallet");

        uint256 tokenId = tokenIdCounter++;
        _mint(msg.sender, tokenId);
        arweaveHashes[tokenId] = arweaveHash;

        // Send platform fee (optional)
        if (PLATFORM_FEE > 0) {
            (bool feeSent, ) = feeReceiver.call{value: PLATFORM_FEE}("");
            require(feeSent, "Fee transfer failed");
        }

        // Send remaining ETH to the dynamic payout wallet
        uint256 remaining = msg.value - PLATFORM_FEE;
        (bool sent, ) = payoutWallet.call{value: remaining}("");
        require(sent, "Payout transfer failed");

        emit Minted(msg.sender, tokenId, arweaveHash, msg.value, payoutWallet);
    }
}
