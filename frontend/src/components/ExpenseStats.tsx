import React, {useEffect, useState} from "react";
import {
    Container,
    Typography,
    CircularProgress,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Box,
    Button,
} from "@mui/material";
import {Link} from "react-router-dom";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface IExpense {
    id: string;
    oseba: string | null;
    cena: number;
}

const ExpenseStats: React.FC = () => {
    const [expenses, setExpenses] = useState<IExpense[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    useEffect(() => {
        const fetchExpenses = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("http://localhost:9000/strosek/vsi", {
                    params: {
                        page: page + 1,
                        limit: rowsPerPage,
                    },
                });
                setExpenses(response.data.data);
                setTotalItems(response.data.totalItems);
            } catch (error) {
                setError("Error fetching expenses");
                console.error("Error fetching expenses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const aggregatedData = expenses.reduce((acc: Record<string, number>, expense) => {
        const oseba = expense.oseba || "Neznana oseba";
        acc[oseba] = (acc[oseba] || 0) + expense.cena;
        return acc;
    }, {});

    const chartData = Object.entries(aggregatedData).map(([oseba, cena]) => ({
        oseba,
        cena,
    }));

    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#d0ed57"];

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Statistika
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
                <>
                    {/* Tabela */}
                    <Paper elevation={3} sx={{ mt: 2 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            <strong>Delavec</strong>
                                        </TableCell>
                                        <TableCell align="center">
                                            <strong>Cena</strong>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {expenses.map((expense) =>
                                        expense.oseba ? (
                                            <TableRow key={expense.id} hover>
                                                <TableCell align="center">
                                                    <Link to={`/user/${expense.oseba}/expenses`}>{expense.oseba}</Link>
                                                </TableCell>
                                                <TableCell align="center">{expense.cena}</TableCell>
                                            </TableRow>
                                        ) : (
                                            <TableRow key={expense.id} hover>
                                                <TableCell align="center" colSpan={2}>
                                                    {" "}
                                                    <span>Temu strošku ni dodeljene osebe</span>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={totalItems}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{ px: 2 }}
                        />
                    </Paper>

                    {/* Grafi */}
                    <Box display="flex" justifyContent="center" mt={5} gap={4} flexWrap="wrap">
                        {/* Stolpični graf */}
                        <ResponsiveContainer width="45%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="oseba" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="cena" fill="#8884d8" name="Cena" />
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Tortni diagram */}
                        <ResponsiveContainer width="45%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="cena"
                                    nameKey="oseba"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#82ca9d"
                                    label
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </>
            )}

            <Button
                variant="outlined"
                color="primary"
                sx={{ marginTop: 3 }}
                onClick={() => (window.location.href = "/")}
            >
                Nazaj na domačo stran
            </Button>
        </Container>
    );
};

export default ExpenseStats;
