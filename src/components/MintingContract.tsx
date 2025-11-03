'use client';
import { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useBalance,
  usePublicClient,
} from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { contractABI } from '../utils/abi';
import { encodeFunctionData, formatEther } from 'viem';

const CONTRACT_ADDRESS = '0x28dA343F976B00c1aFF992cee398B02813244070';
const ABI = contractABI;

export default function MintButton() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, isSuccess } = useWriteContract();
  const { data: balanceData } = useBalance({
    address,
    chainId: baseSepolia.id,
  });
  const publicClient = usePublicClient();
  console.log('balanceData:', balanceData);
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !publicClient) return;
      const balance = await publicClient.getBalance({ address });
      console.log('Manual Balance:', formatEther(balance));
    };
    fetchBalance();
  }, [address, publicClient]);

  useEffect(() => {
    const estimateGas = async () => {
      if (!isConnected || !link || !publicClient) return;

      try {
        const data = encodeFunctionData({
          abi: ABI,
          functionName: 'mint',
          args: [link],
        });

        const gas = await publicClient.estimateGas({
          account: address as `0x${string}`,
          to: CONTRACT_ADDRESS,
          data,
        });

        const gasPrice = await publicClient.getGasPrice();
        const totalFeeWei = gas * gasPrice;
        const totalFeeEth = formatEther(totalFeeWei);
        setGasEstimate(totalFeeEth);
      } catch (error) {
        console.error('Gas estimation error:', error);
        setGasEstimate(null);
      }
    };

    estimateGas();
  }, [isConnected, link, address, publicClient]);

  const handleMint = async () => {
    if (!isConnected) {
      setStatus('⚠️ Please connect your Farcaster wallet first.');
      return;
    }

    try {
      const tx = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'mint',
        args: [link],
        chainId: baseSepolia.id,
      });

      console.log('TX Result:', tx);
      setStatus('✅ NFT minted successfully!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Error while minting NFT. Check console for details.');
    }
  };

  return (
    <div className='p-4'>
      {!isConnected && <h3>Wallet Connected===== {address}</h3>}
      <p className='mt-4 text-sm text-gray-500 whitespace-pre-line'>
        Wallet Address: {isConnected ? address : 'Not connected'}
      </p>
      {balanceData && (
        <p className='text-sm text-gray-500 mb-2'>
          💰 Balance: {parseFloat(formatEther(balanceData.value)).toFixed(4)}{' '}
          ETH
        </p>
      )}

      {gasEstimate && (
        <p className='text-sm text-gray-500 mb-2'>
          ⛽ Estimated Fee: {parseFloat(gasEstimate).toFixed(6)} ETH
        </p>
      )}
      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder='Enter Arweave Link'
        className='border p-2 w-full rounded-md mb-3'
      />
      <button
        onClick={handleMint}
        disabled={isPending}
        className='bg-blue-600 text-white px-4 py-2 rounded-md'
      >
        {isPending ? 'Minting...' : 'Mint NFT'}
      </button>
      {status && (
        <p className='mt-4 text-sm text-gray-200 whitespace-pre-line'>
          {status}
        </p>
      )}
      {isSuccess && <p className='mt-2 text-green-600'>Minted!</p>}
    </div>
  );
}
