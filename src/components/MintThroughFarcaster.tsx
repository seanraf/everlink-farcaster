import { useEffect, useState } from 'react';
import {
  createPublicClient,
  formatEther,
  formatUnits,
  http,
  type Abi,
  type Address,
} from 'viem';
import { base } from 'viem/chains';
import { useAccount, useConnect, useReconnect } from 'wagmi';

const client = createPublicClient({
  chain: base,
  transport: http(),
});

const USDC_BASE_SEPOLIA_ADDRESS: Address =
  // '0x833589fCD6eDbB0E46F4dAdC5266c29F6A0aeBAb';
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_DECIMALS = 6;

const ERC20_ABI: Abi = [
  {
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const MintComponent = () => {
  const [bal, setBal] = useState<bigint | null>(null);
  const [usdcBal, setUsdcBal] = useState<bigint | null>(null);
  const [usdcFormatted, setUsdcFormatted] = useState<string>('');

  const { isConnected, address, status } = useAccount();
  const { connect, connectors } = useConnect();
  const { reconnect } = useReconnect();

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

    try {
      const usdcBalance = await client.readContract({
        address: USDC_BASE_SEPOLIA_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address], // The wallet address whose balance you want
      });

      console.log('USDC bal (raw)', usdcBalance);
      setUsdcBal(usdcBalance as bigint); // Cast to bigint for type consistency
      setUsdcFormatted(formatUnits(usdcBalance as bigint, USDC_DECIMALS));
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
      setUsdcFormatted('Error');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Farcaster Wallet Test Flow</h2>
      <p>Status: {status}</p>
      <p>ETH Balance: **{bal !== null ? formatEther(bal) : 'N/A'}**</p>
      <p>USDC Balance: **{usdcFormatted}**</p>
      <p>USDC {usdcBal}</p>

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
    </div>
  );
};

export default MintComponent;
