import React, { useState } from "react";
import axios from "axios";

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { IAddExpense } from "../models/addExpenses";

const CreateExpenseComponent: React.FC = () => {
  const [expense, setExpense] = useState<IAddExpense>({
    id: "",
    naziv: "",
    datum_odhoda: "",
    datum_prihoda: "",
    kilometrina: 0,
    lokacija: "",
    opis: "",
    oseba: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpense({
      ...expense,
      [e.target.name]: e.target.value,
    });
  };

  const validateExpenseForm = () => {
    const formErrors: { [key: string]: string } = {};
    let formIsValid = true;

    if (!expense.naziv) {
      formIsValid = false;
      formErrors['naziv'] = 'Prosimo, vnesite naziv potnega stroška.';
    }

    if (!expense.datum_odhoda) {
      formIsValid = false;
      formErrors['datum_odhoda'] = 'Prosimo, vnesite datum odhoda.';
    }

    if (!expense.datum_prihoda) {
      formIsValid = false;
      formErrors['datum_prihoda'] = 'Prosimo, vnesite datum prihoda.';
    }

    if (expense.datum_odhoda && expense.datum_prihoda) {
      const datumOdhoda = new Date(expense.datum_odhoda);
      const datumPrihoda = new Date(expense.datum_prihoda);

      if (datumPrihoda <= datumOdhoda) {
        formIsValid = false;
        formErrors['datum_prihoda'] = 'Datum prihoda mora biti po datumu odhoda.';
      }
    }

    if (expense.kilometrina <= 0) {
      formIsValid = false;
      formErrors['kilometrina'] = 'Kilometrina mora biti večja od 0.';
    }

    if (!expense.lokacija) {
      formIsValid = false;
      formErrors['lokacija'] = 'Prosimo, vnesite lokacijo.';
    }

    if (!expense.opis) {
      formIsValid = false;
      formErrors['opis'] = 'Prosimo, vnesite opis.';
    }

    if (!expense.oseba) {
      formIsValid = false;
      formErrors['oseba'] = 'Prosimo, vnesite email osebe.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(expense.oseba)) {
        formIsValid = false;
        formErrors['oseba'] = 'Vnesite veljaven email naslov.';
      }
    }

    setErrors(formErrors);
    return formIsValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validateExpenseForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9000/strosek/dodaj",
        expense
      );
      setSuccessMessage("Strošek je bil uspešno dodan!");
      console.log("Expense added:", response.data);

      setExpense({
        id: "",
        naziv: "",
        datum_odhoda: "",
        datum_prihoda: "",
        kilometrina: 0,
        lokacija: "",
        opis: "",
        oseba: "",
      });
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error ||
          "Prišlo je do napake pri dodajanju stroška."
      );
      console.error("Napaka pri dodajanju stroška:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Dodaj nov potni strošek
        </Typography>

        {successMessage && (
          <Typography
            variant="body1"
            color="primary"
            gutterBottom
            align="center"
          >
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
                label="Naziv"
                name="naziv"
                value={expense.naziv}
                onChange={handleChange}
                fullWidth
                error={!!errors['naziv']}
                helperText={errors['naziv']}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Datum odhoda"
                name="datum_odhoda"
                type="date"
                value={expense.datum_odhoda}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors['datum_odhoda']}
                helperText={errors['datum_odhoda']}
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
                error={!!errors['datum_prihoda']}
                helperText={errors['datum_prihoda']}
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
                error={!!errors['kilometrina']}
                helperText={errors['kilometrina']}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Lokacija"
                name="lokacija"
                value={expense.lokacija}
                onChange={handleChange}
                fullWidth
                error={!!errors['lokacija']}
                helperText={errors['lokacija']}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Opis"
                name="opis"
                value={expense.opis}
                onChange={handleChange}
                fullWidth
                error={!!errors['opis']}
                helperText={errors['opis']}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Oseba (email)"
                name="oseba"
                value={expense.oseba}
                onChange={handleChange}
                fullWidth
                error={!!errors['oseba']}
                helperText={errors['oseba']}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Dodaj strošek
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateExpenseComponent;
