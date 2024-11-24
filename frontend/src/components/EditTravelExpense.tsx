import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Grid, Paper } from '@mui/material';
import { IExpense } from '../models/expenses';
import { useParams, useNavigate } from 'react-router-dom';

const EditTravelExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expense, setExpense] = useState({
    id: '',
    datum_odhoda: '',
    datum_prihoda: '',
    kilometrina: 0,
    lokacija: '',
    opis: '',
    oseba: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load expense data on component mount
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

    fetchExpense();
  }, [id]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpense({
      ...expense,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for updating the expense
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await axios.put(`http://localhost:9000/strosek/${id}`, expense);
      setSuccessMessage('Strošek je bil uspešno posodobljen!');
      console.log('Expense updated:', response.data);
    } catch (error) {
      setErrorMessage('Prišlo je do napake pri posodabljanju stroška.');
      console.error('Update error:', error);
    }
  };

  return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Uredi strošek
          </Typography>

          {successMessage && (
              <Typography variant="body1" color="primary" gutterBottom align="center">
                {successMessage}
              </Typography>
          )}

          {errorMessage && (
              <Typography variant="body1" color="error" gutterBottom align="center">
                {errorMessage}
              </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                    label="Datum odhoda"
                    name="datum_odhoda"
                    type="date"
                    value={expense.datum_odhoda}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                    label="Datum prihoda"
                    name="datum_prihoda"
                    type="date"
                    value={expense.datum_prihoda}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                    label="Kilometrina"
                    name="kilometrina"
                    type="number"
                    value={expense.kilometrina}
                    onChange={handleChange}
                    fullWidth
                    required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                    label="Lokacija"
                    name="lokacija"
                    value={expense.lokacija}
                    onChange={handleChange}
                    fullWidth
                    required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                    label="Opis"
                    name="opis"
                    value={expense.opis}
                    onChange={handleChange}
                    fullWidth
                    required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                    label="Oseba (email)"
                    name="oseba"
                    value={expense.oseba}
                    onChange={handleChange}
                    fullWidth
                    required
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Posodobi strošek
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => navigate('/')}
                >
                  Nazaj na domačo stran
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
  );
};

export default EditTravelExpense;
