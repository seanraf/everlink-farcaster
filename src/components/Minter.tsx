'use client';
import { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useBalance,
  usePublicClient,
  useWaitForTransactionReceipt,
} from 'wagmi';
import axios from 'axios';
import { Box } from './Box';
import { baseSepolia } from 'wagmi/chains';
import { sdk } from '@farcaster/miniapp-sdk';
import miniAppSdk from '@farcaster/miniapp-sdk';
import * as Dialog from '@radix-ui/react-dialog';
import { useEthPrice } from '../utils/useEthPrice';
import { splitAndMintAbi } from '../abi/splitAndMint';
import { formatEther, parseEther, encodeFunctionData, toHex } from 'viem';
import Loader from '../view/Loader';

const CONTRACT_ADDRESS = '0x9621473C88f95589aB21408f773555cf8839E26A';

export default function Minter({ ipfsTaskId }: { ipfsTaskId: string }) {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL as string;
  const frontendBaseUrl = import.meta.env.VITE_FRONTEND_BASE_URL as string;

  const [totalCost, setTotalCost] = useState<bigint | null>(null);
  const [insufficientBalanceOpen, setInsufficientBalanceOpen] = useState(false);
  const [transactionCompleted, setTransactionCompleted] = useState(false);
  const [arweaveTransactionId, setArweaveTransactionId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const [deploymentErrorOpen, setDeploymentErrorOpen] = useState(false);
  const [mintTransactionHash, setMintTransactionHash] = useState<string | null>(
    null
  );
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    chainId: baseSepolia.id,
  });
  console.log('IPFS Task ID in Minter:', ipfsTaskId);
  console.log('arweaveTransactionId in Minter:', arweaveTransactionId);
  const publicClient = usePublicClient({ chainId: baseSepolia.id });
  const currentEthPrice = useEthPrice();

  const mintPriceEth = currentEthPrice
    ? (4 / currentEthPrice).toFixed(6)
    : '0.0015';
  const fiveUsdInEth = currentEthPrice
    ? (5 / currentEthPrice).toFixed(6)
    : '0.0018';

  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (status) {
      console.log('Status:', status);
    }
  }, [status]);

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
    const fetchDeploymentData = async () => {
      if (!ipfsTaskId) return;

      try {
        setLoading(true);
        setDeploymentError(null);
        const response = await axios.get(
          `${backendBaseUrl}/api/deploymentHistory/${ipfsTaskId}`
        );
        console.log('Deployment data response:', response.data);
        const deploymentRecords = response.data.records;

        if (deploymentRecords?.arweaveTransactionId) {
          setArweaveTransactionId(deploymentRecords.arweaveTransactionId);
          console.log(
            'Arweave Transaction ID:',
            deploymentRecords.arweaveTransactionId
          );
        } else {
          const errorMsg =
            'No arweave transaction ID found in deployment records.';
          console.error(errorMsg);
          setDeploymentError(errorMsg);
          setDeploymentErrorOpen(true);
        }
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message ||
            error.message ||
            'Failed to fetch deployment data'
          : 'An unexpected error occurred while fetching deployment data';
        console.error('Error retrieving deployment data:', error);
        setDeploymentError(errorMessage);
        setDeploymentErrorOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDeploymentData();
  }, [ipfsTaskId, backendBaseUrl]);

  useEffect(() => {
    if (isConfirmed) {
      setStatus('✅ Transaction confirmed! NFT minted successfully.');
      setTransactionCompleted(true);

      const saveTransactionToDb = async () => {
        if (!mintTransactionHash || !ipfsTaskId) return;

        try {
          // await axios.put(
          //   `${backendBaseUrl}/api/deploymentHistory/${ipfsTaskId}`,
          //   {
          //     txHash: mintTransactionHash,
          //   }
          // );
          console.log('Transaction hash saved to database successfully');

          const successUrl = `${frontendBaseUrl}/success/${ipfsTaskId}`;
          console.log('Navigating to:', successUrl);

          setTimeout(() => {
            window.location.href = successUrl;
          }, 2000);
        } catch (error) {
          console.error('Error saving transaction hash to database:', error);
          setStatus(
            '✅ NFT minted but failed to save transaction data. Please contact support.'
          );
        }
      };

      saveTransactionToDb();
    }
  }, [
    isConfirmed,
    mintTransactionHash,
    ipfsTaskId,
    backendBaseUrl,
    frontendBaseUrl,
  ]);

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
            args: [
              arweaveTransactionId ||
                'Gme9IFaNz-iSL77u5j0CxQJ1rrjXZgaNOIQwDUocU0Y',
            ],
            value: mintValue,
            account: address,
          });
        } catch (estimationError) {
          console.warn('Gas estimation failed:', estimationError);
          estimatedGas = BigInt(150000);
        }

        const gasPrice = await publicClient.getGasPrice();

        const estimatedGasFee = estimatedGas * gasPrice;
        const total = mintValue + estimatedGasFee;

        setTotalCost(total);
      } catch (error) {
        console.error('Gas estimation failed:', error);
      }
    };

    calculateCost();
  }, [publicClient, address, arweaveTransactionId, mintPriceEth]);

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

      if (!arweaveTransactionId) {
        setStatus('⚠️ Loading deployment data... Please wait.');
        return;
      }

      const data = encodeFunctionData({
        abi: splitAndMintAbi,
        functionName: 'mint',
        args: [arweaveTransactionId],
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

      setMintTransactionHash(txHash);
      setStatus(`✅ Mint submitted! Tx: ${txHash}`);
    } catch (err) {
      console.error(err);
      setStatus('❌ Error while minting NFT. Check console for details.');
      setTransactionCompleted(true);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box className='relative bg-[#1ab4a3] rounded-lg display:flex justify-center items-center'>
          <span
            className='block cursor-pointer font-extrabold text-center text-white px-6 py-3'
            onClick={handleMint}
          >
            {isPending
              ? 'Minting'
              : transactionCompleted
                ? 'Mint again'
                : 'Mint'}
          </span>
        </Box>
      )}

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

      <Dialog.Root
        open={deploymentErrorOpen}
        onOpenChange={setDeploymentErrorOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 bg-black/50 z-40 display:flex justify-center items-center' />
          <Dialog.Content className='fixed top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 max-w-[90%] z-50 left-0 right-0 mx-auto w-full max-w-md'>
            <div className='flex justify-between items-center mb-4'>
              <Dialog.Title className='text-lg font-bold text-red-600'>
                ❌ Deployment Data Error
              </Dialog.Title>
            </div>
            <Dialog.Description className='text-gray-700 mb-6'>
              We encountered an issue loading your deployment data:
            </Dialog.Description>
            <div className='mb-6 p-4 bg-red-50 rounded border border-red-200'>
              <p className='text-sm text-red-700'>{deploymentError}</p>
            </div>
            <p className='text-sm text-gray-600 mb-6'>
              Please try refreshing the page or contact support if the problem
              persists.
            </p>
            <Dialog.Close asChild>
              <button className='w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition border-none'>
                Close
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
