import React, { useState, useEffect } from "react";
import { fetchData } from "../api";

const Leaderboard = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("overall");
  const [timeframe, setTimeframe] = useState("current");
  const [leaderboardData, setLeaderboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData("leaderboard");
        setLeaderboardData(data);
      } catch (err) {
        setError("Failed to load leaderboard data.");
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    return ["🥇", "🥈", "🥉"][rank - 1] || `#${rank}`;
  };

  const getColor = (val, type = "score") => {
    if (type === "score") {
      if (val >= 95) return "text-green-600";
      if (val >= 85) return "text-teal-500";
      if (val >= 75) return "text-yellow-500";
      return "text-red-500";
    } else {
      if (val.startsWith("+")) return "text-green-600";
      if (val.startsWith("-")) return "text-red-500";
      return "text-slate-400";
    }
  };

  const getAllStudents = () => {
    const all = [];
    Object.entries(leaderboardData).forEach(([cls, arr]) => {
      arr.forEach((s) => all.push({ ...s, class: cls }));
    });
    return all;
  };

  const getFilteredAndSorted = () => {
    const data = selectedClass === "all" ? getAllStudents() : leaderboardData[selectedClass] || [];
    return data.sort((a, b) => (b[selectedSubject] ?? 0) - (a[selectedSubject] ?? 0));
  };

  const students = getFilteredAndSorted();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold text-emerald-700">Academic Leaderboard</h2>
        <p className="text-slate-600 mb-6">Live ranking based on exam performance and improvements</p>

        {loading ? (
          <div className="text-center text-slate-600 py-10">Loading leaderboard data...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 text-center bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">{students.length}</div>
                <div className="text-slate-600 text-sm">Total Students</div>
              </div>
              <div className="p-4 text-center bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">
                  {students.length ? Math.round(students.reduce((a, s) => a + (s[selectedSubject] || 0), 0) / students.length) : 0}
                </div>
                <div className="text-slate-600 text-sm">Average Score</div>
              </div>
              <div className="p-4 text-center bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">
                  {students.filter((s) => s[selectedSubject] >= 90).length}
                </div>
                <div className="text-slate-600 text-sm">Top Performers</div>
              </div>
              <div className="p-4 text-center bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">
                  {students.filter((s) => s.improvement?.startsWith("+")).length}
                </div>
                <div className="text-slate-600 text-sm">Improving</div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full border border-emerald-300 rounded px-3 py-2"
                >
                  <option value="all">All Classes</option>
                  {Object.keys(leaderboardData).map((cls) => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full border border-emerald-300 rounded px-3 py-2"
                >
                  <option value="overall">Overall</option>
                  <option value="math">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="english">English</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Timeframe</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full border border-emerald-300 rounded px-3 py-2"
                >
                  <option value="current">Current Term</option>
                  <option value="semester">This Semester</option>
                  <option value="year">Academic Year</option>
                </select>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border">
                <thead className="bg-emerald-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-2">Rank</th>
                    <th className="px-4 py-2">Student</th>
                    <th className="px-4 py-2">Class</th>
                    <th className="px-4 py-2">Score</th>
                    <th className="px-4 py-2">Attendance</th>
                    <th className="px-4 py-2">Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.id} className={i < 3 ? "bg-emerald-50" : ""}>
                      <td className="px-4 py-2 font-semibold">{getRankIcon(i + 1)}</td>
                      <td className="px-4 py-2">
                        <div className="font-medium text-slate-800">{s.name}</div>
                        <div className="text-sm text-slate-500">ID: {s.id}</div>
                      </td>
                      <td className="px-4 py-2">{s.class}</td>
                      <td className={`px-4 py-2 font-bold ${getColor(s[selectedSubject])}`}>{s[selectedSubject]}%</td>
                      <td className="px-4 py-2">{s.attendance}%</td>
                      <td className={`px-4 py-2 font-semibold ${getColor(s.improvement, "trend")}`}>{s.improvement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
