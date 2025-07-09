import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { fetchData } from "../api";

const IndividualProgress = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData("students");
        setStudents(data);
      } catch (err) {
        setError("Failed to load students data.");
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  const getColor = (value) => {
    if (value >= 90) return "text-green-600";
    if (value >= 80) return "text-teal-500";
    if (value >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getBarColor = (value) => {
    if (value >= 90) return "bg-green-500";
    if (value >= 80) return "bg-teal-400";
    if (value >= 70) return "bg-yellow-400";
    return "bg-red-500";
  };

  const getStatusColor = (status) => {
    return {
      Outstanding: "bg-green-500",
      Excellent: "bg-teal-400",
      Good: "bg-yellow-400",
      Average: "bg-orange-400",
      "Needs Improvement": "bg-red-500"
    }[status] || "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold text-emerald-700">Individual Student Progress</h2>
        <p className="text-slate-600 mb-6">Track each student's holistic development</p>

        {loading ? (
          <div className="text-center text-slate-600 py-10">Loading students data...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-slate-700 font-medium mb-2">Select Student</label>
              <select
                className="w-full md:w-1/2 border border-emerald-300 rounded px-4 py-2"
                value={selectedStudent?.id || ""}
                onChange={(e) => {
                  const student = students.find(s => s.id === parseInt(e.target.value));
                  setSelectedStudent(student);
                }}
              >
                <option value="">Choose a student...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} - Class {s.class}</option>
                ))}
              </select>
            </div>

            {!selectedStudent ? (
              <div className="text-center text-slate-600 py-10">
                <p className="text-4xl mb-2">👤</p>
                <h3 className="text-xl font-semibold">Select a Student</h3>
                <p>Choose a student to view detailed report</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{selectedStudent.name}</h3>
                    <p className="text-slate-500">Class {selectedStudent.class} • ID: {selectedStudent.id}</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="text-emerald-600 font-bold text-xl">{selectedStudent.overallProgress}%</div>
                      <div className="text-sm text-slate-500">Overall Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-600 font-bold text-xl">{selectedStudent.attendance}%</div>
                      <div className="text-sm text-slate-500">Attendance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-600 font-bold text-xl">{selectedStudent.health}</div>
                      <div className="text-sm text-slate-500">Health</div>
                    </div>
                  </div>
                </div>

                {/* Subject Performance */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-700 mb-3">📚 Subject Performance</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedStudent.subjects.map((sub, i) => (
                      <div key={i} className="border p-4 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <h5 className="font-semibold text-slate-800">{sub.name}</h5>
                          <div>{sub.trend === "up" ? <TrendingUp className="text-green-500 w-5 h-5" /> : <TrendingDown className="text-red-500 w-5 h-5" />}</div>
                        </div>
                        <div className="text-sm text-slate-600 mb-2">Recent: {sub.recentScore}%</div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getBarColor(sub.progress)}`}
                            style={{ width: `${sub.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Exams */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-700 mb-3">📝 Recent Exams</h4>
                  <div className="space-y-3">
                    {selectedStudent.recentExams.map((exam, i) => (
                      <div key={i} className="flex justify-between items-center border p-4 rounded-lg">
                        <div>
                          <h5 className="font-medium text-slate-800">{exam.name}</h5>
                          <p className="text-sm text-slate-600">{new Date(exam.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-slate-700">{exam.score}%</span>
                          <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(exam.status)}`}>{exam.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-700 mb-3">🏆 Achievements</h4>
                  <ul className="list-disc list-inside text-slate-700">
                    {selectedStudent.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-700 mb-3">📈 Areas for Improvement</h4>
                  <ul className="list-disc list-inside text-slate-700">
                    {selectedStudent.areas.map((area, i) => <li key={i}>{area}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IndividualProgress;
