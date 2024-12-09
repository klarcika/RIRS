import React, { useState } from "react";
import { 
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const { signIn } = UserAuth();

  const validateLoginForm = () => {
    const formErrors: { [key: string]: string } = {};
    let formIsValid = true;

    if (!email) {
        formIsValid = false;
        formErrors['email'] = 'Prosimo, vnesite email.';
    }

    if (!password) {
    formIsValid = false;
    formErrors['password'] = 'Prosimo, vnesite geslo.';
    }

    setErrors(formErrors);
    return formIsValid;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
        return;
    }

    try {
      await signIn(email, password);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
        console.error("Napaka pri prijavi uporabnika:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Prijava
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                Potrdi
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;