import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateExpenseComponent from "./CreateExpenseComponent";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { IExpense } from "./models/expenses";
import ExpenseListPage from "./components/AllTravelExpenses";

// Mock podatki
const mockExpenses: IExpense[] = [
    {
        id: "1",
        datum_odhoda: "2024-01-01",
        datum_prihoda: "2024-01-03",
        naziv: "Nakup računalnika",
        oseba: "Janez",
        kilometrina: 120,
        lokacija: "Ljubljana",
        opis: "Nakup za novo službeno opremo",
        cena: 1000,
    },
    {
        id: "2",
        datum_odhoda: "2024-02-01",
        datum_prihoda: "2024-02-03",
        naziv: "Službena pot",
        oseba: "Ana",
        kilometrina: 50,
        lokacija: "Maribor",
        opis: "Službena pot v Maribor za sestanek",
        cena: 200,
    },
];

jest.mock("axios");

describe("ExpenseListPage", () => {
    beforeEach(() => {
        // Mock axios.get
        axios.get.mockResolvedValue({ data: { data: mockExpenses, totalItems: 2 } });
    });

    test("renders loading spinner when data is loading", () => {
        // Simuliraj nalaganje
        axios.get.mockResolvedValueOnce({ data: { data: [], totalItems: 0 } });
        render(
            <Router>
                <ExpenseListPage />
            </Router>
        );
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("renders expenses table when data is loaded", async () => {
        render(
            <Router>
                <ExpenseListPage />
            </Router>
        );

        // Počakaj, da se podatki naložijo
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

        // Preveri, ali je bila tabela pravilno naložena
        expect(screen.getByText("Nakup računalnika")).toBeInTheDocument();
        expect(screen.getByText("Službena pot")).toBeInTheDocument();
        expect(screen.getByText("Ljubljana")).toBeInTheDocument();
        expect(screen.getByText("Maribor")).toBeInTheDocument();
    });

    test("displays error message when data fetch fails", async () => {
        axios.get.mockRejectedValueOnce(new Error("Network Error"));

        render(
            <Router>
                <ExpenseListPage />
            </Router>
        );

        await screen.findByText("Error fetching expenses");
    });

    test("filters by month", async () => {
        render(
            <Router>
                <ExpenseListPage />
            </Router>
        );

        const monthFilter = screen.getByLabelText(/Filter by Month/i);

        // Simuliraj izbiro meseca
        fireEvent.change(monthFilter, { target: { value: "2024-02" } });

        // Preveri, da je axios klican z ustreznim filtrom
        await waitFor(() => expect(axios.get).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                params: expect.objectContaining({
                    monthFilter: "2024-02",
                }),
            })
        ));
    });

    test("handles delete button click", async () => {
        render(
            <Router>
                <ExpenseListPage />
            </Router>
        );

        // Simuliraj klik na gumb za brisanje
        const deleteButton = screen.getAllByAltText("Delete")[0]; // Predpostavimo, da je prvi gumb za brisanje
        fireEvent.click(deleteButton);

        // Preveri, da je bilo klicano brisanje (če bi se dodal mock za axios.delete)
        await waitFor(() => expect(axios.delete).toHaveBeenCalled());
    });

    test("handles edit button click", () => {
        render(
            <Router>
                <ExpenseListPage />
            </Router>
        );

        const editButton = screen.getAllByAltText("Edit")[0]; // Predpostavimo, da je prvi gumb za urejanje
        fireEvent.click(editButton);

        // Preveri, da se navigira na pravilno stran za urejanje (testirajte s pomočjo useNavigate)
        expect(window.location.pathname).toBe("/edit/1");
    });
});

describe("CreateExpenseComponent", () => {
    beforeEach(() => {
        // Reset the mock of axios before each test
        axios.post.mockClear();
    });

    test("should render the form correctly", () => {
        render(<CreateExpenseComponent />);

        expect(screen.getByLabelText(/naziv/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/datum odhoda/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/datum prihoda/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/kilometrina/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/lokacija/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/opis/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/oseba/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /dodaj strošek/i })).toBeInTheDocument();
    });

    test("should show validation errors when submitting an invalid form", async () => {
        render(<CreateExpenseComponent />);

        // Submit the form without filling in the fields
        userEvent.click(screen.getByRole("button", { name: /dodaj strošek/i }));

        // Check that validation error messages appear
        expect(await screen.findByText(/prosimo, vnesite naziv potnega stroška/i)).toBeInTheDocument();
        expect(await screen.findByText(/prosimo, vnesite datum odhoda/i)).toBeInTheDocument();
        expect(await screen.findByText(/prosimo, vnesite datum prihoda/i)).toBeInTheDocument();
        expect(await screen.findByText(/kilometrina mora biti večja od 0/i)).toBeInTheDocument();
        expect(await screen.findByText(/prosimo, vnesite lokacijo/i)).toBeInTheDocument();
        expect(await screen.findByText(/prosimo, vnesite opis/i)).toBeInTheDocument();
        expect(await screen.findByText(/prosimo, vnesite email osebe/i)).toBeInTheDocument();
    });

    test("should show success message when form is successfully submitted", async () => {
        axios.post.mockResolvedValueOnce({ data: { success: true } });

        render(<CreateExpenseComponent />);

        // Fill in the form with valid data
        userEvent.type(screen.getByLabelText(/naziv/i), "Business Trip");
        userEvent.type(screen.getByLabelText(/datum odhoda/i), "2024-11-01");
        userEvent.type(screen.getByLabelText(/datum prihoda/i), "2024-11-05");
        userEvent.type(screen.getByLabelText(/kilometrina/i), "100");
        userEvent.type(screen.getByLabelText(/lokacija/i), "Ljubljana");
        userEvent.type(screen.getByLabelText(/opis/i), "Business trip to Ljubljana.");
        userEvent.type(screen.getByLabelText(/oseba/i), "someone@example.com");

        // Submit the form
        userEvent.click(screen.getByRole("button", { name: /dodaj strošek/i }));

        // Wait for the success message
        await waitFor(() => screen.getByText(/strošek je bil uspešno dodan/i));

        // Assert that the success message is shown
        expect(screen.getByText(/strošek je bil uspešno dodan/i)).toBeInTheDocument();
    });

    test("should show error message when form submission fails", async () => {
        axios.post.mockRejectedValueOnce({ response: { data: { error: "Test error" } } });

        render(<CreateExpenseComponent />);

        // Fill in the form with valid data
        userEvent.type(screen.getByLabelText(/naziv/i), "Business Trip");
        userEvent.type(screen.getByLabelText(/datum odhoda/i), "2024-11-01");
        userEvent.type(screen.getByLabelText(/datum prihoda/i), "2024-11-05");
        userEvent.type(screen.getByLabelText(/kilometrina/i), "100");
        userEvent.type(screen.getByLabelText(/lokacija/i), "Ljubljana");
        userEvent.type(screen.getByLabelText(/opis/i), "Business trip to Ljubljana.");
        userEvent.type(screen.getByLabelText(/oseba/i), "someone@example.com");

        // Submit the form
        userEvent.click(screen.getByRole("button", { name: /dodaj strošek/i }));

        // Wait for the error message
        await waitFor(() => screen.getByText(/prišlo je do napake pri dodajanju stroška/i));

        // Assert that the error message is shown
        expect(screen.getByText(/prišlo je do napake pri dodajanju stroška/i)).toBeInTheDocument();
    });
});
