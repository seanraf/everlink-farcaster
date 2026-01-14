// 'use client';
// import { useState, useEffect } from 'react';
// import {
//   useAccount,
//   useWriteContract,
//   useBalance,
//   usePublicClient,
//   useWaitForTransactionReceipt,
// } from 'wagmi';
// import { baseSepolia } from 'wagmi/chains';
// import { formatEther, parseEther } from 'viem';
// import { Box } from './Box';
// import { splitAndMintAbi } from '../abi/splitAndMint';
// import ETHPrice from './ETHPrice';

// const CONTRACT_ADDRESS = '0x9621473C88f95589aB21408f773555cf8839E26A';

// export default function Minter() {
//   const [gasFee, setGasFee] = useState<bigint | null>(null);
//   const [totalCost, setTotalCost] = useState<bigint | null>(null);
//   const { address, isConnected } = useAccount();
//   const { data: balanceData } = useBalance({
//     address,
//     chainId: baseSepolia.id,
//   });

//   const publicClient = usePublicClient({ chainId: baseSepolia.id });

//   // const RECEIVER_WALLET_ADDRESS = '0x2990731080E4511D12892F96D5CDa51bF1B9D56c';
//   const MINT_PRICE = '0.001';

//   console.log('balanceData:', balanceData);
//   const [status, setStatus] = useState<string | null>(null);
//   console.log('status:', status);

//   // const link = 'https://ar-io.net/Gme9IFaNz-iSL77u5j0CxQJ1rrjXZgaNOIQwDUocU0Y';
//   const { data: txHash, writeContract, isPending } = useWriteContract();

//   // Wait for the transaction receipt

//   const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
//     hash: txHash,
//   });

//   useEffect(() => {
//     if (!publicClient) return;
//     publicClient.getChainId().then((id) => {
//       console.log('Public Client Chain ID:', id);
//     });
//   }, [publicClient]);

//   useEffect(() => {
//     if (isConfirmed) {
//       setStatus('✅ Transaction confirmed! NFT minted successfully.');
//     }
//   }, [isConfirmed]);

//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (!address || !publicClient) return;
//       const balance = await publicClient.getBalance({ address });
//       console.log('Manual Balance:', formatEther(balance));
//     };
//     fetchBalance();
//   }, [address, publicClient]);

//   useEffect(() => {
//     const calculateCost = async () => {
//       if (!publicClient || !address) return;

//       try {
//         const mintValue = parseEther(MINT_PRICE);

//         const estimatedGas = await publicClient.estimateContractGas({
//           address: CONTRACT_ADDRESS,
//           abi: splitAndMintAbi,
//           functionName: 'mint',
//           args: [
//             'Gme9IFaNz-iSL77u5j0CxQJ1rrjXZgaNOIQwDUocU0Y',
//             // RECEIVER_WALLET_ADDRESS,
//           ],
//           value: mintValue,
//           account: address,
//         });

//         const gasPrice = await publicClient.getGasPrice();

//         const estimatedGasFee = estimatedGas * gasPrice;
//         const total = mintValue + estimatedGasFee;

//         setGasFee(estimatedGasFee);
//         setTotalCost(total);
//       } catch (error) {
//         console.error('Gas estimation failed:', error);
//       }
//     };

//     calculateCost();
//   }, [publicClient, address]);

//   const handleMint = async () => {
//     if (!isConnected) {
//       setStatus('⚠️ Please connect your Farcaster wallet first.');
//       return;
//     }

//     try {
//       setStatus('⏳ Minting in progress...');

//       writeContract({
//         address: CONTRACT_ADDRESS,
//         abi: splitAndMintAbi,
//         functionName: 'mint',
//         args: [
//           'Gme9IFaNz-iSL77u5j0CxQJ1rrjXZgaNOIQwDUocU0Y',
//           // RECEIVER_WALLET_ADDRESS,
//         ],
//         value: parseEther(MINT_PRICE),
//         chainId: baseSepolia.id,
//       });
//     } catch (err) {
//       console.error(err);
//       setStatus('❌ Error while minting NFT. Check console for details.');
//     }
//   };

//   return (
//     <Box className='relative bg-[#1ab4a3] rounded-lg display:flex justify-center items-center'>
//       <span
//         className='block cursor-pointer font-extrabold text-center text-white px-6 py-3'
//         onClick={handleMint}
//       >
//         {isPending ? 'Minting...' : 'Mint'}
//       </span>
//       <p className='text-white mt-2 text-sm'>Wallet Address: {address}</p>
//       <p className='text-white mt-2 text-sm'>{status}</p>

//       {balanceData && (
//         <p className='text-white text-xs'>
//           Balance: {formatEther(balanceData.value)} ETH
//         </p>
//       )}
//       {gasFee && totalCost && (
//         <div className='text-white text-xs mt-3 text-center'>
//           <p>Mint Price: {MINT_PRICE} ETH</p>
//           <p>Estimated Gas: {formatEther(gasFee)} ETH</p>
//           <p className='font-bold'>
//             Total Required: {formatEther(totalCost)} ETH
//           </p>
//         </div>
//       )}
//       <ETHPrice />
//     </Box>
//   );
// }

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
import { formatEther, parseEther, encodeFunctionData, toHex } from 'viem';
import { Box } from './Box';
import { splitAndMintAbi } from '../abi/splitAndMint';
import ETHPrice from './ETHPrice';
import miniAppSdk from '@farcaster/miniapp-sdk';
import { sdk } from '@farcaster/miniapp-sdk';

