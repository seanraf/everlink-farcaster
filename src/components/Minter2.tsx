'use client';
import { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useBalance,
  usePublicClient,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { Box } from './Box';
import { baseSepolia } from 'wagmi/chains';
import { sdk } from '@farcaster/miniapp-sdk';
import miniAppSdk from '@farcaster/miniapp-sdk';
import * as Dialog from '@radix-ui/react-dialog';
import { useEthPrice } from '../utils/useEthPrice';
import { splitAndMintAbi } from '../abi/splitAndMint';
import { formatEther, parseEther, encodeFunctionData, toHex } from 'viem';

const CONTRACT_ADDRESS = '0x9621473C88f95589aB21408f773555cf8839E26A';

export default function Minter() {
  const [gasFee, setGasFee] = useState<bigint | null>(null);
  const [totalCost, setTotalCost] = useState<bigint | null>(null);
  const [insufficientBalanceOpen, setInsufficientBalanceOpen] = useState(false);
  const [transactionCompleted, setTransactionCompleted] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    chainId: baseSepolia.id,
  });

  const publicClient = usePublicClient({ chainId: baseSepolia.id });
  const currentEthPrice = useEthPrice();

  const mintPriceEth = currentEthPrice
    ? (4 / currentEthPrice).toFixed(6)
    : '0.0015';
  const fiveUsdInEth = currentEthPrice
    ? (5 / currentEthPrice).toFixed(6)
    : '0.0018';

  const [status, setStatus] = useState<string | null>(null);

  // const link = 'https://ar-io.net/Gme9IFaNz-iSL77u5j0CxQJ1rrjXZgaNOIQwDUocU0Y';
  const { data: txHash, isPending } = useWriteContract();

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
      setTransactionCompleted(true);
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
        const mintValue = parseEther(mintPriceEth);

        let estimatedGas;
        try {
          estimatedGas = await publicClient.estimateContractGas({
            address: CONTRACT_ADDRESS,
            abi: splitAndMintAbi,
            functionName: 'mint',
            args: ['Gme9IFaNz-iSL77u5j0CxQJ1rrjXZgaNOIQwDUocU0Y'],
            value: mintValue,
            account: address,
          });
        } catch (estimationError) {
          console.warn(
            'Gas estimation failed, using default estimate:',
            estimationError
          );
          estimatedGas = BigInt(150000);
        }

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

    if (balanceData && totalCost && balanceData.value < totalCost) {
      setInsufficientBalanceOpen(true);
      return;
    }

    try {
      setStatus('⏳ Minting in progress...');
      setTransactionCompleted(false);

      const data = encodeFunctionData({
        abi: splitAndMintAbi,
        functionName: 'mint',
        args: ['Gme9IFaNz-iSL77u5j0CxQJ1rrjXZgaNOIQwDUocU0Y'],
      });

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: address,
            to: CONTRACT_ADDRESS,
            value: toHex(parseEther(mintPriceEth)),
            data,
            chainId: toHex(baseSepolia.id),
          },
        ],
      });

      setStatus(`✅ Mint submitted! Tx: ${txHash}`);
    } catch (err) {
      console.error(err);
      setStatus('❌ Error while minting NFT. Check console for details.');
      setTransactionCompleted(true);
    }
  };

  return (
    <>
      <Box className='relative bg-[#1ab4a3] rounded-lg display:flex justify-center items-center'>
        <span
          className='block cursor-pointer font-extrabold text-center text-white px-6 py-3'
          onClick={handleMint}
        >
          {isPending ? 'Minting' : transactionCompleted ? 'Mint again' : 'Mint'}
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
            <p>5 USD in ETH: {fiveUsdInEth} ETH</p>
            <p>Estimated Gas: {formatEther(gasFee)} ETH</p>
            <p className='font-bold'>
              Total Required: {formatEther(totalCost)} ETH
            </p>
          </div>
        )}
      </Box>

      <Dialog.Root
        open={insufficientBalanceOpen}
        onOpenChange={setInsufficientBalanceOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/50 z-40 display:flex justify-center items-center' />
          <Dialog.Content className='fixed top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 max-w-[90%] z-50 left-0 right-0 mx-auto w-full max-w-md'>
            <div className='flex justify-between items-center mb-4'>
              <Dialog.Title className='text-lg font-bold text-gray-900'>
                Insufficient Balance
              </Dialog.Title>
            </div>
            <Dialog.Description className='text-gray-700 mb-6'>
              You have insufficient balance. To mint an NFT, you need at least{' '}
              <span className='font-bold text-lg'>$5 USD</span> worth of ETH (
              <span className='font-bold'>{fiveUsdInEth} ETH</span>) on Base
              Network.
            </Dialog.Description>
            <p className='text-sm text-gray-600 mb-6 italic'>
              This ETH amount is equivalent to 5 USD at the current market rate.
            </p>
            <div className='mb-6 space-y-3'>
              {balanceData && (
                <p className='text-sm text-gray-600'>
                  Your balance:{' '}
                  <span className='font-bold text-red-600'>
                    {formatEther(balanceData.value)} ETH
                  </span>
                </p>
              )}
              {totalCost && (
                <p className='text-sm text-gray-600'>
                  Required for mint:{' '}
                  <span className='font-bold text-green-600'>
                    {fiveUsdInEth} ETH
                  </span>
                </p>
              )}
              <p className='text-sm text-gray-500'>
                💡 Please add more ETH to your wallet and try again.
              </p>
            </div>
            <Dialog.Close asChild>
              <button className='w-full bg-[#1ab4a3] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#0f9a8b] transition border-none'>
                Close
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
