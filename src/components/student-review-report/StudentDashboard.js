import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { academicRecords } from '../data/studentsData';

const StudentDashboard = ({ student, onLogout }) => {
  const [selectedExamType, setSelectedExamType] = useState('all');
  const [showReport, setShowReport] = useState(false);

  // Filter student's academic records
  const studentRecords = useMemo(() => {
    return academicRecords.filter(record => 
      record.studentId === student.id
    );
  }, [student.id]);

  // Filter by exam type
  const filteredRecords = useMemo(() => {
    if (selectedExamType === 'all') return studentRecords;
    return studentRecords.filter(record => record.examType === selectedExamType);
  }, [studentRecords, selectedExamType]);

  // Prepare data for charts
  const chartData = useMemo(() => {
    const subjects = ['Hindi', 'English', 'Science', 'Mathematics', 'Social Science'];
    
    return subjects.map(subject => {
      const subjectRecords = filteredRecords.filter(record => 
        record.subjects.some(sub => sub.name === subject)
      );
      
      if (subjectRecords.length === 0) {
        return {
          subject,
          marks: 0,
          percentage: 0,
          examCount: 0
        };
      }

      const latestRecord = subjectRecords[subjectRecords.length - 1];
      const subjectData = latestRecord.subjects.find(sub => sub.name === subject);
      
      return {
        subject,
        marks: subjectData ? subjectData.marks : 0,
        percentage: subjectData ? subjectData.percentage : 0,
        examCount: subjectRecords.length
      };
    });
  }, [filteredRecords]);

  // Prepare data for progress line chart
  const progressData = useMemo(() => {
    return filteredRecords.map(record => ({
      examDate: new Date(record.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      percentage: record.overallPercentage,
      examType: record.examType
    }));
  }, [filteredRecords]);

  // Prepare data for radar chart
  const radarData = useMemo(() => {
    return chartData.map(item => ({
      subject: item.subject,
      percentage: item.percentage,
      fullMark: 100
    }));
  }, [chartData]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    if (filteredRecords.length === 0) {
      return {
        totalExams: 0,
        averagePercentage: 0,
        highestPercentage: 0,
        lowestPercentage: 0,
        totalSubjects: 0
      };
    }

    const percentages = filteredRecords.map(record => record.overallPercentage);
    const totalSubjects = chartData.filter(item => item.examCount > 0).length;

    return {
      totalExams: filteredRecords.length,
      averagePercentage: Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length),
      highestPercentage: Math.max(...percentages),
      lowestPercentage: Math.min(...percentages),
      totalSubjects
    };
  }, [filteredRecords, chartData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#2e7d32';
    if (percentage >= 80) return '#388e3c';
    if (percentage >= 70) return '#689f38';
    if (percentage >= 60) return '#f57c00';
    if (percentage >= 50) return '#ff8f00';
    if (percentage >= 40) return '#f57c00';
    return '#d32f2f';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  const generateDetailedReport = () => {
    const reportData = {
      studentInfo: student,
      overallStats,
      subjectPerformance: chartData,
      examHistory: filteredRecords,
      generatedDate: new Date().toLocaleDateString()
    };

    const reportText = `
STUDENT ACADEMIC REPORT
Generated on: ${reportData.generatedDate}

STUDENT INFORMATION:
Name: ${student.name}
Roll Number: ${student.rollNumber}
Class: ${student.className}
Section: ${student.section}
Email: ${student.email}
Phone: ${student.phone}
Parent: ${student.parentName}
Parent Phone: ${student.parentPhone}
Admission Date: ${student.admissionDate}

OVERALL PERFORMANCE SUMMARY:
- Total Exams Taken: ${overallStats.totalExams}
- Average Percentage: ${overallStats.averagePercentage}%
- Highest Score: ${overallStats.highestPercentage}%
- Lowest Score: ${overallStats.lowestPercentage}%
- Subjects with Data: ${overallStats.totalSubjects}/5

SUBJECT-WISE PERFORMANCE:
${chartData.map(subject => 
  `${subject.subject}: ${subject.percentage}% (${subject.marks} marks) - Grade: ${getGrade(subject.percentage)}`
).join('\n')}

DETAILED EXAM HISTORY:
${filteredRecords.map((record, index) => `
Exam ${index + 1}:
Date: ${new Date(record.examDate).toLocaleDateString()}
Type: ${record.examType.charAt(0).toUpperCase() + record.examType.slice(1)}
Overall Percentage: ${record.overallPercentage}%
Grade: ${getGrade(record.overallPercentage)}

Subject Marks:
${record.subjects.map(subject => 
  `  ${subject.name}: ${subject.marks}/${subject.totalMarks} (${subject.percentage}%)`
).join('\n')}
`).join('\n')}

PERFORMANCE ANALYSIS:
${overallStats.averagePercentage >= 80 ? 'Excellent Performance! Keep up the great work!' :
  overallStats.averagePercentage >= 70 ? 'Good Performance! There\'s room for improvement.' :
  overallStats.averagePercentage >= 60 ? 'Average Performance. Focus on weak areas.' :
  'Needs Improvement. Consider seeking additional help.'}

RECOMMENDATIONS:
${chartData.filter(subject => subject.percentage < 70).map(subject => 
  `- Focus on improving ${subject.subject} (Current: ${subject.percentage}%)`
).join('\n')}
${chartData.filter(subject => subject.percentage < 70).length === 0 ? 
  '- All subjects are performing well! Maintain this level.' : ''}
    `;

    // Create and download report
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student.name.replace(/\s+/g, '-')}-academic-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uniqueExamTypes = [...new Set(studentRecords.map(record => record.examType))];

  if (showReport) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-300 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-teal-300 rounded-full blur-2xl"></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-emerald-200 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 p-6 py-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4 lg:mb-0">
                Academic Report - {student.name}
              </h2>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowReport(false)} 
                  className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-200 transition-all duration-300 flex items-center font-semibold"
                >
                  <span className="mr-2">←</span>
                  Back to Dashboard
                </button>
                <button 
                  onClick={generateDetailedReport} 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="mr-2">📄</span>
                  Download Report
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>

            {/* Student Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                  <span className="mr-3 text-emerald-600">👤</span>
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Name</div>
                    <div className="font-semibold text-slate-800">{student.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Roll Number</div>
                    <div className="font-semibold text-slate-800">{student.rollNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Class</div>
                    <div className="font-semibold text-slate-800">{student.className}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Section</div>
                    <div className="font-semibold text-slate-800">{student.section}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Email</div>
                    <div className="font-semibold text-slate-800">{student.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Parent</div>
                    <div className="font-semibold text-slate-800">{student.parentName}</div>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
                <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                  <span className="mr-3 text-teal-600">📊</span>
                  Overall Performance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-teal-100 text-center">
                    <div className="text-sm text-slate-600 mb-1">Total Exams</div>
                    <div className="text-2xl font-bold text-slate-800">{overallStats.totalExams}</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-teal-100 text-center">
                    <div className="text-sm text-slate-600 mb-1">Average Percentage</div>
                    <div className="text-2xl font-bold" style={{ color: getGradeColor(overallStats.averagePercentage) }}>
                      {overallStats.averagePercentage}%
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-teal-100 text-center">
                    <div className="text-sm text-slate-600 mb-1">Highest Score</div>
                    <div className="text-2xl font-bold" style={{ color: getGradeColor(overallStats.highestPercentage) }}>
                      {overallStats.highestPercentage}%
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-teal-100 text-center">
                    <div className="text-sm text-slate-600 mb-1">Subjects</div>
                    <div className="text-2xl font-bold text-slate-800">{overallStats.totalSubjects}/5</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Performance Summary */}
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 mb-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <span className="mr-3 text-emerald-600">📚</span>
                Subject Performance Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chartData.map((subject, index) => (
                  <div key={subject.subject} className="bg-white rounded-xl p-4 border border-emerald-100">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-slate-800">{subject.subject}</h4>
                      <span className="text-sm font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: getGradeColor(subject.percentage) + '20', color: getGradeColor(subject.percentage) }}>
                        {getGrade(subject.percentage)}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Marks:</span>
                        <span className="font-semibold">{subject.marks}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Percentage:</span>
                        <span className="font-semibold" style={{ color: getGradeColor(subject.percentage) }}>
                          {subject.percentage}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Exams:</span>
                        <span className="font-semibold">{subject.examCount}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${subject.percentage}%`,
                          backgroundColor: getGradeColor(subject.percentage)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Exam History */}
            <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <span className="mr-3 text-teal-600">📋</span>
                Detailed Exam History
              </h3>
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📚</div>
                  <p className="text-slate-600">No exam records available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecords.map((record, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 border border-teal-100">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                        <h4 className="text-lg font-semibold text-slate-800 mb-2 lg:mb-0">Exam {index + 1}</h4>
                        <div className="flex flex-wrap gap-3">
                          <span className="text-sm text-slate-600">
                            {new Date(record.examDate).toLocaleDateString()}
                          </span>
                          <span className="text-sm font-medium text-slate-800">
                            {record.examType.charAt(0).toUpperCase() + record.examType.slice(1)}
                          </span>
                          <span className="text-sm font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: getGradeColor(record.overallPercentage) + '20', color: getGradeColor(record.overallPercentage) }}>
                            Overall: {record.overallPercentage}% ({getGrade(record.overallPercentage)})
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {record.subjects.map((subject, subIndex) => (
                          <div key={subIndex} className="bg-slate-50 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-slate-800">{subject.name}</span>
                              <span className="text-sm font-semibold text-slate-600">{subject.marks}/{subject.totalMarks}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-slate-500">Percentage</span>
                              <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: getGradeColor(subject.percentage) + '20', color: getGradeColor(subject.percentage) }}>
                                {subject.percentage}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-slate-500">Grade</span>
                              <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: getGradeColor(subject.percentage) + '20', color: getGradeColor(subject.percentage) }}>
                                {getGrade(subject.percentage)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-300 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-teal-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-emerald-200 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Welcome back, {student.name}! 👋
              </h1>
              <p className="text-slate-600">Track your academic progress and performance</p>
            </div>
            <div className="flex gap-4 mt-4 lg:mt-0">
              <button 
                onClick={() => setShowReport(true)} 
                className="bg-emerald-100 text-emerald-700 px-6 py-3 rounded-xl hover:bg-emerald-200 transition-all duration-300 flex items-center font-semibold"
              >
                <span className="mr-2">📊</span>
                View Report
              </button>
              <button 
                onClick={onLogout} 
                className="bg-red-100 text-red-700 px-6 py-3 rounded-xl hover:bg-red-200 transition-all duration-300 flex items-center font-semibold"
              >
                <span className="mr-2">🚪</span>
                Logout
              </button>
            </div>
          </div>

          {/* Dashboard Controls */}
          <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <label className="text-sm font-semibold text-slate-700">Filter by Exam Type:</label>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="px-4 py-2 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                <option value="all">All Exam Types</option>
                {uniqueExamTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Exams</p>
                  <p className="text-3xl font-bold text-slate-800">{overallStats.totalExams}</p>
                </div>
                <div className="text-3xl">📝</div>
              </div>
            </div>
            <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Average Percentage</p>
                  <p className="text-3xl font-bold" style={{ color: getGradeColor(overallStats.averagePercentage) }}>
                    {overallStats.averagePercentage}%
                  </p>
                </div>
                <div className="text-3xl">📊</div>
              </div>
            </div>
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Highest Score</p>
                  <p className="text-3xl font-bold" style={{ color: getGradeColor(overallStats.highestPercentage) }}>
                    {overallStats.highestPercentage}%
                  </p>
                </div>
                <div className="text-3xl">🏆</div>
              </div>
            </div>
            <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Subjects</p>
                  <p className="text-3xl font-bold text-slate-800">{overallStats.totalSubjects}/5</p>
                </div>
                <div className="text-3xl">📚</div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 mb-6 text-center">Performance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="examDate" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="#059669" 
                    strokeWidth={3}
                    dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 mb-6 text-center">Subject Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.filter(item => item.percentage > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ subject, percentage }) => `${subject}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Marks Table */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-lg">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">Detailed Marks</h3>
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📚</div>
                <p className="text-slate-600">No marks data available for the selected filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-emerald-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                      <th className="px-6 py-4 text-left font-semibold">Exam Date</th>
                      <th className="px-6 py-4 text-left font-semibold">Exam Type</th>
                      <th className="px-6 py-4 text-left font-semibold">Subject</th>
                      <th className="px-6 py-4 text-left font-semibold">Marks</th>
                      <th className="px-6 py-4 text-left font-semibold">Percentage</th>
                      <th className="px-6 py-4 text-left font-semibold">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record, index) => 
                      record.subjects.map((subject, subIndex) => (
                        <tr key={`${index}-${subIndex}`} className="border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors">
                          <td className="px-6 py-4 text-slate-600">{new Date(record.examDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-slate-800 font-medium">{record.examType.charAt(0).toUpperCase() + record.examType.slice(1)}</td>
                          <td className="px-6 py-4 text-slate-800 font-medium">{subject.name}</td>
                          <td className="px-6 py-4 text-slate-800 font-medium">{subject.marks}/{subject.totalMarks}</td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: getGradeColor(subject.percentage) + '20', color: getGradeColor(subject.percentage) }}>
                              {subject.percentage}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-2 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: getGradeColor(subject.percentage) + '20', color: getGradeColor(subject.percentage) }}>
                              {getGrade(subject.percentage)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 