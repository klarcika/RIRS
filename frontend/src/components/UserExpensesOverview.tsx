import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import { Container, Typography, CircularProgress, Box } from "@mui/material";

const UserExpenseOverview: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalExpenses = async () => {
      if (!email) return;
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:9000/strosek/vsota`, {
          params: { email },
        });
        setTotalExpense(response.data.vsota_stroskov);
      } catch (error) {
        setError("Error fetching total expenses");
        console.error("Error fetching total expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalExpenses();
  }, [email]);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
      Pregled skupnih stroškov za {email}
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" align="center">
            Skupni stroški: €{totalExpense.toFixed(2)}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default UserExpenseOverview;
