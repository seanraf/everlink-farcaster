'use client';
import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWriteContract,
  useBalance,
  usePublicClient,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { contractABI } from '../utils/abi';
import { encodeFunctionData, formatEther } from 'viem';

const CONTRACT_ADDRESS = '0x28dA343F976B00c1aFF992cee398B02813244070';

export default function MintWithMetamask() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const {
    writeContract,
    data: txHash,
    isPending,
    isSuccess,
  } = useWriteContract();
  const { data: balanceData } = useBalance({
    address,
    chainId: baseSepolia.id,
  });
  const publicClient = usePublicClient();

  const [link, setLink] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isConfirmed) {
      setStatus('✅ Transaction confirmed! NFT minted successfully.');
    }
  }, [isConfirmed]);

  // ✅ Ensure correct network
  useEffect(() => {
    const ensureBaseSepolia = async () => {
      if (!isConnected || !chainId) return;
      if (chainId !== baseSepolia.id) {
        try {
          await switchChain({ chainId: baseSepolia.id });
          console.log('✅ Switched to Base Sepolia');
        } catch (err) {
          console.error('Failed to switch chain:', err);
          setStatus('⚠️ Please switch to Base Sepolia in MetaMask.');
        }
      }
    };
    ensureBaseSepolia();
  }, [isConnected, chainId, switchChain]);

  // ✅ Manual balance check
  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !publicClient) return;
      const balance = await publicClient.getBalance({ address });
      console.log('Manual Balance:', formatEther(balance));
    };
    fetchBalance();
  }, [address, publicClient]);

  // ✅ Estimate gas fee
  useEffect(() => {
    const estimateGas = async () => {
      if (!isConnected || !link || !publicClient) return;
      try {
        const data = encodeFunctionData({
          abi: contractABI,
          functionName: 'mint',
          args: [link],
        });

        const gas = await publicClient.estimateGas({
          account: address as `0x${string}`,
          to: CONTRACT_ADDRESS,
          data,
        });

        const gasPrice = await publicClient.getGasPrice();
        const totalFeeEth = formatEther(gas * gasPrice);
        setGasEstimate(totalFeeEth);
      } catch (error) {
        console.error('Gas estimation error:', error);
        setGasEstimate(null);
      }
    };
    estimateGas();
  }, [isConnected, link, address, publicClient]);

  // ✅ Mint NFT
  const handleMint = async () => {
    if (!isConnected) {
      setStatus('⚠️ Please connect your MetaMask wallet first.');
      return;
    }

    if (chainId !== baseSepolia.id) {
      setStatus(
        `⚠️ You are on chainId: ${chainId}. Please switch to Base Sepolia.`
      );
      try {
        await switchChain({ chainId: baseSepolia.id });
        setStatus('✅ Switched to Base Sepolia, you can mint now!');
      } catch (err) {
        console.error('Network switch failed:', err);
        setStatus(
          '❌ Automatic switch failed. Please switch manually to Base Sepolia in MetaMask.'
        );
      }
      return;
    }

    try {
      const tx = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'mint',
        args: [link],
        chainId: baseSepolia.id,
      });

      console.log('TX Result:', tx);
      setStatus('✅ NFT minted successfully!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Error while minting NFT.');
    }
  };

  return (
    <div className='p-4'>
      {!isConnected ? (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          className='bg-blue-600 text-white px-4 py-2 rounded-md'
        >
          Connect MetaMask
        </button>
      ) : (
        <>
          <button
            onClick={() => disconnect()}
            className='bg-red-600 text-white px-3 py-1 rounded-md mb-2'
          >
            Disconnect
          </button>

          <p className='text-sm text-gray-400'>
            ✅ Connected: {address}
            <br />
            🌐 Chain: {chainId}
          </p>
        </>
      )}

      {balanceData && (
        <p className='text-sm text-gray-400 mt-2'>
          💰 Balance: {parseFloat(formatEther(balanceData.value)).toFixed(4)}{' '}
          ETH
        </p>
      )}

      {gasEstimate && (
        <p className='text-sm text-gray-400'>
          ⛽ Estimated Fee: {parseFloat(gasEstimate).toFixed(6)} ETH
        </p>
      )}

      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder='Enter Arweave Link'
        className='border p-2 w-full rounded-md mt-3'
      />

      <button
        onClick={handleMint}
        disabled={isPending}
        className='bg-green-600 text-white px-4 py-2 rounded-md mt-3'
      >
        {isPending ? 'Minting...' : 'Mint NFT'}
      </button>

      {status && (
        <p className='mt-4 text-sm text-gray-200 whitespace-pre-line'>
          {status}
        </p>
      )}
      {isSuccess && <p className='mt-2 text-green-600'>Minted!</p>}

      {/* ✅ Show txHash when available */}
      {txHash && (
        <p className='mt-2 text-sm text-blue-400'>
          🔗 Tx Hash:{' '}
          <a
            href={`https://sepolia.basescan.org/tx/${txHash}`}
            target='_blank'
            rel='noopener noreferrer'
            className='underline'
          >
            View on BaseScan
          </a>
        </p>
      )}
    </div>
  );
}
