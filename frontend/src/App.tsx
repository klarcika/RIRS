import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllTravelExpenses from './components/AllTravelExpenses';
import CreateTravelExpenses from './components/CreateTravelExpenses';
import Navbar from './components/Navbar';

import DetailExpense from "./components/DetailExpense";

import EditTravelExpense from "./components/EditTravelExpense";
import UserExpenseOverview from './components/UserExpensesOverview';



function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<AllTravelExpenses />} />
          <Route path="/dodaj-strosek" element={<CreateTravelExpenses />} />


          <Route path="/detail/:id" element={<DetailExpense />} />

            <Route path="/edit/:id" element={<EditTravelExpense />} />

          <Route path="/user/:email/expenses" element={<UserExpenseOverview />} />


        </Routes>
    </Router>
  );
}

export default App;
