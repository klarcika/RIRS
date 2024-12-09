import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { Container, Typography } from "@mui/material";

const Logout: React.FC = () => {
    const { logout } = UserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();
                navigate('/');
            } catch (error) {
                console.error('Error during logout:', error);
            }
        };

        performLogout();
    }, [logout, navigate]);

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
          <Typography variant="h4" align="center" gutterBottom>
          Odjava
          </Typography>
        </Container>
    );
}

export default Logout;