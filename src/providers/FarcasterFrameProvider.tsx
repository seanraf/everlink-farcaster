import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

function FarcasterFrameProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const load = async () => {
      await sdk.actions.ready();
    };
    load();
  }, []);
  return <>{children}</>;
}

export default FarcasterFrameProvider;
