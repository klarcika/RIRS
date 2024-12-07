import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ExpenseListPage from "./components/AllTravelExpenses";
import axios from "axios";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(), // Mock the useNavigate function
}));

jest.mock("axios"); // Mock Axios for API calls

describe("Navbar Component", () => {
    it("renders all buttons", () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        // Check if static buttons are rendered
        expect(screen.getByText(/Domov/i)).toBeInTheDocument();
        expect(screen.getByText(/Dodaj strošek/i)).toBeInTheDocument();
    });
});

describe("ExpenseListPage", () => {
    const mockNavigate = jest.fn(); // Create a mock function
    const mockedAxios = axios as jest.Mocked<typeof axios>;

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate); // Mock useNavigate to return mockNavigate
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it("navigates to the edit page when the edit button is clicked", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                data: [{
                    id: "1",
                    naziv: "Test Expense",
                    datum_odhoda: "2023-12-01",
                    datum_prihoda: "2023-12-02",
                    oseba: "Test User"
                }],
                totalItems: 1,
            },
        });

        render(
            <BrowserRouter>
                <ExpenseListPage/>
            </BrowserRouter>
        );

        const editButton = await screen.findByRole("button", {name: /Edit/i});
        fireEvent.click(editButton);

        // Ensure the mockNavigate function is called with the correct argument
        expect(mockNavigate).toHaveBeenCalledWith("/edit/1");
    });

    it("renders the title", () => {
        render(
            <BrowserRouter>
                <ExpenseListPage/>
            </BrowserRouter>
        );

        expect(screen.getByText(/Potni stroški službenih poti/i)).toBeInTheDocument();
    });

    it("displays the loading indicator while fetching data", () => {
        render(
            <BrowserRouter>
                <ExpenseListPage/>
            </BrowserRouter>
        );

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("displays an error message if data fetch fails", async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error("Error fetching expenses"));

        render(
            <BrowserRouter>
                <ExpenseListPage/>
            </BrowserRouter>
        );

        const errorMessage = await screen.findByText("Error fetching expenses");
        expect(errorMessage).toBeInTheDocument();
    });

    it("renders the table with headers after loading data", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                data: [{
                    id: "1",
                    naziv: "Test Expense",
                    datum_odhoda: "2023-12-01",
                    datum_prihoda: "2023-12-02",
                    oseba: "Test User"
                }],
                totalItems: 1,
            },
        });

        render(
            <BrowserRouter>
                <ExpenseListPage/>
            </BrowserRouter>
        );

        await screen.findByText(/Datum odhoda/i);
        expect(screen.getByText(/Datum prihoda/i)).toBeInTheDocument();
        expect(screen.getByText(/Naziv/i)).toBeInTheDocument();
    });

    it("renders the month filter input", () => {
        render(
            <BrowserRouter>
                <ExpenseListPage/>
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/Filter by Month/i)).toBeInTheDocument();
    });

    it("updates the month filter state when input changes", () => {
        render(
            <BrowserRouter>
                <ExpenseListPage/>
            </BrowserRouter>
        );

        const filterInput = screen.getByLabelText(/Filter by Month/i);
        fireEvent.change(filterInput, {target: {value: "2023-12"}});
        expect(filterInput).toHaveValue("2023-12");
    });

    it("renders pagination and handles page changes", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                data: [{
                    id: "1",
                    naziv: "Test Expense",
                    datum_odhoda: "2023-12-01",
                    datum_prihoda: "2023-12-02",
                    oseba: "Test User"
                }],
                totalItems: 20,
            },
        });

        render(
            <BrowserRouter>
                <ExpenseListPage/>
            </BrowserRouter>
        );

        const nextPageButton = await screen.findByLabelText("Go to next page");
        fireEvent.click(nextPageButton);

        // Verify the current page has changed
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({params: expect.objectContaining({page: 2})}));
    });
});