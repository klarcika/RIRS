import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { UserAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({
  UserAuth: jest.fn(),
}));

describe('Navbar Component', () => {
  it('renders public buttons when user is not logged in', () => {
    (UserAuth as jest.Mock).mockReturnValue({ user: null });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText(/Domov/i)).toBeInTheDocument();
    expect(screen.getByText(/Prijava/i)).toBeInTheDocument();
    expect(screen.getByText(/Registracija/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dodaj strošek/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Odjava/i)).not.toBeInTheDocument();
  });

  it('renders private buttons when user is logged in', () => {
    (UserAuth as jest.Mock).mockReturnValue({ user: { name: 'Test User' } });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText(/Domov/i)).toBeInTheDocument();
    expect(screen.getByText(/Dodaj strošek/i)).toBeInTheDocument();
    expect(screen.getByText(/Odjava/i)).toBeInTheDocument();
    expect(screen.queryByText(/Prijava/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Registracija/i)).not.toBeInTheDocument();
  });
});
