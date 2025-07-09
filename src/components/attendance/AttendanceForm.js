import React, { useState } from 'react';

const AttendanceForm = ({ onAddRecord }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName.trim()) {
      alert('Please enter a student name');
      return;
    }

    const record = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    onAddRecord(record);
    
    // Reset form
    setFormData({
      studentName: '',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      notes: ''
    });

    // Show success message
    alert('Attendance recorded successfully!');
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
              📚 Take Attendance
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Record Student Attendance
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto"></div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Name */}
            <div className="space-y-2">
              <label htmlFor="studentName" className="block text-sm font-semibold text-slate-700">
                Student Name *
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                placeholder="Enter student name"
                required
                className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-slate-400"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-semibold text-slate-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-semibold text-slate-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                <option value="present">✅ Present</option>
                <option value="absent">❌ Absent</option>
                <option value="late">⏰ Late</option>
                <option value="excused">📝 Excused</option>
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-semibold text-slate-700">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any additional notes..."
                rows="3"
                className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-slate-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-2 text-xl">✓</span>
              Record Attendance
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </form>

          {/* Decorative elements */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Form will reset after submission</span>
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm; 