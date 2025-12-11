'use client';
import { useState, useEffect } from 'react';
import {
  // useWriteContract,
  useBalance,
  usePublicClient,
  //   useWaitForTransactionReceipt,
} from 'wagmi';
import { base } from 'wagmi/chains';

import {
  createPublicClient,
  formatEther,
  // formatUnits,
  http,
  // parseAbi,
} from 'viem';
import { Box } from './Box';
// import axios from 'axios';
// import { contractABI } from '../abi/mintAbi';
// import { USDC_ABI } from '../abi/usdcAbi';
// import { waitForTransactionReceipt } from 'viem/actions';

// const ABI = contractABI;

const USDC = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';
// const ERC20_ABI = parseAbi([
//   'function balanceOf(address owner) view returns (uint256)',
//   'function decimals() view returns (uint8)',
// ]);

const client = createPublicClient({
  chain: base,
  transport: http(),
});

export default function Minter({ ipfsTaskId }: { ipfsTaskId: string }) {
  // const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL as string;
  //   const contractAddress = import.meta.env.VITE_SMART_CONTRACT_ADDRESS as string;
  // const CONTRACT_ADDRESS = '0xD187Bef30c558727B07A59249223bD45F567AAf6';
  // const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
  console.log(ipfsTaskId);

  // const [arweaveTransactionId, setArweaveTransactionId] = useState('');
  // const { address, isConnected } = useAccount();
  // const address = '0xb7eDc34F75E71d927bC86C5bDf8b8883B89C8ef6';
  const address = '0xEDA1896bDf3908c2e480492ecfF0491a50D380eD';
  const { data: balanceData } = useBalance({
    address,
    chainId: base.id,
  });

  const publicClient = usePublicClient();

  console.log('balanceData:', balanceData);
  const [status] = useState<string | null>(null);
  console.log('status:', status);
  console.log('Address', address);

  const [nativeBalance, setNativeBalance] = useState<string | null>(null);
  // const [usdcBalance, setUsdcBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const code = await client.getCode({ address: USDC });
        // console.log('USDC contract code on this chain:', code);
        if (code === '0x') {
          console.error('❌ No contract found at USDC address on this chain');
          return;
        }

        // Native BASE balance
        const bal = await client.getBalance({ address: address! });
        console.log('bal', bal);
        setNativeBalance(formatEther(bal));

        // USDC token balance
        // const raw = await client.readContract({
        //   address: USDC,
        //   abi: ERC20_ABI,
        //   functionName: 'balanceOf',
        //   args: [address],
        // });
        // const decimals = await client.readContract({
        //   address: USDC,
        //   abi: ERC20_ABI,
        //   functionName: 'decimals',
        // });
        // setUsdcBalance(formatUnits(raw as bigint, Number(decimals)));
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);
  console.log(`Native (BASE): ${nativeBalance ?? 'Loading...'}`);
  // console.log(`USDC: ${usdcBalance ?? 'Loading...'}`);

  //   const { writeContract, data: txHash } = useWriteContract();
  // const { writeContract: approveUSDC, data: approveHash } = useWriteContract();
  // const { writeContract: mintNFT, data: mintHash } = useWriteContract();

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

  // useEffect(() => {
  //   const fetchUSDCBalance = async () => {
  //     if (!address || !publicClient) return;

  //     const balance = await publicClient.readContract({
  //       address: USDC_ADDRESS,
  //       abi: USDC_ABI,
  //       functionName: 'balanceOf',
  //       args: [address],
  //     });

  //     console.log('USDC Balance (raw):', balance);

  //     // Convert from 6 decimals → human readable
  //     const formatted = Number(balance) / 1_000_000;
  //     console.log('USDC Balance:', formatted);
  //   };

  //   fetchUSDCBalance();
  // }, [address, publicClient]);

  const handleMint = async () => {
    // try {
    //   const response = await axios.get(
    //     // `${backendBaseUrl}/api/deploymentHistory/${ipfsTaskId}`
    //     `${backendBaseUrl}/api/deploymentHistory/691efb6829de4f00073ddffd`
    //   );
    //   const deploymentRecords = response.data.records;
    //   if (deploymentRecords) {
    //     setArweaveTransactionId(deploymentRecords.arweaveUrl);
    //     console.log('arweaveTransactionId:', arweaveTransactionId);
    //   } else {
    //     console.error('No deployment records found.');
    //   }

    //   const amountUSDC = 1_000_000n;
    //   const receiverWallet = '0x2990731080E4511D12892F96D5CDa51bF1B9D56c';
    //   setStatus('🔄 Step 1/2: Approving USDC...');

    //   approveUSDC({
    //     address: USDC_ADDRESS,
    //     abi: USDC_ABI,
    //     functionName: 'approve',
    //     args: [CONTRACT_ADDRESS, amountUSDC],
    //     chainId: baseSepolia.id,
    //   });

    //   while (!approveHash) {
    //     await new Promise((res) => setTimeout(res, 500));
    //   }
    //   console.log('approveHash:', approveHash);
    //   const approveReceipt = await publicClient?.waitForTransactionReceipt({
    //     hash: approveHash!, // this comes from wagmi hook automatically
    //   });
    //   console.log('approveReceipt:', approveReceipt);
    //   setStatus('🔄 Step 2/2: Minting NFT...');

    //   mintNFT({
    //     address: CONTRACT_ADDRESS,
    //     abi: ABI,
    //     functionName: 'mint',
    //     args: [arweaveTransactionId, amountUSDC, receiverWallet],
    //     chainId: baseSepolia.id,
    //   });

    //   //   await axios.put(`${backendBaseUrl}/api/deploymentHistory/${ipfsTaskId}`, {
    //   //     txHash: `${txHash}`,
    //   //   });

    //   while (!mintHash) {
    //     await new Promise((res) => setTimeout(res, 500));
    //   }

    //   await publicClient?.waitForTransactionReceipt({ hash: mintHash! });
    //   setStatus('✅ NFT minted successfully!');
    // } catch (err) {
    //   console.error(err);
    //   setStatus('❌ Error while minting NFT. Check console for details.');
    // }
    console.log('Handle triggered');
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
