'use client';
import { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useBalance,
  usePublicClient,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { contractABI } from '../utils/abi';
import { formatEther } from 'viem';
import { Box } from './Box';

const CONTRACT_ADDRESS = '0x28dA343F976B00c1aFF992cee398B02813244070';
const ABI = contractABI;

export default function Minter() {
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    chainId: baseSepolia.id,
  });

  const publicClient = usePublicClient();

  console.log('balanceData:', balanceData);
  const [status, setStatus] = useState<string | null>(null);
  console.log('status:', status);

  const link =
    'https://arweave.net/Gme9IFaNz-iSL77u5j0CxQJ1rrjXZgaNOIQwDUocU0Y';
  const { writeContract, data: txHash } = useWriteContract();

  // Wait for the transaction receipt

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isConfirmed) {
      setStatus('✅ Transaction confirmed! NFT minted successfully.');
    }
  }, [isConfirmed]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !publicClient) return;
      const balance = await publicClient.getBalance({ address });
      console.log('Manual Balance:', formatEther(balance));
    };
    fetchBalance();
  }, [address, publicClient]);

  const handleMint = async () => {
    if (!isConnected) {
      setStatus('⚠️ Please connect your Farcaster wallet first.');
      return;
    }

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'mint',
        args: [link],
        chainId: baseSepolia.id,
      });

      setStatus('✅ NFT minted successfully!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Error while minting NFT. Check console for details.');
    }
  };

  return (
    <Box className='relative bg-[#1ab4a3] rounded-lg'>
      <span
        className='block cursor-pointer font-extrabold text-center text-white px-6 py-3'
        onClick={handleMint}
      >
        Mint
      </span>
    </Box>
  );
}
