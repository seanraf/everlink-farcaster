'use client';
import { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useBalance,
  usePublicClient,
  //   useWaitForTransactionReceipt,
} from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

import { formatEther } from 'viem';
import { Box } from './Box';
import axios from 'axios';
import { contractABI } from '../abi/mintAbi';
import { USDC_ABI } from '../abi/usdcAbi';
// import { waitForTransactionReceipt } from 'viem/actions';

const ABI = contractABI;

export default function Minter({ ipfsTaskId }: { ipfsTaskId: string }) {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL as string;
  //   const contractAddress = import.meta.env.VITE_SMART_CONTRACT_ADDRESS as string;
  const CONTRACT_ADDRESS = '0xD187Bef30c558727B07A59249223bD45F567AAf6';
  const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

  const [arweaveTransactionId, setArweaveTransactionId] = useState('');
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    chainId: baseSepolia.id,
  });

  const publicClient = usePublicClient();

  console.log('balanceData:', balanceData);
  const [status, setStatus] = useState<string | null>(null);
  console.log('status:', status);

  //   const { writeContract, data: txHash } = useWriteContract();
  const { writeContract: approveUSDC, data: approveHash } = useWriteContract();
  const { writeContract: mintNFT, data: mintHash } = useWriteContract();

  //   const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
  //     hash: txHash,
  //   });
  //   console.log('txHash:', txHash);

  //   useEffect(() => {
  //     if (isConfirmed) {
  //       setStatus('✅ Transaction confirmed! NFT minted successfully.');
  //     //   console.log('txHash:', txHash);
  //     }
  //   }, [isConfirmed]);

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
      const response = await axios.get(
        `${backendBaseUrl}/api/deploymentHistory/${ipfsTaskId}`
      );
      const deploymentRecords = response.data.records;
      if (deploymentRecords) {
        setArweaveTransactionId(deploymentRecords.arweaveUrl);
      } else {
        console.error('No deployment records found.');
      }
      console.log('arweaveTransactionId:', arweaveTransactionId);

      const amountUSDC = BigInt(1 * 1e6);
      const receiverWallet = '0x2990731080E4511D12892F96D5CDa51bF1B9D56c';
      setStatus('🔄 Step 1/2: Approving USDC...');

      approveUSDC({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, amountUSDC],
        chainId: baseSepolia.id,
      });

      const approveReceipt = await publicClient?.waitForTransactionReceipt({
        hash: approveHash!, // this comes from wagmi hook automatically
      });
      console.log('approveReceipt:', approveReceipt);
      setStatus('🔄 Step 2/2: Minting NFT...');

      mintNFT({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'mint',
        args: [arweaveTransactionId, amountUSDC, receiverWallet],
        chainId: baseSepolia.id,
      });

      //   await axios.put(`${backendBaseUrl}/api/deploymentHistory/${ipfsTaskId}`, {
      //     txHash: `${txHash}`,
      //   });

      await publicClient?.waitForTransactionReceipt({ hash: mintHash! });
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
