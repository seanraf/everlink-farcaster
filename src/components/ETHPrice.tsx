// import { useEffect, useState } from 'react';
// import { Box } from './Box';
// import { usePublicClient } from 'wagmi';
// import { chainlinkAbi } from '../abi/ChainLink';

// export default function ETHPrice() {
//   const [ethPrice, setEthPrice] = useState<number | null>(null);
//   const publicClient = usePublicClient();

//   const ETH_USD_FEED = '0x71041DdDaD3595F9CEd3DcCFBe3D1F4b0A16Bb70';
//   const ETH_USD_FEED = '0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1';

//   const getEthPrice = async () => {
//     if (!publicClient) return;

//     const [, price]: any = await publicClient.readContract({
//       address: ETH_USD_FEED,
//       abi: chainlinkAbi,
//       functionName: 'latestRoundData',
//     });
//     return Number(price) / 1e8;
//   };

//   useEffect(() => {
//     const fetchPrice = async () => {
//       const price = await getEthPrice();
//       setEthPrice(price || null);
//     };
//     fetchPrice();
//   }, []);
//   return <Box>ETH Price (~${ethPrice})</Box>;
// }

'use client';

import { useEffect, useState } from 'react';
import { Box } from './Box';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'wagmi/chains';
import { chainlinkAbi } from '../abi/ChainLink';

const basePublicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const ETH_USD_FEED = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';

export default function ETHPrice() {
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const result = await basePublicClient.readContract({
          address: ETH_USD_FEED,
          abi: chainlinkAbi,
          functionName: 'latestRoundData',
        });
        console.log('Chainlink ETH Price Result:', result);
        const price = Number((result as bigint[])[1]);
        setEthPrice(price / 1e8);
      } catch (err) {
        console.error('ETH price fetch failed:', err);
      }
    };

    fetchPrice();
  }, []);

  return (
    <Box>
      {ethPrice
        ? `ETH Price (~$${ethPrice.toFixed(2)})`
        : 'Loading ETH price...'}
    </Box>
  );
}
