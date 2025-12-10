import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { useAccount, useConnect, useReconnect } from 'wagmi';

const client = createPublicClient({
  chain: base,
  transport: http(),
});

const MintComponent = () => {
  const [bal, setBal] = useState<bigint | null>(null);

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
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Farcaster Wallet Test Flow</h2>
      <p>Status: {status}</p>
      <p>Balance: {bal !== null ? bal.toString() : 'N/A'}</p>

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
