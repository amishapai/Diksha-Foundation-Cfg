import React, { useState, useMemo } from 'react';

const AttendanceDisplay = ({ attendanceData, onDeleteRecord }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    return attendanceData.filter(record => {
      const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
      const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.date.includes(searchTerm) ||
                           record.notes.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [attendanceData, filterStatus, searchTerm]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'present': 
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'absent': 
        return 'bg-red-50 text-red-700 border-red-200';
      case 'late': 
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'excused': 
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default: 
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return '✓';
      case 'absent': return '✗';
      case 'late': return '⏰';
      case 'excused': return '📝';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      onDeleteRecord(index);
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Attendance Records
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto"></div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, date, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
            </div>
            
            <div className="lg:w-64">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {filteredData.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-xl text-slate-600 font-medium">No attendance records found.</p>
              <p className="text-slate-500 mt-2">Start by adding some attendance records above.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl shadow-lg border border-emerald-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                      <th className="px-6 py-4 text-left font-semibold text-lg">Student Name</th>
                      <th className="px-6 py-4 text-left font-semibold text-lg">Date</th>
                      <th className="px-6 py-4 text-left font-semibold text-lg">Status</th>
                      <th className="px-6 py-4 text-left font-semibold text-lg">Notes</th>
                      <th className="px-6 py-4 text-left font-semibold text-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredData.map((record, index) => (
                      <tr key={record.id} className="border-b border-emerald-50 hover:bg-emerald-50/50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-800">{record.studentName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-600 font-medium">{formatDate(record.date)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusStyles(record.status)}`}>
                            <span className="text-lg">{getStatusIcon(record.status)}</span>
                            <span className="capitalize">{record.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-600 max-w-xs truncate block" title={record.notes || '-'}>
                            {record.notes || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(index)}
                            className="bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                            title="Delete record"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-slate-800">
                  Total Records: {filteredData.length}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">
                  <span className="text-emerald-700 font-semibold">
                    Present: {filteredData.filter(r => r.status === 'present').length}
                  </span>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-red-200 shadow-sm">
                  <span className="text-red-700 font-semibold">
                    Absent: {filteredData.filter(r => r.status === 'absent').length}
                  </span>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-amber-200 shadow-sm">
                  <span className="text-amber-700 font-semibold">
                    Late: {filteredData.filter(r => r.status === 'late').length}
                  </span>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-teal-200 shadow-sm">
                  <span className="text-teal-700 font-semibold">
                    Excused: {filteredData.filter(r => r.status === 'excused').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDisplay; 