import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user } = UserAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Stroški.si
        </Typography>
        
        <Button color="inherit" component={Link} to="/">
          Domov
        </Button>
        
        {!user && (
          <>
            <Button color="inherit" component={Link} to="/login">
              Prijava
            </Button>
            
            <Button color="inherit" component={Link} to="/register">
              Registracija
            </Button>
          </>
        )}

        {user && (
          <>
            <Button color="inherit" component={Link} to="/dodaj-strosek">
              Dodaj strošek
            </Button>

            <Button color="inherit" component={Link} to="/logout">
              Odjava
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
