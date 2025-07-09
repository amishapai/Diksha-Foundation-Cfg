// Converted JSX version of ProfilePage.js with TailwindCSS matching the HeroSection style
import React, { useState } from "react";
import { User, Phone, Mail, Briefcase, CalendarDays, Edit3, Save, X, Activity } from "lucide-react";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Admin User",
    email: "admin@school.com",
    role: "Administrator",
    phone: "+1 (555) 123-4567",
    department: "Academic Administration",
    joinDate: "2023-01-15",
    bio: "Experienced administrator with 5+ years in educational management. Passionate about student success and data-driven decision making."
  });

  const userStats = {
    totalStudents: 245,
    activeClasses: 12,
    reportsGenerated: 89,
    lastLogin: "2024-01-15 10:30 AM"
  };

  const recentActivities = [
    { action: "Generated Progress Report", time: "2 hours ago", icon: <Activity className="w-4 h-4" /> },
    { action: "Updated Student Records", time: "1 day ago", icon: <Edit3 className="w-4 h-4" /> },
    { action: "Viewed Class 10A Analytics", time: "2 days ago", icon: <User className="w-4 h-4" /> },
    { action: "Exported Leaderboard Data", time: "3 days ago", icon: <Save className="w-4 h-4" /> }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: "Admin User",
      email: "admin@school.com",
      role: "Administrator",
      phone: "+1 (555) 123-4567",
      department: "Academic Administration",
      joinDate: "2023-01-15",
      bio: "Experienced administrator with 5+ years in educational management. Passionate about student success and data-driven decision making."
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{formData.name}</h2>
              <p className="text-slate-500">{formData.email}</p>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{formData.role}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: "Phone", icon: <Phone />, name: "phone" },
              { label: "Department", icon: <Briefcase />, name: "department" },
              { label: "Join Date", icon: <CalendarDays />, name: "joinDate" },
              { label: "Bio", icon: <Mail />, name: "bio", textarea: true }
            ].map((field, i) => (
              <div key={i} className="space-y-1">
                <label className="text-sm text-slate-600 font-medium flex items-center gap-2">
                  {field.icon} {field.label}
                </label>
                {field.textarea ? (
                  <textarea
                    name={field.name}
                    rows="3"
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-300"
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-emerald-300"
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="pt-4">
            {!isEditing ? (
              <button
                className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="inline w-4 h-4 mr-2" /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700"
                  onClick={handleSave}
                >
                  <Save className="inline w-4 h-4 mr-2" /> Save Changes
                </button>
                <button
                  className="bg-slate-200 text-slate-700 px-6 py-2 rounded-full hover:bg-slate-300"
                  onClick={handleCancel}
                >
                  <X className="inline w-4 h-4 mr-2" /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">📈 Statistics</h3>
            <ul className="space-y-2 text-slate-600">
              <li>Total Students: <span className="font-semibold text-slate-800">{userStats.totalStudents}</span></li>
              <li>Active Classes: <span className="font-semibold text-slate-800">{userStats.activeClasses}</span></li>
              <li>Reports Generated: <span className="font-semibold text-slate-800">{userStats.reportsGenerated}</span></li>
              <li>Last Login: <span className="font-semibold text-slate-800">{userStats.lastLogin}</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">🕒 Recent Activity</h3>
            <ul className="space-y-2">
              {recentActivities.map((item, idx) => (
                <li key={idx} className="flex items-center space-x-3 text-slate-600">
                  <span className="text-emerald-600">{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.action}</div>
                    <div className="text-sm text-slate-500">{item.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
