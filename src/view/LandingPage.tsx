import { useAuth } from '@crossmint/client-sdk-react-ui';
import { Box } from '../components/Box';

export default function LandingPage() {
  const { login, user } = useAuth();

  return (
    <Box className="bg-[url('/LandingBackground.png')] bg-repeat-round min-h-screen flex">
      <Box className='flex flex-col gap-16 mt-auto mb-auto sm:py-24 max-w-7xl mx-auto px-4'>
        <Box className='mx-auto flex flex-col text-center gap-6'>
          <Box className='mx-auto'>
            <img src={'/Frame.svg'} alt='Nav Icon' height={80} width={80} />
          </Box>
          <h1 className='h1-text font-bold leading-none tracking-[-2px] md:tracking-[-3px]'>
            <span
              className='h1-text'
              style={{ fontFamily: 'Nib_Pro', fontWeight: 300 }}
            >
              Own{' '}
            </span>
            Your Calling Card
          </h1>
          <Box className='space-y-2'>
            <p className='md:text-[24px]'>
              Create your personal bio page and publish for one price, forever.
            </p>
            <p className='md:text-[24px]'>No subscriptions. No hidden fees.</p>
          </Box>
          {!user && (
            <button
              className='flex items-center gap-2 w-fit bg-purple border-0 text-white mx-auto rounded-lg px-5 py-2.5 font-medium cursor-pointer'
              onClick={login}
              type='button'
            >
              <img
                src={'/FarcasterLogo.svg'}
                alt='Icon'
                width={25.86}
                height={24}
              />
              Connect with Farcaster
            </button>
          )}
        </Box>
        <Box>
          <img
            src={'/HomeMainImage.svg'}
            alt='Main Image'
            height={640}
            width={1100}
            className='w-full h-auto'
          />
        </Box>
      </Box>
    </Box>
  );
}
