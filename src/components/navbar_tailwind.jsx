import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    { path: "/student-progress", label: "Student Progress", icon: "📊" },
    { path: "/individual-progress", label: "Individual Progress", icon: "👤" },
    { path: "/alert", label: "Alert", icon: "⚠️" },
    { path: "/leaderboard", label: "Leaderboard", icon: "🏆" }
  ];

  return (
    <nav className="bg-white shadow-md rounded-xl p-4 mb-6">
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-emerald-700 hover:bg-emerald-100"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
