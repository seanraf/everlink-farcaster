import { useAccount, useConnect } from 'wagmi';

export default function ConnectMenu() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  console.log({ isConnected, address });
  if (isConnected) {
    return (
      <>
        <div>You're connected!</div>
        <div>Address: {address}</div>
      </>
    );
  }

  return (
    <button
      type='button'
      style={{ border: '2px solid black' }}
      onClick={() => connect({ connector: connectors[0] })}
    >
      Connect
    </button>
  );
}
