import { useEffect, useRef, useState } from 'react';
import { Box } from '../components/Box';
import {
  CrossmintCheckoutProvider,
  CrossmintHostedCheckout,
  useCrossmintCheckout,
} from '@crossmint/client-sdk-react-ui';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import type { MinterProps } from '../types';

export default function Minter({
  renderThemePreview,
  deploymentTaskId,
  loading,
}: MinterProps) {
  const crossmintBtnRef = useRef<HTMLDivElement>(null);

  return (
    <Box className="min-h-[calc(100vh-152px)] flex bg-[url('/LandingBackground.png')] bg-repeat-round w-full relative">
      {loading ? (
        <Loader />
      ) : (
        <Box className='flex direction-row-column w-[90%] mx-auto'>
          <Box className='flex-1 flex flex-col justify-center md:w-[50%]'>
            <Box className='mb-8'>
              <h1 className='h1-text font-bold tracking-tight text-[#23343A]'>
                Your Link is{' '}
                <span
                  className='font-normal h1-text'
                  style={{ fontFamily: 'Nib_Pro' }}
                >
                  Ready
                </span>
                ! 🎉
              </h1>
              <p className='md:text-[24px] text-[#23343A] mt-2'>
                To activate and make your link live forever,
                <br /> complete your payment now.
              </p>
            </Box>
            <Box className='flex items-center h-12 md:h-16 mt-4 bg-white shadow rounded-lg my-6 overflow-hidden w-full md:w-[60%] sm:w-[65%]'>
              <Box className='flex items-center justify-center border-r border-[#EBEBEB] h-full px-4'>
                <img
                  src={'/ChainIcon.svg'}
                  alt='Chain Icon'
                  width={26}
                  height={26}
                />
              </Box>
              <Box className='flex-grow overflow-hidden px-2'>
                <span className='block text-ellipsis whitespace-nowrap overflow-hidden blur-sm select-none text-[#23343A]'>
                  https://www.everlink.com/l5TzftrtkA_Nbc1uukUteXLSIgQhcFNZP-Hb4pJBtdg
                </span>
              </Box>
              <Box className='mx-2 my-1'>
                <Box className='relative bg-[#1ab4a3] rounded-lg'>
                  <span
                    className='block cursor-pointer font-extrabold text-center text-white px-6 py-3'
                    onClick={() => {
                      const btn =
                        crossmintBtnRef.current?.querySelector('button');
                      if (btn) btn.click();
                    }}
                  >
                    Mint
                  </span>
                  <Box
                    ref={crossmintBtnRef}
                    className='opacity-0 absolute pointer-events-none w-0 h-0'
                  >
                    <CrossmintCheckoutProvider>
                      <CheckoutWithCallbacks
                        deploymentTaskId={deploymentTaskId}
                      />
                    </CrossmintCheckoutProvider>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className='flex-1 flex justify-center items-center md:w-[50%]'>
            <Box className='render-theme-minter mb-4 flex md:ml-auto'>
              {renderThemePreview()}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

function CheckoutWithCallbacks({ deploymentTaskId }: any) {
  const [showCheckout, setShowCheckout] = useState(true);
  const collectionId = import.meta.env.VITE_CROSSMINT_COLLECTION_ID as string;
  const { order } = useCrossmintCheckout();
  const navigate = useNavigate();

  useEffect(() => {
    if (order && order.phase === 'completed') {
      navigate(
        `${import.meta.env.VITE_FRONTEND_BASE_URL}/success/${deploymentTaskId}`
      );
      setTimeout(() => {
        setShowCheckout(false);
      }, 2000);
    }

    if (order && order.lineItems) {
      const hasFailedItems = order.lineItems.some(
        (item) => item.delivery?.status === 'failed'
      );

      if (hasFailedItems) {
        navigate(`${import.meta.env.VITE_FRONTEND_BASE_URL}/failure`);
      }
    }
  }, [order, navigate, deploymentTaskId]);

  if (!showCheckout) {
    return <div>Payment successful! Thank you for your purchase.</div>;
  }

  return (
    <CrossmintHostedCheckout
      lineItems={{
        collectionLocator: `crossmint:${collectionId}`,
        callData: {
          totalPrice: '0.001',
          quantity: 1,
        },
      }}
      payment={{
        crypto: { enabled: true },
        fiat: { enabled: true },
      }}
      className='xmint-btn'
      appearance={{
        display: 'popup',
        overlay: { enabled: false },
      }}
    />
  );
}
