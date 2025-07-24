import { useEffect } from 'react';
import FrameSDK from '@farcaster/frame-sdk';

function FarcasterFrameProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const load = async () => {
      FrameSDK.actions.ready();
    };
    load();
  }, []);
  return <>{children}</>;
}

export default FarcasterFrameProvider;