const CONTRACT_ADDRESS = '0x9621473C88f95589aB21408f773555cf8839E26A';

export default function Minter() {
  const [gasFee, setGasFee] = useState<bigint | null>(null);
  const [totalCost, setTotalCost] = useState<bigint | null>(null);
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    chainId: baseSepolia.id,
  });

  const publicClient = usePublicClient({ chainId: baseSepolia.id });

  // const RECEIVER_WALLET_ADDRESS = '0x2990731080E4511D12892F96D5CDa51bF1B9D56c';
  const MINT_PRICE = '0.001';

  console.log('balanceData:', balanceData);
  const [status, setStatus] = useState<string | null>(null);
  console.log('status:', status);

  // const link = 'https://ar-io.net/Gme9IFaNz-iSL77u5j0CxQJ1rrjXZgaNOIQwDUocU0Y';
  const { data: txHash, isPending } = useWriteContract();

  // Wait for the transaction receipt

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (!publicClient) return;
    publicClient.getChainId().then((id) => {
      console.log('Public Client Chain ID:', id);
    });
  }, [publicClient]);

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

  useEffect(() => {
    const calculateCost = async () => {
      if (!publicClient || !address) return;

      try {
        const mintValue = parseEther(MINT_PRICE);

        const estimatedGas = await publicClient.estimateContractGas({
          address: CONTRACT_ADDRESS,
          abi: splitAndMintAbi,
          functionName: 'mint',
          args: [
            'Gme9IFaNz-iSL77u5j0CxQJ1rrjXZgaNOIQwDUocU0Y',
            // RECEIVER_WALLET_ADDRESS,
          ],
          value: mintValue,
          account: address,
        });

        const gasPrice = await publicClient.getGasPrice();

        const estimatedGasFee = estimatedGas * gasPrice;
        const total = mintValue + estimatedGasFee;

        setGasFee(estimatedGasFee);
        setTotalCost(total);
      } catch (error) {
        console.error('Gas estimation failed:', error);
      }
    };

    calculateCost();
  }, [publicClient, address]);

  const handleMint = async () => {
    await sdk.actions.ready();

    const provider = await sdk.wallet.getEthereumProvider();

    if (!provider) {
      setStatus('⚠️ Wallet provider unavailable');
      return;
    }

    if (!isConnected) {
      setStatus('⚠️ Please connect your Farcaster wallet first.');
      return;
    }

    if (!miniAppSdk.isInMiniApp()) {
      setStatus('⚠️ Open this inside Warpcast');
      return;
    }

    try {
      setStatus('⏳ Minting in progress...');

      const data = encodeFunctionData({
        abi: splitAndMintAbi,
        functionName: 'mint',
        args: ['Gme9IFaNz-iSL77u5j0CxQJ1rrjXZgaNOIQwDUocU0Y'],
      });

      // writeContract({
      //   address: CONTRACT_ADDRESS,
      //   abi: splitAndMintAbi,
      //   functionName: 'mint',
      //   args: [
      //     'Gme9IFaNz-iSL77u5j0CxQJ1rrjXZgaNOIQwDUocU0Y',
      //     // RECEIVER_WALLET_ADDRESS,
      //   ],
      //   value: parseEther(MINT_PRICE),
      //   chainId: baseSepolia.id,
      // });
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: address, // Farcaster-connected address
            to: CONTRACT_ADDRESS,
            value: toHex(parseEther(MINT_PRICE)),
            data,
            chainId: toHex(baseSepolia.id), // 0x14a34
          },
        ],
      });

      setStatus(`✅ Mint submitted! Tx: ${txHash}`);
    } catch (err) {
      console.error(err);
      setStatus('❌ Error while minting NFT. Check console for details.');
    }
  };

  return (
    <Box className='relative bg-[#1ab4a3] rounded-lg display:flex justify-center items-center'>
      <span
        className='block cursor-pointer font-extrabold text-center text-white px-6 py-3'
        onClick={handleMint}
      >
        {isPending ? 'Minting...' : 'Mint'}
      </span>
      <p className='text-white mt-2 text-sm'>Wallet Address: {address}</p>
      <p className='text-white mt-2 text-sm'>{status}</p>

      {balanceData && (
        <p className='text-white text-xs'>
          Balance: {formatEther(balanceData.value)} ETH
        </p>
      )}
      {gasFee && totalCost && (
        <div className='text-white text-xs mt-3 text-center'>
          <p>Mint Price: {MINT_PRICE} ETH</p>
          <p>Estimated Gas: {formatEther(gasFee)} ETH</p>
          <p className='font-bold'>
            Total Required: {formatEther(totalCost)} ETH
          </p>
        </div>
      )}
      <ETHPrice />
    </Box>
  );
}
