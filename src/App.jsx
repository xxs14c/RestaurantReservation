import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ReservationForm from "./pages/ReservationForm";
import MyReservationsPage from "./pages/MyReservationPage";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  return (
    <Router>
      <AuthProvider>
      <div className="w-full min-h-screen bg-gray-50">
        <Header/>
        <nav className="flex justify-between items-center p-4 bg-white shadow-md">
          <Link to="/" className="text-xl font-bold text-gray-700">🍽️ Restaurant</Link>
          <div className="space-x-4">
            <Link to="/" className="text-blue-600 hover:underline">Login</Link>
            <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
            <Link to="/home" className="text-blue-600 hover:underline">Home</Link>
            <Link to="/my-reservations" className="text-blue-600 hover:underline">My Reservations</Link>
          </div>
        </nav>

        <main className="p-6">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/reserve" element={<ReservationForm />} />
            <Route path="/my-reservations" element={<MyReservationsPage />} />
          </Routes>
        </main>
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;