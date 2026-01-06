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
  // createPublicClient,
  formatEther,
  // formatUnits,
  // http,
  // parseAbi,
} from 'viem';
import { Box } from './Box';
// import axios from 'axios';
// import { contractABI } from '../abi/mintAbi';
// import { USDC_ABI } from '../abi/usdcAbi';
// import { waitForTransactionReceipt } from 'viem/actions';

// const ABI = contractABI;

// const client = createPublicClient({
//   chain: base,
//   transport: http(),
// });

export default function Minter({ ipfsTaskId }: { ipfsTaskId: string }) {
  // const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL as string;
  //   const contractAddress = import.meta.env.VITE_SMART_CONTRACT_ADDRESS as string;
  console.log(ipfsTaskId);

  // const [arweaveTransactionId, setArweaveTransactionId] = useState('');
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

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !publicClient) return;
      const balance = await publicClient.getBalance({ address });
      console.log('Manual Balance:', formatEther(balance));
    };
    fetchBalance();
  }, [address, publicClient]);

  const handleMint = async () => {
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
