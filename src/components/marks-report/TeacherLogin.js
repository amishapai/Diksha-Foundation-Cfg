import React, { useState } from 'react';

const TeacherLogin = ({ onLogin, teachers }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username) {
      setError('Please select a teacher');
      return;
    }

    const teacher = teachers[username];
    if (teacher) {
      onLogin(username, ''); // Empty password since teacher is already authenticated
    } else {
      setError('Please select a valid teacher');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-300 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-teal-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-emerald-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              👨‍🏫 Teacher Portal
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Select Your Subject
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Choose your assigned subject to continue</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-slate-700">
                Select Teacher
              </label>
              <select
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                <option value="">Choose your subject...</option>
                {Object.entries(teachers).map(([key, teacher]) => (
                  <option key={key} value={key}>
                    {teacher.name} ({teacher.subjectName})
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-2 text-xl">→</span>
              Continue
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </form>

          {/* Available Subjects */}
          <div className="mt-8 bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <span className="mr-2 text-emerald-600">📚</span>
              Available Subjects
            </h3>
            <div className="space-y-3">
              {Object.entries(teachers).map(([key, teacher]) => (
                <div key={key} className="bg-white rounded-xl p-4 border border-emerald-100">
                  <div className="font-semibold text-slate-800">{teacher.name}</div>
                  <div className="text-sm text-emerald-600">Subject: {teacher.subjectName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Select your subject to access marks management</span>
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin; 