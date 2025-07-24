import { useWallet } from '@crossmint/client-sdk-react-ui';

export default function Wallet() {
  const { wallet, status } = useWallet();

  return (
    <div>
      {status === 'in-progress' && (
        <div className='border-2 border-yellow-500 text-yellow-500 font-bold py-4 px-8 rounded-lg'>
          Loading...
        </div>
      )}
      {status === 'loaded' && wallet && (
        <div className='border-2 border-green-500 text-green-500 font-bold py-4 px-8 rounded-lg'>
          Wallet: {wallet.address}
        </div>
      )}
      {status === 'not-loaded' && (
        <div className='border-2 border-gray-500 text-gray-500 font-bold py-4 px-8 rounded-lg'>
          Wallet not loaded
        </div>
      )}
    </div>
  );
}
