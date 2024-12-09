import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllTravelExpenses from './components/AllTravelExpenses';
import CreateTravelExpenses from './components/CreateTravelExpenses';
import Navbar from './components/Navbar';

import DetailExpense from "./components/DetailExpense";

import EditTravelExpense from "./components/EditTravelExpense";
import UserExpenseOverview from './components/UserExpensesOverview';
import { AuthContextProvider } from './context/AuthContext';
import Login from './validation/Login';
import Register from './validation/Registration';
import Logout from './validation/Logout';
import Routing from './components/Routing';


function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Navbar />
          <Routes>
            <Route path='' element={<Routing />}>
              <Route path="/" element={<AllTravelExpenses />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/edit/:id" element={<EditTravelExpense />} />
            </Route>
            
            <Route path="/dodaj-strosek" element={<CreateTravelExpenses />} />
            <Route path="/user/:email/expenses" element={<UserExpenseOverview />} />
            <Route path="/detail/:id" element={<DetailExpense />} />
          </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
