


import ExpenseListPage from "./components/AllTravelExpenses";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from "axios";


jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock data for testing
const mockExpenses = [
    { id: '1', datum_odhoda: '2024-01-01', datum_prihoda: '2024-01-02', naziv: 'Business Trip 1', oseba: 'John Doe' },
    { id: '2', datum_odhoda: '2024-01-10', datum_prihoda: '2024-01-12', naziv: 'Business Trip 2', oseba: 'Jane Smith' }
];

describe('ExpenseListPage', () => {
it('should display loading spinner when data is being fetched', () => {
    render(<ExpenseListPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
it('should display error message if data fetching fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Error fetching expenses'));
    render(<ExpenseListPage />);
    await screen.findByText(/Error fetching expenses/i);
});
it('should render expense data in the table', async () => {
    mockedAxios.get.mockResolvedValue({ data: { data: mockExpenses, totalItems: 5 } });
    render(<ExpenseListPage />);
    await screen.findByText(mockExpenses[0].naziv);
});
it('should update expenses list when month filter is changed', async () => {
    render(<ExpenseListPage />);
    fireEvent.change(screen.getByLabelText('Filter by Month'), { target: { value: '2024-01' } });
    expect(screen.getByLabelText('Filter by Month').value).toBe('2024-01');
});
it('should update page when next/previous buttons are clicked', async () => {
    mockedAxios.get.mockResolvedValue({ data: { data: mockExpenses, totalItems: 50 } });
    render(<ExpenseListPage />);
    fireEvent.click(screen.getByLabelText('Go to next page'));
    await screen.findByText('Page 2');
});
it('should update the rows per page and reset the page to 0', async () => {
    render(<ExpenseListPage />);
    fireEvent.change(screen.getByLabelText('Rows per page'), { target: { value: 5 } });
    await screen.findByText('Page 1');
});
it('should call delete function when delete button is clicked', async () => {
    mockedAxios.delete.mockResolvedValue({});
    render(<ExpenseListPage />);
    fireEvent.click(screen.getByAltText('Delete'));
    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
});
it('should navigate to the edit page when edit button is clicked', () => {
    render(<ExpenseListPage />);
    fireEvent.click(screen.getByAltText('Edit'));
    expect(window.location.pathname).toBe('/edit/1');
});
it('should navigate to the detail page when details button is clicked', () => {
    render(<ExpenseListPage />);
    fireEvent.click(screen.getByAltText('Details'));
    expect(window.location.pathname).toBe('/detail/1');
});
it('should display message when no expenses are available', async () => {
    mockedAxios.get.mockResolvedValue({ data: { data: [], totalItems: 0 } });
    render(<ExpenseListPage />);
    await screen.findByText('No expenses available');
});

});