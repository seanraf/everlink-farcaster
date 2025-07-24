import { useAuth } from '@crossmint/client-sdk-react-ui';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import LogoutIcon from '@mui/icons-material/PowerSettingsNew';

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
    m: 'auto',
  },
  Box: {
    display: 'flex',
    gap: '7px',
  },
  typography: {
    my: 'auto',
    fontSize: '21px',
    fontFamily: 'Brolink Demo, sans-serif',
  },
};
export default function NavBar() {
  const { user, logout } = useAuth();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={styles.mainContainer}>
      <Box sx={styles.innerContainer}>
        <Box sx={styles.Box}>
          <img src="/Frame.svg" alt="Nav Icon" height={28} width={28} />
          <Typography sx={styles.typography}>EVERLINK</Typography>
        </Box>

        {user ? (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='User Profile'>
              <IconButton onMouseEnter={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt='User profile' src={user?.farcaster?.pfpUrl} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{
                mt: '45px',

                '.MuiMenuItem-root': {
                  paddingLeft: '32px',
                  paddingRight: '32px',
                },
              }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box>
                    <Avatar alt='User Profile' src={user?.farcaster?.pfpUrl} />
                  </Box>
                  <Box sx={{ '& .MuiTypography-root': { fontSize: '13px' } }}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      {user?.farcaster?.displayName}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 400,
                        color: '#6F6C90',
                      }}
                    >
                      {user?.farcaster?.username}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <Divider variant='middle' />
              <MenuItem onClick={handleCloseUserMenu}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    onClick={logout}
                    sx={{
                      color: '#6F6C8F',
                      '&:hover': {
                        backgroundColor: 'inherit',
                        boxShadow: 'none',
                      },
                    }}
                    startIcon={<LogoutIcon />}
                  >
                    Logout
                  </Button>
                </Box>
              </MenuItem>
            </Menu>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
