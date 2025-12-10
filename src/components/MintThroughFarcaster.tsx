import React, { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

const MintComponent: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (!isConnected && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  }, [isConnected, connect, connectors]);

  console.log('MintComponent - isConnected:', isConnected);
  console.log('MintComponent - connectors:', connectors);
  console.log('address:', address);

  const handleFlow = async () => {};

  return (
    <div style={{ padding: 20 }}>
      <h2>Farcaster Wallet Test Flow</h2>
      <p>Status: {status}</p>

      <button
        onClick={handleFlow}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginTop: '10px',
        }}
      >
        Start Test
      </button>
    </div>
  );
};

export default MintComponent;
