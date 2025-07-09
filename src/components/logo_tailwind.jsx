import React from "react";
import Profile from "./profile_tailwind";

const Logo = () => (
  <div className="flex items-center justify-between py-4 px-6 bg-white shadow rounded-xl mb-4">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-full">
        <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
          <circle cx="25" cy="25" r="23" fill="#2d98da" stroke="#45aaf2" strokeWidth="2" />
          <path d="M15 20L22 27L35 15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 35C20 35 25 30 30 30C35 30 40 35 40 35" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-800">Student Dashboard</h1>
        <p className="text-sm text-slate-500">Track Progress • Monitor Health • Celebrate Success</p>
      </div>
    </div>
    <Profile />
  </div>
);

export default Logo;
