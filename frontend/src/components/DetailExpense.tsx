import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Button } from '@mui/material';
import { IExpense } from '../models/expenses';
import { useParams, useNavigate } from 'react-router-dom';

const DetailExpense: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [expense, setExpense] = useState<IExpense | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/strosek/${id}`);
                setExpense(response.data);
            } catch (error) {
                setErrorMessage('Error fetching expense data.');
                console.error('Fetch error:', error);
            }
        };

        if (id) { 
            fetchExpense();
        }
    }, [id]);

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" gutterBottom>
                Podrobnosti stroškov
            </Typography>

            {errorMessage ? (
                <Typography variant="body1" color="error">
                    {errorMessage}
                </Typography>
            ) : expense ? (
                <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                    <Typography variant="h6">ID: {expense.id}</Typography>
                    <Typography>Datum odhoda: {expense.datum_odhoda}</Typography>
                    <Typography>Datum prihoda: {expense.datum_prihoda}</Typography>
                    <Typography>Kilometrina: {expense.kilometrina} km</Typography>
                    <Typography>Lokacija: {expense.lokacija}</Typography>
                    <Typography>Opis: {expense.opis}</Typography>
                    <Typography>Oseba (email): {expense.oseba}</Typography>
                </Paper>
            ) : (
                <Typography variant="body1" color="textSecondary">
                    Nalaganje podrobnosti stroška...
                </Typography>
            )}

            <Button
                variant="outlined"
                color="primary"
                onClick={handleBackToHome}
                sx={{ marginTop: 3 }}
            >
                Nazaj na domačo stran
            </Button>
        </Container>
    );
};

export default DetailExpense;
