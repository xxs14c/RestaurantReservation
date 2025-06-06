import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ReservationForm from "./pages/ReservationForm";
import MyReservationPage from "./pages/MyReservationPage";

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!isLoggedIn ? <LoginPage /> : <Navigate to="/home" replace />}
      />
      <Route
        path="/signup"
        element={!isLoggedIn ? <SignupPage /> : <Navigate to="/home" replace />}
      />
      <Route
        path="/home"
        element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/reserve"
        element={isLoggedIn ? <ReservationForm /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/my_reservations"
        element={isLoggedIn ? <MyReservationPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="main-content">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
