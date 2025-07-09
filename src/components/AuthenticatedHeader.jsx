import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "./firebase";
import {
  BookOpen,
  LogOut,
  User,
  Settings,
  BarChart3,
  MessageCircle,
  Home,
} from "lucide-react";

const AuthenticatedHeader = () => {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isAdmin = userData?.role === "admin";

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={isAdmin ? "/admin" : "/student"} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-800">
                Diksha Foundation
              </h1>
              <p className="text-xs text-emerald-600">
                {isAdmin ? "Admin Dashboard" : "Student Portal"}
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors font-medium"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/student"
                  className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>View as Student</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/student"
                  className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/chat"
                  className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Help</span>
                </Link>
              </>
            )}
          </nav>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {userData?.firstname?.[0] || userData?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">
                  {userData?.firstname || "User"}
                </p>
                <p className="text-xs text-slate-600 capitalize">
                  {userData?.role || "Student"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-emerald-100">
          <div className="flex flex-wrap gap-4">
            <Link
              to="/"
              className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors text-sm"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/student"
                  className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>View as Student</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/student"
                  className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/chat"
                  className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Help</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
