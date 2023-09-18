import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/router';
import { useAuth } from 'providers/AuthProvider';
import { Menu, MenuItem } from '@mui/material';
import Image from 'next/image';
import LogoutIcon from '@mui/icons-material/Logout';

const IncomeAppBar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { user, logout } = useAuth()

  const toggleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(!open)
    setAnchorEl(event.currentTarget);
  }

  return (
      <AppBar position="static" style={{ background: '#00796b', color: '#e0f2f1' }}>
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Image src="/../public/logo.png" height={80} width={130} alt="eligibee-logo"/>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => router.push('/')}>
            Eligibee
          </Typography>
          <Stack direction="row"  >
              {/* {router.pathname != '/' && */}
              <Button sx={{ color: '#e0f2f1' }} onClick={() => router.push('/')}>
                Home
              </Button>
              {/* } */}
              {router.pathname === '/reports' &&
              <Button sx={{ color: '#e0f2f1' }} onClick={() => router.push('/reports/add')}>
                Add New Application
              </Button>
              }
              <Typography component="p" sx={{ padding: 1 }}> 
              Hi, {user.name}
              </Typography>
              <IconButton
                // id="basic-button"
                // aria-controls={open ? 'basic-menu' : undefined}
                // aria-haspopup="true"
                // aria-expanded={open ? 'true' : undefined}
                // onClick={toggleUserMenu}
                onClick={logout}
              >
                <LogoutIcon sx={{ color:'#e0f2f1' }} />
                {/* <PersonIcon sx={{ color:'#e0f2f1' }}/> */}
              </IconButton>
          </Stack>
          {/* <Button color="inherit">Save</Button> */}
        </Toolbar>
        {/* <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setOpen(false)}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem>{user.username}</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu> */}
      </AppBar>
  );
}

export default IncomeAppBar