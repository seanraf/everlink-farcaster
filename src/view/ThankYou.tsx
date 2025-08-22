import { useState } from 'react';
import Player from 'lottie-react';
import { Box } from '../components/Box';
import * as Tooltip from '@radix-ui/react-tooltip';
import ShareToFarcaster from '../components/ShareToFarcaster';
import ThankuAnimationData from '../public/ThankuAnimationData.json';

export default function ThankYou({
  customURL,
  loading,
}: {
  customURL: string;
  loading: boolean;
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(customURL || '');
    setTooltipOpen(true);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 1500);
  };
  return (
    <Box className="h-[calc(100vh-152px)] flex justify-center bg-[url('/LandingBackground.png')] bg-repeat-round">
      <Box className='flex flex-col w-[90%] mx-auto my-auto leading-[1.5]'>
        <Box className='text-center relative pt-[50px]'>
          <Box className='absolute top-0 left-0 w-full h-full -z-10 mt-5'>
            <Player
              autoplay
              loop
              animationData={ThankuAnimationData}
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
          </Box>
          <div className='font-bold h1-text md:tracking-[-3px] tracking-[-1px] text-[#23343A]'>
            <span
              style={{ fontFamily: 'Nib_Pro', fontWeight: 300 }}
              className='h1-text'
            >
              ThankYou
            </span>{' '}
            For Your Purchase
          </div>
          <div className='md:text-[24px] text-[#23343A]'>
            Your personalized link page is now hosted forever.
          </div>
          <div className='md:text-[24px] text-[#23343A]'>Share it!</div>
        </Box>
        <Box className='flex mx-auto mt-4 bg-white shadow-md rounded-lg my-3 overflow-hidden items-center link-box-height link-box-width'>
          <Box className='flex items-center justify-center border-r border-[#EBEBEB] h-full px-3 md:px-6 '>
            <img
              src={'/ChainIcon.svg'}
              alt='Chain Icon'
              width={25.94}
              height={25.94}
            />
          </Box>
          <Box className='flex-grow overflow-hidden ml-1'>
            {loading ? (
              <div className='truncate text-[#23343A]'>Loading...</div>
            ) : (
              <div className='truncate text-[#23343A]'>{customURL}</div>
            )}
          </Box>
          <Tooltip.Provider delayDuration={0}>
            <Tooltip.Root open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <Tooltip.Trigger asChild>
                <button
                  className='bg-teal-500 text-white copy-button mr-1.5 border-0 rounded-lg font-semibold hover:bg-teal-600 cursor-pointer transition'
                  onClick={handleCopy}
                  type='button'
                >
                  Copy
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side='top'
                  align='center'
                  className='bg-black text-white px-3 py-1 rounded shadow text-xs select-none'
                >
                  Copied!
                  <Tooltip.Arrow className='fill-black' />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </Box>
        <ShareToFarcaster customURL={customURL} />
      </Box>
    </Box>
  );
}
