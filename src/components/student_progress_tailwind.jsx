// Converted JSX version of StudentProgress.js using TailwindCSS to match the HeroSection style
import React, { useState } from "react";
import { BarChart, Users } from "lucide-react";

const StudentProgress = () => {
  const [selectedClass, setSelectedClass] = useState("10A");

  const classData = {
    "10A": [
      { id: 1, name: "Alice Johnson", progress: 85, subjects: { Math: 90, Science: 80, English: 85 } },
      { id: 2, name: "Bob Smith", progress: 72, subjects: { Math: 75, Science: 70, English: 71 } },
      { id: 3, name: "Charlie Brown", progress: 91, subjects: { Math: 95, Science: 88, English: 90 } },
      { id: 4, name: "Diana Prince", progress: 78, subjects: { Math: 80, Science: 75, English: 79 } }
    ],
    "10B": [
      { id: 5, name: "Emma Wilson", progress: 88, subjects: { Math: 92, Science: 85, English: 87 } },
      { id: 6, name: "Frank Miller", progress: 65, subjects: { Math: 60, Science: 70, English: 65 } },
      { id: 7, name: "Grace Lee", progress: 94, subjects: { Math: 96, Science: 92, English: 94 } },
      { id: 8, name: "Henry Davis", progress: 81, subjects: { Math: 85, Science: 78, English: 80 } }
    ],
    "11A": [
      { id: 9, name: "Ivy Chen", progress: 89, subjects: { Math: 92, Science: 87, English: 88 } },
      { id: 10, name: "Jack Taylor", progress: 76, subjects: { Math: 80, Science: 72, English: 76 } },
      { id: 11, name: "Kate Anderson", progress: 93, subjects: { Math: 95, Science: 90, English: 94 } },
      { id: 12, name: "Liam O'Connor", progress: 82, subjects: { Math: 85, Science: 80, English: 81 } }
    ]
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return "bg-emerald-600";
    if (progress >= 80) return "bg-teal-500";
    if (progress >= 70) return "bg-yellow-400";
    return "bg-red-500";
  };

  const getProgressLabel = (progress) => {
    if (progress >= 90) return "Excellent";
    if (progress >= 80) return "Good";
    if (progress >= 70) return "Average";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-2xl space-y-8">
        <div className="flex items-center gap-4">
          <BarChart className="w-8 h-8 text-emerald-600" />
          <h2 className="text-2xl font-bold text-slate-800">Student Progress Dashboard</h2>
        </div>
        <p className="text-slate-600">Track class-wise student performance and progress</p>

        <div className="flex items-center gap-4">
          <label htmlFor="class-select" className="text-slate-700 font-medium">Select Class:</label>
          <select
            id="class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-emerald-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            {Object.keys(classData).map(className => (
              <option key={className} value={className}>Class {className}</option>
            ))}
          </select>
        </div>

        <div className="bg-emerald-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-emerald-700">Class {selectedClass} Overview</h3>
          <div className="grid grid-cols-3 gap-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{classData[selectedClass].length}</div>
              <div className="text-slate-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {
                  Math.round(
                    classData[selectedClass].reduce((acc, s) => acc + s.progress, 0) / classData[selectedClass].length
                  )
                }%
              </div>
              <div className="text-slate-600">Avg Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {classData[selectedClass].filter(s => s.progress >= 80).length}
              </div>
              <div className="text-slate-600">Above 80%</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {classData[selectedClass].map(student => (
            <div key={student.id} className="bg-white border border-emerald-100 rounded-xl shadow p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-slate-800">{student.name}</h4>
                <span className="text-sm text-slate-500">ID: {student.id}</span>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600">Progress</span>
                  <span className="text-sm font-medium text-slate-700">{student.progress}% - {getProgressLabel(student.progress)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${getProgressColor(student.progress)}`}
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <h5 className="text-sm text-slate-600 font-medium mb-2">Subject Performance:</h5>
                <div className="grid grid-cols-3 gap-2 text-sm text-slate-700">
                  {Object.entries(student.subjects).map(([subject, score]) => (
                    <div key={subject} className="flex justify-between">
                      <span>{subject}</span>
                      <span>{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
