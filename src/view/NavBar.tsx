import { useAuth } from '@crossmint/client-sdk-react-ui';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';
import { ExitIcon } from '@radix-ui/react-icons';
import { Box } from '../components/Box';

const styles = {
  mainContainer: {
    height: '72px',
    borderBottom: '1px solid #F0F0F0',
    display: 'flex',
    bgcolor: 'primary.contrastText',
  },
  innerContainer: {
    width: '90%',
    display: 'flex',
    justifyContent: 'space-between',
    margin: 'auto',
  },
  Box: {
    display: 'flex',
    gap: '7px',
  },
  typography: {
    marginTop: '4px',
    fontSize: '21px',
    fontFamily: 'Brolink_Demo, sans-serif',
  },
};

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <Box style={styles.mainContainer}>
      <Box style={styles.innerContainer}>
        <Box style={styles.Box}>
          <img src='/Frame.svg' alt='Nav Icon' height={28} width={28} />
          <Box style={styles.typography}>EVERLINK</Box>
        </Box>

        {user ? (
          <Box style={{ flexGrow: 0 }}>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Avatar.Root className='w-8 h-8 rounded-full overflow-hidden'>
                    <Avatar.Image
                      src={user?.farcaster?.pfpUrl}
                      alt='User profile'
                      className='w-full h-full object-cover'
                    />
                    <Avatar.Fallback className='w-full h-full bg-gray-300 flex items-center justify-center'>
                      {user?.farcaster?.displayName?.charAt(0) || 'U'}
                    </Avatar.Fallback>
                  </Avatar.Root>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className='min-w-[220px] bg-white rounded-md p-1 shadow-md border border-gray-200'
                  sideOffset={5}
                  align='end'
                >
                  <DropdownMenu.Item className='flex items-center gap-3 px-3 py-2 text-sm outline-none cursor-default rounded-sm hover:bg-gray-100'>
                    <Avatar.Root className='w-8 h-8 rounded-full overflow-hidden'>
                      <Avatar.Image
                        src={user?.farcaster?.pfpUrl}
                        alt='User Profile'
                        className='w-full h-full object-cover'
                      />
                      <Avatar.Fallback className='w-full h-full bg-gray-300 flex items-center justify-center'>
                        {user?.farcaster?.displayName?.charAt(0) || 'U'}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <Box>
                      <Box className='font-medium text-sm'>
                        {user?.farcaster?.displayName}
                      </Box>
                      <Box className='text-xs text-gray-500'>
                        {user?.farcaster?.username}
                      </Box>
                    </Box>
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className='h-px bg-gray-200 my-1' />

                  <DropdownMenu.Item
                    className='flex items-center gap-2 px-3 py-2 text-sm outline-none cursor-default rounded-sm hover:bg-gray-100 text-gray-600'
                    onClick={logout}
                  >
                    <ExitIcon className='w-4 h-4' />
                    Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
