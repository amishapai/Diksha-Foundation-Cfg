import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = {
    name: "Admin User",
    email: "admin@school.com",
    role: "Administrator",
    avatar: "👨‍💼",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Logout clicked");
    setIsOpen(false);
    // Add your logout logic here
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-emerald-50 transition"
      >
        <span className="text-2xl">{user.avatar}</span>
        <div className="text-left">
          <div className="text-sm font-semibold text-slate-800">{user.name}</div>
          <div className="text-xs text-slate-500">{user.role}</div>
        </div>
        <span className="ml-2 text-sm text-slate-500">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl border border-slate-100 rounded-lg z-10">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{user.avatar}</span>
              <div>
                <div className="font-semibold text-slate-800">{user.name}</div>
                <div className="text-sm text-slate-500">{user.email}</div>
              </div>
            </div>
          </div>
          <div className="p-2">
            <button
              onClick={() => {
                navigate("/profile");
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded hover:bg-emerald-50 text-slate-700"
            >
              👤 My Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 rounded hover:bg-red-50 text-slate-700"
            >
              🚪 Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
