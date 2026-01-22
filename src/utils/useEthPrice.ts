import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'wagmi/chains';
import { chainLinkAbi } from '../abi/ChainLink';

const ethMainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const CHAINLINK_ETH_USD_FEED = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';

export function useEthPrice() {
  const [currentEthPrice, setCurrentEthPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const result = await ethMainnetClient.readContract({
          address: CHAINLINK_ETH_USD_FEED,
          abi: chainLinkAbi,
          functionName: 'latestRoundData',
        });
        const ethPriceInUsd = Number((result as bigint[])[1]);
        setCurrentEthPrice(ethPriceInUsd / 1e8);
      } catch (error) {
        console.error('Failed to fetch ETH price from Chainlink:', error);
      }
    };
    fetchPrice();
  }, []);

  return currentEthPrice;
}
