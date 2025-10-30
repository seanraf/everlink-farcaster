import { Connected } from '@coinbase/onchainkit';
import {
  Transaction,
  TransactionButton,
} from '@coinbase/onchainkit/transaction';
import ConnectMenu from './ConnectMenu';

export default function MintFlow() {
  return (
    <div className='space-y-4'>
      <h1>Mint Your NFT</h1>

      <ConnectMenu />
      <hr />
      <Connected
        connecting={<div>Preparing wallet...</div>}
        fallback={
          <div className='border rounded-lg p-6 text-center'>
            <h2>Connect to get started</h2>
            <p className='text-gray-600 mb-4'>
              You need to connect your wallet to mint an NFT
            </p>
          </div>
        }
      >
        <div className='border rounded-lg p-6'>
          <h2>Ready to mint!</h2>
          <p className='text-gray-600 mb-4'>
            Your wallet is connected. Click below to mint your NFT.
          </p>

          <Transaction
            calls={[
              {
                to: '0xEDA1896bDf3908c2e480492ecfF0491a50D380eD',
                value: BigInt(0.0001 * 1e18),
              },
            ]}
          >
            <TransactionButton text='Mint NFT' />
          </Transaction>
        </div>
      </Connected>
    </div>
  );
}
