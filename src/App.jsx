import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import Starter from "./pages/Starter";
import Student from "./pages/student";
import ChatbotPage from "./pages/ChatHelp";
import Register from "./components/Register";
import Login from "./components/Login";
import Admin from "./pages/Admin";
import AdminSetup from "./components/AdminSetup";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LeaderboardDemo from "./pages/LeaderboardDemo";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<Starter />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute>
                  <Student />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/chat" element={<ChatbotPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/setup" element={<AdminSetup />} />
            <Route path="/leaderboard" element={<LeaderboardDemo />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
