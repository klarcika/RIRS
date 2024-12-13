import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import ExpenseStats from "./ExpenseStats";

// Mock za axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ExpenseStats Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("prikaz nalagalnega kroga med nalaganjem podatkov", () => {
        render(<ExpenseStats />);
        const loadingSpinner = screen.getByRole("progressbar");
        expect(loadingSpinner).toBeInTheDocument();
    });

    test("prikaz napake, ko API klic ne uspe", async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error("Error fetching expenses"));
        render(<ExpenseStats />);

        const errorMessage = await screen.findByText("Error fetching expenses");
        expect(errorMessage).toBeInTheDocument();
    });

    test("prikaz tabele, ko so podatki uspešno pridobljeni", async () => {
        const mockData = {
            data: {
                data: [
                    { id: "1", oseba: "Janez", cena: 50 },
                    { id: "2", oseba: "Maja", cena: 30 },
                ],
                totalItems: 2,
            },
        };

        mockedAxios.get.mockResolvedValueOnce(mockData);
        render(<ExpenseStats />);

        const tableRows = await screen.findAllByRole("row");
        expect(tableRows).toHaveLength(3); // 1 glava + 2 vrsti
        expect(screen.getByText("Janez")).toBeInTheDocument();
        expect(screen.getByText("50")).toBeInTheDocument();
        expect(screen.getByText("Maja")).toBeInTheDocument();
        expect(screen.getByText("30")).toBeInTheDocument();
    });

    test("spreminjanje strani s straniščem za strani", async () => {
        const mockData = {
            data: {
                data: [
                    { id: "1", oseba: "Janez", cena: 50 },
                    { id: "2", oseba: "Maja", cena: 30 },
                ],
                totalItems: 2,
            },
        };

        mockedAxios.get.mockResolvedValue(mockData);
        render(<ExpenseStats />);

        const pagination = await screen.findByLabelText("Go to next page");
        fireEvent.click(pagination);

        expect(mockedAxios.get).toHaveBeenCalledWith(
            "http://localhost:9000/strosek/vsi",
            expect.objectContaining({ params: { page: 2, limit: 10 } })
        );
    });

    test("prikaz praznega sporočila, če ni podatkov", async () => {
        const mockData = {
            data: { data: [], totalItems: 0 },
        };

        mockedAxios.get.mockResolvedValueOnce(mockData);
        render(<ExpenseStats />);

        const noDataMessage = await screen.findByText("Temu strošku ni dodeljene osebe");
        expect(noDataMessage).toBeInTheDocument();
    });
});
