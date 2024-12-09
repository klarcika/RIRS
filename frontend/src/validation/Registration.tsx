import React, { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Box,
    Button,
    Paper,
    Grid,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { IUser } from "../models/user";
import axios from "axios";

const Register: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<IUser>({
    id: "",
    ime: "",
    priimek: "",
    email: "",
    geslo: "",
    tip: "",
  });
  const [tip, setTip] = useState<string | null>("");
  const navigate = useNavigate();
  
  const { createUser } = UserAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const validateUserForm = () => {
    const formErrors: { [key: string]: string } = {};
    let formIsValid = true;

    if (!user.ime) {
      formIsValid = false;
      formErrors['ime'] = 'Prosimo, vnesite ime uporabnika.';
    }

    if (!user.priimek) {
      formIsValid = false;
      formErrors['priimek'] = 'Prosimo, vnesite priimek uporabnika.';
    }

    if (!user.email) {
      formIsValid = false;
      formErrors['email'] = 'Prosimo, vnesite email uporabnika.';
    }

    if (!user.geslo) {
      formIsValid = false;
      formErrors['geslo'] = 'Prosimo, vnesite geslo.';
    }

    if (user.geslo && user.geslo.length < 6) {
      formIsValid = false;
      formErrors['geslo'] = 'Geslo mora biti dolgo vsaj 6 znakov.';
    }

    if (!tip) {
      formIsValid = false;
      formErrors['tip'] = 'Prosimo, izberite tip.';
    }

    setErrors(formErrors);
    return formIsValid;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validateUserForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9000/uporabnik/dodaj",
        {...user, tip: tip}
      );
      setSuccessMessage("Uporabnik je bil uspešno registriran!");
      console.log("Uporabnik added:", response.data);

      setUser({
        id: "",
        ime: "",
        priimek: "",
        email: "",
        geslo: "",
        tip: "",
      });

      await createUser(user.email, user.geslo);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error ||
          "Prišlo je do napake pri dodajanju uporabnika."
      );
      console.error("Napaka pri dodajanju uporabnika:", error);
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

        <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Ime"
                name="ime"
                value={user.ime}
                onChange={handleChange}
                fullWidth
                error={!!errors['ime']}
                helperText={errors['ime']}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Priimek"
                name="priimek"
                value={user.priimek}
                onChange={handleChange}
                fullWidth
                error={!!errors['priimek']}
                helperText={errors['priimek']}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors['tip']}>
                <InputLabel>Tip</InputLabel>
                <Select
                  label="Tip"
                  name="tip"
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                >
                  <MenuItem value="delavec">Delavec</MenuItem>
                  <MenuItem value="uporabnik">Uporabnik</MenuItem>
                </Select>
                {errors['tip'] && <Typography color="error">{errors['tip']}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                fullWidth
                error={!!errors['email']}
                helperText={errors['email']}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Geslo"
                name="geslo"
                type="password"
                value={user.geslo}
                onChange={handleChange}
                fullWidth
                error={!!errors['geslo']}
                helperText={errors['geslo']}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Dodaj uporabnika
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;