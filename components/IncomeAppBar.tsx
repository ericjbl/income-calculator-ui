import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';

const IncomeAppBar = () => {
  const router = useRouter()

  return (
      <AppBar position="static" style={{ background: '#bdbdbd', color: 'black' }}>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Income Calculator App
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }} >
              {router.pathname != '/' &&
              <Button sx={{ color: '#000' }} onClick={() => router.push('/')}>
                Report
              </Button>}
              {router.pathname != '/reports/add' &&
              <Button sx={{ color: '#000' }} onClick={() => router.push('/reports/add')}>
                Add New Application
              </Button>
              }
          </Box>
          {/* <Button color="inherit">Save</Button> */}
        </Toolbar>
      </AppBar>
  );
}

export default IncomeAppBar