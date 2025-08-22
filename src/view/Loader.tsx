import { Box } from '../components/Box';

export default function Loader() {
  return (
    <Box className='bg-white h-[calc(100vh-153px)] w-full flex absolute'>
      <Box className='m-auto'>
        <img
          src={'/loader.gif'}
          alt='Loader'
          width={60}
          height={60}
          style={{ marginBottom: '70px' }}
        />
      </Box>
    </Box>
  );
}
