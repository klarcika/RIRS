import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { IExpense } from "./models/expenses";
import ExpenseListPage from "./components/AllTravelExpenses";
import CreateExpenseComponent from "./components/CreateTravelExpenses";

// Mock data
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
const mockedAxios = axios as jest.Mocked<typeof axios>;

afterEach(() => {
    jest.clearAllMocks(); // Ensure mocks are reset after each test
});

describe("ExpenseListPage", () => {
    beforeEach(() => {
        mockedAxios.get.mockResolvedValue({ data: { data: mockExpenses, totalItems: 2 } });
    });

    test("renders loading spinner when data is loading", () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { data: [], totalItems: 0 } });
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

        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

        expect(screen.getByText("Nakup računalnika")).toBeInTheDocument();
        expect(screen.getByText("Službena pot")).toBeInTheDocument();
        expect(screen.getByText("Ljubljana")).toBeInTheDocument();
        expect(screen.getByText("Maribor")).toBeInTheDocument();
    });

    test("displays error message when data fetch fails", async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

        render(
            <Router>
                <ExpenseListPage />
            </Router>
        );

        const errorMessage = await screen.findByText("Error fetching expenses");
        expect(errorMessage).toBeVisible();
    });

    test("filters by month", async () => {
        render(
            <Router>
                <ExpenseListPage />
            </Router>
        );

        const monthFilter = screen.getByLabelText(/Filter by Month/i);

        userEvent.selectOptions(monthFilter, "2024-02");

        await waitFor(() =>
            expect(mockedAxios.get).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    params: expect.objectContaining({ monthFilter: "2024-02" }),
                })
            )
        );
    });

    test("handles delete button click", async () => {
        mockedAxios.delete.mockResolvedValueOnce({});

        render(
            <Router>
                <ExpenseListPage />
            </Router>
        );

        const deleteButton = screen.getAllByAltText("Delete")[0];
        userEvent.click(deleteButton);

        await waitFor(() => expect(mockedAxios.delete).toHaveBeenCalledTimes(1));
    });

    test("handles edit button click", async () => {
        render(
            <Router>
                <ExpenseListPage />
            </Router>
        );

        const editButton = screen.getAllByAltText("Edit")[0];
        userEvent.click(editButton);

        expect(window.location.pathname).toBe("/edit/1");
    });
});

describe("CreateExpenseComponent", () => {
    beforeEach(() => {
        mockedAxios.post.mockClear();
    });

    test("renders the form correctly", () => {
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

    test("shows validation errors on invalid submission", async () => {
        render(<CreateExpenseComponent />);

        userEvent.click(screen.getByRole("button", { name: /dodaj strošek/i }));

        expect(await screen.findByText(/prosimo, vnesite naziv potnega stroška/i)).toBeVisible();
        expect(await screen.findByText(/prosimo, vnesite datum odhoda/i)).toBeVisible();
        expect(await screen.findByText(/kilometrina mora biti večja od 0/i)).toBeVisible();
    });

    test("shows success message on valid form submission", async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

        render(<CreateExpenseComponent />);

        userEvent.type(screen.getByLabelText(/naziv/i), "Business Trip");
        userEvent.type(screen.getByLabelText(/datum odhoda/i), "2024-11-01");
        userEvent.type(screen.getByLabelText(/datum prihoda/i), "2024-11-05");
        userEvent.type(screen.getByLabelText(/kilometrina/i), "100");
        userEvent.type(screen.getByLabelText(/lokacija/i), "Ljubljana");
        userEvent.type(screen.getByLabelText(/opis/i), "Business trip to Ljubljana.");
        userEvent.type(screen.getByLabelText(/oseba/i), "someone@example.com");

        userEvent.click(screen.getByRole("button", { name: /dodaj strošek/i }));

        expect(await screen.findByText(/strošek je bil uspešno dodan/i)).toBeVisible();
    });

    test("shows error message on form submission failure", async () => {
        mockedAxios.post.mockRejectedValueOnce({ response: { data: { error: "Test error" } } });

        render(<CreateExpenseComponent />);

        userEvent.type(screen.getByLabelText(/naziv/i), "Business Trip");
        userEvent.type(screen.getByLabelText(/datum odhoda/i), "2024-11-01");
        userEvent.type(screen.getByLabelText(/datum prihoda/i), "2024-11-05");
        userEvent.type(screen.getByLabelText(/kilometrina/i), "100");
        userEvent.type(screen.getByLabelText(/lokacija/i), "Ljubljana");
        userEvent.type(screen.getByLabelText(/opis/i), "Business trip to Ljubljana.");
        userEvent.type(screen.getByLabelText(/oseba/i), "someone@example.com");

        userEvent.click(screen.getByRole("button", { name: /dodaj strošek/i }));

        expect(await screen.findByText(/prišlo je do napake pri dodajanju stroška/i)).toBeVisible();
    });
});
