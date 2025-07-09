import React, { useState } from 'react';
import { students } from '../data/studentsData';

const StudentLogin = ({ onLogin }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!rollNumber.trim()) {
      setError('Please enter your roll number');
      return;
    }

    const student = students.find(s => s.rollNumber === rollNumber.trim());
    
    if (student) {
      setError('');
      onLogin(student);
    } else {
      setError('Invalid roll number. Please try again.');
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
              🎓 Student Portal
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              Access Your Academic Records
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto"></div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="rollNumber" className="block text-sm font-semibold text-slate-700">
                Roll Number
              </label>
              <input
                type="text"
                id="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter your roll number (e.g., STU001)"
                className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-slate-400"
              />
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
              <span className="mr-2 text-xl">📚</span>
              Login to Dashboard
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </form>

          {/* Demo Students */}
          <div className="mt-8 bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <span className="mr-2 text-teal-600">📋</span>
              Demo Students
            </h3>
            <div className="space-y-3">
              {students.map(student => (
                <div key={student.id} className="bg-white rounded-xl p-4 border border-teal-100 hover:bg-teal-50 transition-colors cursor-pointer" onClick={() => setRollNumber(student.rollNumber)}>
                  <div className="font-semibold text-slate-800">{student.name}</div>
                  <div className="text-sm text-teal-600">Roll: {student.rollNumber}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Click on demo students to auto-fill roll number</span>
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin; 