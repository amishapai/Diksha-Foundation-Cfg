import React, { useState, useMemo } from 'react';

const MarksReport = ({ studentsData, onDeleteStudent, onUpdateStudent, teacherSubject, teacherSubjectName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterExamType, setFilterExamType] = useState('all');
  const [sortBy, setSortBy] = useState('studentName');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredAndSortedData = useMemo(() => {
    let filtered = studentsData.filter(student => {
      const matchesSearch = 
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.className.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = filterClass === 'all' || student.className === filterClass;
      const matchesExamType = filterExamType === 'all' || student.examType === filterExamType;
      
      return matchesSearch && matchesClass && matchesExamType;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'studentName':
          aValue = a.studentName.toLowerCase();
          bValue = b.studentName.toLowerCase();
          break;
        case 'rollNumber':
          aValue = a.rollNumber.toLowerCase();
          bValue = b.rollNumber.toLowerCase();
          break;
        case 'percentage':
          aValue = a.overallPercentage;
          bValue = b.overallPercentage;
          break;
        case 'grade':
          aValue = a.grade;
          bValue = b.grade;
          break;
        case 'examDate':
          aValue = new Date(a.examDate);
          bValue = new Date(b.examDate);
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [studentsData, searchTerm, filterClass, filterExamType, sortBy, sortOrder]);

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-emerald-100 text-emerald-700';
      case 'A': return 'bg-emerald-50 text-emerald-600';
      case 'B+': return 'bg-teal-100 text-teal-700';
      case 'B': return 'bg-teal-50 text-teal-600';
      case 'C+': return 'bg-amber-100 text-amber-700';
      case 'C': return 'bg-amber-50 text-amber-600';
      case 'F': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'bg-emerald-100 text-emerald-700';
    if (percentage >= 80) return 'bg-teal-100 text-teal-700';
    if (percentage >= 70) return 'bg-amber-100 text-amber-700';
    if (percentage >= 60) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      onDeleteStudent(index);
    }
  };

  const generateReport = (specificClass = null) => {
    const dataToReport = specificClass 
      ? filteredAndSortedData.filter(student => student.className === specificClass)
      : filteredAndSortedData;

    if (dataToReport.length === 0) {
      alert(specificClass ? `No data found for ${specificClass}` : 'No data to generate report');
      return;
    }

    const reportData = {
      totalStudents: dataToReport.length,
      averagePercentage: Math.round(
        dataToReport.reduce((sum, student) => sum + student.overallPercentage, 0) / dataToReport.length
      ),
      gradeDistribution: {},
      topPerformers: dataToReport
        .sort((a, b) => b.overallPercentage - a.overallPercentage)
        .slice(0, 5)
    };

    // Calculate grade distribution
    dataToReport.forEach(student => {
      reportData.gradeDistribution[student.grade] = 
        (reportData.gradeDistribution[student.grade] || 0) + 1;
    });

    const className = specificClass || 'All Classes';
    const reportText = `
${teacherSubjectName.toUpperCase()} MARKS REPORT
Generated on: ${new Date().toLocaleDateString()}
Class: ${className}

SUMMARY:
- Total Students: ${reportData.totalStudents}
- Average Percentage: ${reportData.averagePercentage}%

GRADE DISTRIBUTION:
${Object.entries(reportData.gradeDistribution)
  .map(([grade, count]) => `${grade}: ${count} students`)
  .join('\n')}

TOP 5 PERFORMERS:
${reportData.topPerformers
  .map((student, index) => `${index + 1}. ${student.studentName} (${student.rollNumber}) - ${student.overallPercentage}%`)
  .join('\n')}

DETAILED RESULTS:
${dataToReport
  .map(student => `${student.studentName} | ${student.rollNumber} | ${student.className} | ${student.overallPercentage}% | ${student.grade}`)
  .join('\n')}
    `;

    // Create and download report
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = specificClass 
      ? `${teacherSubjectName.toLowerCase()}-${specificClass.replace(/\s+/g, '-')}-report-${new Date().toISOString().split('T')[0]}.txt`
      : `${teacherSubjectName.toLowerCase()}-all-classes-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uniqueClasses = [...new Set(studentsData.map(student => student.className).filter(Boolean))];
  const uniqueExamTypes = [...new Set(studentsData.map(student => student.examType))];

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
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              📊 {teacherSubjectName} Marks Report
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Student Performance Dashboard
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mx-auto"></div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Search Box */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, roll number, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-emerald-100 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-slate-400"
              />
            </div>
            
            {/* Filter Controls */}
            <div className="flex gap-4">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-4 py-3 border-2 border-teal-100 rounded-xl focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 transition-all duration-300 bg-white/80 backdrop-blur-sm min-w-[150px]"
              >
                <option value="all">All Classes</option>
                {uniqueClasses.map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
              
              <select
                value={filterExamType}
                onChange={(e) => setFilterExamType(e.target.value)}
                className="px-4 py-3 border-2 border-teal-100 rounded-xl focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 transition-all duration-300 bg-white/80 backdrop-blur-sm min-w-[150px]"
              >
                <option value="all">All Exam Types</option>
                {uniqueExamTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Download Controls */}
          <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <button 
                onClick={() => generateReport()} 
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="mr-2">📄</span>
                Download All Classes Report
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
              
              {uniqueClasses.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-semibold text-slate-700 self-center">Download by Class:</span>
                  {uniqueClasses.map(className => (
                    <button
                      key={className}
                      onClick={() => generateReport(className)}
                      className="bg-teal-100 text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-200 transition-all duration-300 font-medium text-sm"
                    >
                      📊 {className}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          {filteredAndSortedData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-slate-600 text-lg">No student records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-emerald-100 shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                    <th 
                      onClick={() => handleSort('studentName')} 
                      className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-emerald-700 transition-colors"
                    >
                      Student Name {sortBy === 'studentName' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      onClick={() => handleSort('rollNumber')} 
                      className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-emerald-700 transition-colors"
                    >
                      Roll Number {sortBy === 'rollNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Class</th>
                    <th className="px-6 py-4 text-left font-semibold">Section</th>
                    <th className="px-6 py-4 text-left font-semibold">Exam Type</th>
                    <th 
                      onClick={() => handleSort('examDate')} 
                      className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-emerald-700 transition-colors"
                    >
                      Exam Date {sortBy === 'examDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">{teacherSubjectName} Marks</th>
                    <th 
                      onClick={() => handleSort('percentage')} 
                      className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-emerald-700 transition-colors"
                    >
                      Percentage {sortBy === 'percentage' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      onClick={() => handleSort('grade')} 
                      className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-emerald-700 transition-colors"
                    >
                      Grade {sortBy === 'grade' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedData.map((student, index) => {
                    const subjectMarks = student.subjects.find(subject => subject.name === teacherSubjectName);
                    return (
                      <tr key={student.id} className="border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">{student.studentName}</td>
                        <td className="px-6 py-4 font-mono text-slate-600">{student.rollNumber}</td>
                        <td className="px-6 py-4 text-slate-600">{student.className || '-'}</td>
                        <td className="px-6 py-4 text-slate-600">{student.section || '-'}</td>
                        <td className="px-6 py-4 text-slate-800 font-medium">{student.examType.charAt(0).toUpperCase() + student.examType.slice(1)}</td>
                        <td className="px-6 py-4 text-slate-600">{formatDate(student.examDate)}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {subjectMarks ? `${subjectMarks.marks}/${subjectMarks.totalMarks}` : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPercentageColor(student.overallPercentage)}`}>
                            {student.overallPercentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${getGradeColor(student.grade)}`}>
                            {student.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-300"
                            title="Delete record"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          <div className="mt-8 bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-700 font-semibold">
                Total Records: <span className="text-emerald-600">{filteredAndSortedData.length}</span>
              </p>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-sm text-slate-600">Average</div>
                  <div className="text-xl font-bold text-emerald-600">
                    {filteredAndSortedData.length > 0 ? 
                      Math.round(filteredAndSortedData.reduce((sum, student) => sum + student.overallPercentage, 0) / filteredAndSortedData.length) : 0}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600">Highest</div>
                  <div className="text-xl font-bold text-emerald-600">
                    {filteredAndSortedData.length > 0 ? 
                      Math.max(...filteredAndSortedData.map(student => student.overallPercentage)) : 0}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600">Lowest</div>
                  <div className="text-xl font-bold text-emerald-600">
                    {filteredAndSortedData.length > 0 ? 
                      Math.min(...filteredAndSortedData.map(student => student.overallPercentage)) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarksReport; 