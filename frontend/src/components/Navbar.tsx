import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Stroški.si
        </Typography>
        
        <Button color="inherit" component={Link} to="/">
          Domov
        </Button>
        
        <Button color="inherit" component={Link} to="/dodaj-strosek">
          Dodaj strošek
        </Button>
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
