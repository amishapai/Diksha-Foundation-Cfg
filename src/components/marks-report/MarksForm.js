import React, { useState } from 'react';

const MarksForm = ({ onAddStudent, teacherSubject, teacherSubjectName }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    className: '',
    section: '',
    subjects: {
      [teacherSubject]: { marks: '', totalMarks: 100 }
    },
    examType: 'midterm',
    examDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (subject, field, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: {
          ...prev.subjects[subject],
          [field]: value
        }
      }
    }));
  };

  const calculatePercentage = (marks, totalMarks) => {
    if (!marks || !totalMarks) return 0;
    return Math.round((parseFloat(marks) / parseFloat(totalMarks)) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.studentName.trim() || !formData.rollNumber.trim()) {
      alert('Please enter student name and roll number');
      return;
    }

    const subjectData = formData.subjects[teacherSubject];
    if (!subjectData.marks) {
      alert('Please enter marks for ' + teacherSubjectName);
      return;
    }

    const percentage = calculatePercentage(subjectData.marks, subjectData.totalMarks);

    const studentRecord = {
      ...formData,
      subjects: [{
        name: teacherSubjectName,
        marks: parseFloat(subjectData.marks) || 0,
        totalMarks: parseFloat(subjectData.totalMarks) || 100,
        percentage: percentage
      }]
    };

    onAddStudent(studentRecord);
    
    // Reset form
    setFormData({
      studentName: '',
      rollNumber: '',
      className: '',
      section: '',
      subjects: {
        [teacherSubject]: { marks: '', totalMarks: 100 }
      },
      examType: 'midterm',
      examDate: new Date().toISOString().split('T')[0],
      remarks: ''
    });
  };

  const subjectData = formData.subjects[teacherSubject];
  const percentage = calculatePercentage(subjectData.marks, subjectData.totalMarks);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-300 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-teal-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-emerald-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              📊 Add {teacherSubjectName} Marks
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Student Marks Entry Form
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto mb-4"></div>
            <div className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium">
              Subject: {teacherSubjectName}
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Student Information Section */}
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <span className="mr-3 text-emerald-600">👤</span>
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="space-y-2">
                  <label htmlFor="rollNumber" className="block text-sm font-semibold text-slate-700">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    placeholder="Enter roll number"
                    required
                    className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="className" className="block text-sm font-semibold text-slate-700">
                    Class
                  </label>
                  <input
                    type="text"
                    id="className"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    placeholder="e.g., Class 10"
                    className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="section" className="block text-sm font-semibold text-slate-700">
                    Section
                  </label>
                  <input
                    type="text"
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder="e.g., A, B, C"
                    className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Exam Information Section */}
            <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <span className="mr-3 text-teal-600">📝</span>
                Exam Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="examType" className="block text-sm font-semibold text-slate-700">
                    Exam Type
                  </label>
                  <select
                    id="examType"
                    name="examType"
                    value={formData.examType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-teal-100 rounded-xl focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  >
                    <option value="midterm">📚 Mid Term</option>
                    <option value="final">📋 Final Term</option>
                    <option value="unit">📖 Unit Test</option>
                    <option value="assignment">📄 Assignment</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="examDate" className="block text-sm font-semibold text-slate-700">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    id="examDate"
                    name="examDate"
                    value={formData.examDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-teal-100 rounded-xl focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            {/* Marks Section */}
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <span className="mr-3 text-emerald-600">🎯</span>
                {teacherSubjectName} Marks
              </h3>
              <div className="bg-white rounded-xl p-6 border border-emerald-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-lg font-semibold text-slate-800">
                    {teacherSubjectName}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Marks"
                      value={subjectData.marks}
                      onChange={(e) => handleSubjectChange(teacherSubject, 'marks', e.target.value)}
                      min="0"
                      max={subjectData.totalMarks}
                      required
                      className="w-20 px-3 py-2 border-2 border-emerald-100 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all duration-300 bg-white text-center font-semibold"
                    />
                    <span className="text-xl font-bold text-slate-600">/</span>
                    <input
                      type="number"
                      placeholder="Total"
                      value={subjectData.totalMarks}
                      onChange={(e) => handleSubjectChange(teacherSubject, 'totalMarks', e.target.value)}
                      min="1"
                      className="w-20 px-3 py-2 border-2 border-emerald-100 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all duration-300 bg-white text-center font-semibold"
                    />
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg font-bold text-sm min-w-[60px] text-center">
                      {percentage}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <span className="mr-3 text-teal-600">📊</span>
                Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-teal-100 text-center">
                  <div className="text-sm text-slate-600 mb-1">Marks</div>
                  <div className="text-2xl font-bold text-slate-800">{subjectData.marks || 0}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-teal-100 text-center">
                  <div className="text-sm text-slate-600 mb-1">Total Possible</div>
                  <div className="text-2xl font-bold text-slate-800">{subjectData.totalMarks}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-teal-100 text-center">
                  <div className="text-sm text-slate-600 mb-1">Percentage</div>
                  <div className="text-2xl font-bold text-emerald-600">{percentage}%</div>
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="space-y-2">
              <label htmlFor="remarks" className="block text-sm font-semibold text-slate-700">
                Remarks (Optional)
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Add any additional remarks..."
                rows="3"
                className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-slate-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-2 text-xl">📝</span>
              Save {teacherSubjectName} Marks
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

export default MarksForm; 