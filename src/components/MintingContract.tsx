'use client';
import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { contractABI } from '../utils/abi';

const CONTRACT_ADDRESS = '0x28dA343F976B00c1aFF992cee398B02813244070';
const ABI = contractABI;

export default function MintButton() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, isSuccess } = useWriteContract();

  const [link, setLink] = useState('');
  const [status, setStatus] = useState<string | null>(null);

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
    <div className='p-4'>
      {!isConnected && <h3>Wallet Connected===== {address}</h3>}
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
