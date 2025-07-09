import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Users,
  Upload,
  Download,
  Edit,
  Trash2,
  Plus,
  Search,
  FileSpreadsheet,
  Database,
  UserCheck,
  GraduationCap,
  BarChart3,
  Settings,
} from "lucide-react";
import { toast } from "react-toastify";
import CSVDataImporter from "./CSVDataImporter";

const AdminDashboard = () => {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("students");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [csvData, setCsvData] = useState("");
  const [importType, setImportType] = useState("students");

  // Check if user is admin
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (userData && userData.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      navigate("/student");
      return;
    }
  }, [currentUser, userData, navigate]);

  // Fetch all students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const studentsQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(studentsQuery);
      const studentsData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        studentsData.push({
          id: doc.id,
          ...data,
        });
      });

      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students data");
    } finally {
      setLoading(false);
    }
  };

  const handleCSVImport = async () => {
    if (!csvData.trim()) {
      toast.error("Please paste CSV data first");
      return;
    }

    try {
      const lines = csvData.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        const studentData = {};

        headers.forEach((header, index) => {
          studentData[header.toLowerCase()] = values[index] || "";
        });

        // Add to Firestore
        if (importType === "students") {
          await addDoc(collection(db, "users"), {
            ...studentData,
            role: "student",
            createdAt: new Date().toISOString(),
            importedAt: new Date().toISOString(),
          });
        } else if (importType === "attendance") {
          await addDoc(collection(db, "attendance"), {
            ...studentData,
            date: new Date().toISOString(),
            importedAt: new Date().toISOString(),
          });
        }
      }

      toast.success(`Successfully imported ${lines.length - 1} records`);
      setCsvData("");
      if (importType === "students") {
        fetchStudents();
      }
    } catch (error) {
      console.error("Error importing CSV:", error);
      toast.error("Failed to import CSV data");
    }
  };

  const deleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteDoc(doc(db, "users", studentId));
        toast.success("Student deleted successfully");
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Failed to delete student");
      }
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-800">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-blue-600">
                  Manage students and data
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/student")}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors font-medium"
            >
              View as Student
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">
                  {students.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter((s) => s.role === "student").length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg GPA</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(
                    students.reduce((acc, s) => acc + (s.gpa || 0), 0) /
                      students.length || 0
                  ).toFixed(1)}
                </p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(
                    students.reduce((acc, s) => acc + (s.attendance || 0), 0) /
                      students.length || 0
                  )}
                  %
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setSelectedTab("students")}
              className={`px-6 py-3 font-medium ${
                selectedTab === "students"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Students Management
            </button>
            <button
              onClick={() => setSelectedTab("import")}
              className={`px-6 py-3 font-medium ${
                selectedTab === "import"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Import Data
            </button>
            <button
              onClick={() => setSelectedTab("csv-import")}
              className={`px-6 py-3 font-medium ${
                selectedTab === "csv-import"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 inline mr-2" />
              CSV Assessment Data
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === "students" && (
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Students List</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowAddStudent(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      GPA
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Attendance
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                            {student.firstname?.[0]}
                            {student.lastname?.[0]}
                          </div>
                          {student.firstname} {student.lastname}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {student.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.gpa?.toFixed(1) || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.attendance || "N/A"}%
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteStudent(student.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === "import" && (
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Import Data from CSV/Excel
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Import Type
                </label>
                <select
                  value={importType}
                  onChange={(e) => setImportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="students">Students Data</option>
                  <option value="attendance">Attendance Records</option>
                  <option value="grades">Grades/Marks</option>
                  <option value="subjects">Subjects</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Format
                </label>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {importType === "students" &&
                    "firstname,lastname,email,class,gpa,attendance"}
                  {importType === "attendance" &&
                    "student_id,date,status,remarks"}
                  {importType === "grades" &&
                    "student_id,subject,grade,marks,date"}
                  {importType === "subjects" && "name,code,credits,teacher"}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste CSV Data
              </label>
              <textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="Paste your CSV data here..."
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleCSVImport}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </button>
              <button
                onClick={() => setCsvData("")}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {selectedTab === "csv-import" && <CSVDataImporter />}
      </div>
    </div>
  );
};

export default AdminDashboard;
