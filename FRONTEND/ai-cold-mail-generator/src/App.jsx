import React from "react";
import { useAuth } from "./context/AuthContext.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import Loading from "./components/Loading.jsx";
import Layout from "./components/Layout.jsx";

const App = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/signup"
          element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/verify-otp"
          element={!user ? <VerifyOtp /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/dashboard"
          element={user ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<DashBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
