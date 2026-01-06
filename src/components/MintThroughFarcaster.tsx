import { useEffect, useState } from 'react';
import {
  createPublicClient,
  encodeFunctionData,
  formatEther,
  // formatUnits,
  http,
  parseUnits,
  // type Abi,
  // type Address,
} from 'viem';
import { baseSepolia } from 'viem/chains';
import {
  useAccount,
  useConnect,
  useReconnect,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// const USDC_BASE_SEPOLIA_ADDRESS: Address =
//   // '0x833589fCD6eDbB0E46F4dAdC5266c29F6A0aeBAb';
//   '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
// const USDC_DECIMALS = 6;

// const ERC20_ABI: Abi = [
//   {
//     inputs: [{ name: '_owner', type: 'address' }],
//     name: 'balanceOf',
//     outputs: [{ name: 'balance', type: 'uint256' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
// ] as const;

const MintComponent = () => {
  const [bal, setBal] = useState<bigint | null>(null);
  // const [usdcBal, setUsdcBal] = useState<bigint | null>(null);
  // const [usdcFormatted, setUsdcFormatted] = useState<string>('');

  const { isConnected, address, status } = useAccount();
  const { connect, connectors } = useConnect();
  const { reconnect } = useReconnect();
  // const { sendCalls } = useSendCalls({
  //   mutation: {
  //     onSuccess(data) {
  //       console.log('Wallet finished approval!', data);
  //     },
  //     onError(error) {
  //       console.error('Approval failed:', error);
  //     },
  //   },
  // });

  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  useEffect(() => {
    reconnect();
    if (!isConnected && connectors.length > 0) {
      console.log('Attempting to connect...');
      connect({ connector: connectors[0] });
    }
  }, [isConnected, connect, connectors, reconnect]);

  console.log('MintComponent - isConnected:', isConnected);
  console.log('MintComponent - connectors:', connectors);
  console.log('address:', address);

  const handleFlow = async () => {
    connect({ connector: connectors[0] });
    if (!address) {
      console.log('No wallet connected');
      return;
    }
    const bal = await client.getBalance({ address: address! });
    console.log('bal', bal);
    setBal(bal);

    // try {
    //   const usdcBalance = await client.readContract({
    //     address: USDC_BASE_SEPOLIA_ADDRESS,
    //     abi: ERC20_ABI,
    //     functionName: 'balanceOf',
    //     args: [address], // The wallet address whose balance you want
    //   });

    //   console.log('USDC bal (raw)', usdcBalance);
    //   setUsdcBal(usdcBalance as bigint); // Cast to bigint for type consistency
    //   setUsdcFormatted(formatUnits(usdcBalance as bigint, USDC_DECIMALS));
    // } catch (error) {
    //   console.error('Error fetching USDC balance:', error);
    //   setUsdcFormatted('Error');
    // }
  };

  const USDC_CONTRACT_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
  const WETH_CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000006'; // Base Sepolia WETH
  const UNISWAP_ROUTER_ADDRESS = '0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4'; // Uniswap V3 SwapRouter02 on Base Sepolia

  // Amount to approve/swap (5 USDC)
  const AMOUNT_TO_SWAP_RAW = parseUnits('5', 6);
  // const SLIPPAGE = 0.005;
  const SWAP_FEE = 3000;

  const MIN_ETH_OUT_RAW = parseUnits('0.004', 18); // Replace with a calculated value!

  const erc20Abi = [
    {
      constant: false,
      inputs: [
        { name: '_spender', type: 'address' },
        { name: '_value', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ name: '', type: 'bool' }],
      type: 'function',
    },
  ] as const;

  const swapRouterAbi = [
    {
      inputs: [
        {
          components: [
            { internalType: 'address', name: 'tokenIn', type: 'address' },
            { internalType: 'address', name: 'tokenOut', type: 'address' },
            { internalType: 'uint24', name: 'fee', type: 'uint24' },
            { internalType: 'address', name: 'recipient', type: 'address' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' },
            { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
            {
              internalType: 'uint256',
              name: 'amountOutMinimum',
              type: 'uint256',
            },
            {
              internalType: 'uint160',
              name: 'sqrtPriceLimitX96',
              type: 'uint160',
            },
          ],
          internalType: 'struct ISwapRouter.ExactInputSingleParams',
          name: 'params',
          type: 'tuple',
        },
      ],
      name: 'exactInputSingle',
      outputs: [
        { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'amountMinimum', type: 'uint256' },
        { internalType: 'address', name: 'recipient', type: 'address' },
      ],
      name: 'unwrapWETH9',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes[]', name: 'data', type: 'bytes[]' }],
      name: 'multicall',
      outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }],
      stateMutability: 'payable',
      type: 'function',
    },
  ] as const;

  // Wait for the transaction receipt

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleApproveAndSwap = async () => {
    // 1. Get a deadline (e.g., 10 minutes from now)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
    if (!address) {
      console.error('No address available - please connect your wallet');
      return;
    }
    // try {
    //   sendCalls({
    //     calls: [
    //       // --- 1. APPROVE USDC ---
    //       // {
    //       //   to: USDC_CONTRACT_ADDRESS,
    //       //   data: encodeFunctionData({
    //       //     // Use your imported ERC20 ABI (erc20Abi)
    //       //     abi: erc20Abi,
    //       //     functionName: 'approve',
    //       //     args: [
    //       //       // The Router is the spender that gets approved to move the USDC
    //       //       UNISWAP_ROUTER_ADDRESS,
    //       //       // Approve the exact amount we want to swap
    //       //       AMOUNT_TO_SWAP_RAW,
    //       //     ],
    //       //   }),
    //       // },
    //       // --- 2. SWAP USDC for ETH ---
    //       {
    //         to: UNISWAP_ROUTER_ADDRESS,
    //         data: encodeFunctionData({
    //           abi: swapRouterAbi, // Use the V3 SwapRouter ABI
    //           functionName: 'exactInputSingle',
    //           args: [
    //             {
    //               tokenIn: USDC_CONTRACT_ADDRESS,
    //               tokenOut: WETH_CONTRACT_ADDRESS,
    //               fee: SWAP_FEE,
    //               // Use the user's address to receive the ETH
    //               recipient: UNISWAP_ROUTER_ADDRESS,
    //               deadline: BigInt(deadline),
    //               amountIn: AMOUNT_TO_SWAP_RAW,
    //               amountOutMinimum: MIN_ETH_OUT_RAW,
    //               sqrtPriceLimitX96: 0n, // 0n means no limit
    //             },
    //           ],
    //         }),
    //       },
    //     ],
    //   });
    // } catch (err) {
    //   console.error('Approve transaction failed:', err);
    // }

    const approveData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [UNISWAP_ROUTER_ADDRESS, AMOUNT_TO_SWAP_RAW],
    });

    // Encode the swap call (outputs WETH to the router for unwrapping)
    const swapData = encodeFunctionData({
      abi: swapRouterAbi,
      functionName: 'exactInputSingle',
      args: [
        {
          tokenIn: USDC_CONTRACT_ADDRESS,
          tokenOut: WETH_CONTRACT_ADDRESS,
          fee: SWAP_FEE,
          recipient: UNISWAP_ROUTER_ADDRESS, // Send WETH to router for unwrapping
          deadline: BigInt(deadline),
          amountIn: AMOUNT_TO_SWAP_RAW,
          amountOutMinimum: MIN_ETH_OUT_RAW,
          sqrtPriceLimitX96: 0n,
        },
      ],
    });

    // Encode the unwrap call (unwrap WETH to native ETH, sent to user)
    const unwrapData = encodeFunctionData({
      abi: swapRouterAbi,
      functionName: 'unwrapWETH9',
      args: [0n, address], // amountMinimum: 0 (accept any), recipient: user
    });

    // Batch via multicall
    const multicallData = [approveData, swapData, unwrapData];

    try {
      writeContract({
        address: UNISWAP_ROUTER_ADDRESS,
        abi: swapRouterAbi,
        functionName: 'multicall',
        args: [multicallData],
      });
    } catch (err) {
      console.error('Multicall failed:', err);
    }
  };
  console.log('IsConfirmed:', isConfirmed);

  return (
    <div style={{ padding: 20 }}>
      <h2>Farcaster Wallet Test Flow</h2>
      <p>Status: {status}</p>
      <p>ETH Balance: **{bal !== null ? formatEther(bal) : 'N/A'}**</p>
      <p>TX Hash: {txHash || 'None'}</p>
      {isPending && <p>Transaction pending...</p>}
      {error && <p>Error: {error.message}</p>}

      <button
        onClick={handleFlow}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginTop: '10px',
          border: '2px solid black',
        }}
      >
        Start Test
      </button>
      <button
        onClick={handleApproveAndSwap}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginTop: '10px',
          border: '2px solid black',
        }}
      >
        Approve and Swap
      </button>
    </div>
  );
};

export default MintComponent;
