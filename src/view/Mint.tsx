import { Box } from '../components/Box';
import Loader from './Loader';
import type { MinterProps } from '../types';
import Minter from '../components/Minter';
// import Minter2 from '../components/Minter2';

export default function Mint({
  renderThemePreview,
  ipfsTaskId,
  loading,
}: MinterProps) {
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
                <Minter ipfsTaskId={ipfsTaskId} />
              </Box>
            </Box>
            {/* <Minter2 /> */}
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
