import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  User,
  CalendarCheck,
  ClipboardList,
} from "lucide-react";

const Alert = () => {
  const [filterStatus, setFilterStatus] = useState("all");

  const alerts = [
    // same alert data from original file...
  ];

  const getIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircle className="text-green-500" />;
      case "warning": return <AlertTriangle className="text-yellow-500" />;
      case "danger": return <XCircle className="text-red-500" />;
      default: return <Info className="text-blue-500" />;
    }
  };

  const filteredAlerts = alerts.filter(a => filterStatus === "all" || a.alertType === filterStatus);

  const alertStats = {
    total: alerts.length,
    success: alerts.filter(a => a.alertType === "success").length,
    warning: alerts.filter(a => a.alertType === "warning").length,
    danger: alerts.filter(a => a.alertType === "danger").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-emerald-700">Health & Academic Alerts</h2>
          <p className="text-slate-600 mt-2">Monitor student well-being and performance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(alertStats).map(([key, value]) => (
            <div key={key} className="p-4 bg-white rounded-xl shadow text-center border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-600">{value}</div>
              <div className="text-slate-600 capitalize">
                {key === 'success' ? 'Good Health' : key === 'warning' ? 'Needs Attention' : key === 'danger' ? 'Critical' : 'Total Alerts'}
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="mb-6">
          <label className="block text-slate-700 font-medium mb-2">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-64 border border-emerald-300 rounded-lg px-4 py-2 text-slate-700"
          >
            <option value="all">All Alerts</option>
            <option value="success">Good Health</option>
            <option value="warning">Needs Attention</option>
            <option value="danger">Critical</option>
          </select>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAlerts.map(alert => (
            <div key={alert.id} className="p-6 bg-white rounded-xl shadow border-l-4"
              style={{ borderColor: alert.alertType === 'success' ? '#22c55e' : alert.alertType === 'warning' ? '#facc15' : '#ef4444' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getIcon(alert.alertType)}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">{alert.studentName}</h4>
                    <p className="text-sm text-slate-500">Class {alert.class} • ID {alert.id}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{new Date(alert.lastUpdated).toLocaleString()}</span>
              </div>

              <p className="mb-3 text-slate-600">{alert.message}</p>

              <div className="space-y-1 text-sm">
                <p><span className="font-medium text-slate-700">Health Status:</span> {alert.healthStatus}</p>
                <p><span className="font-medium text-slate-700">Attendance:</span> {alert.attendance}%</p>
                <p><span className="font-medium text-slate-700">Recent Score:</span> {alert.recentScore}%</p>
              </div>

              <div className="mt-4">
                <h5 className="font-semibold text-slate-700 mb-1">Recommendations:</h5>
                <ul className="list-disc list-inside text-slate-600">
                  {alert.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition text-sm font-medium">View Details</button>
                <button className="border border-emerald-600 text-emerald-600 px-4 py-2 rounded hover:bg-emerald-50 transition text-sm font-medium">Mark as Reviewed</button>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center mt-10 p-6 bg-white rounded-xl shadow text-emerald-600">
            <CheckCircle className="mx-auto mb-2 w-8 h-8" />
            <h3 className="text-xl font-semibold">No Alerts Found</h3>
            <p>All students are currently in good health and performing well.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
