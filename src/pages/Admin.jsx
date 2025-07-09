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
import { db, auth } from "../components/firebase";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import CSVDataImporter from "../components/CSVDataImporter";
import {
  BarChart3,
  Users,
  TrendingUp,
  AlertTriangle,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Award,
  Heart,
  XCircle,
  MapPin,
  Maximize2,
  ZoomIn,
  Upload,
  Search,
  Edit,
  Trash2,
  Plus,
  Settings,
  LogOut,
  UserCheck,
  GraduationCap,
  FileSpreadsheet,
} from "lucide-react";

// Graph Display Component
const GraphDisplay = ({ title, description, imageSrc, altText }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
          title={isExpanded ? "Minimize" : "Expand"}
        >
          {isExpanded ? (
            <XCircle className="w-5 h-5" />
          ) : (
            <Maximize2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-auto">
            <div className="flex justify-between items-center p-6 border-b border-emerald-100">
              <h2 className="text-xl font-bold text-slate-800">{title}</h2>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={imageSrc}
                alt={altText}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative group bg-white rounded-lg border border-emerald-100">
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-auto max-h-64 object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
          loading="eager"
          decoding="sync"
        />
        {!isExpanded && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/60 backdrop-blur-sm rounded-full p-2 shadow-md">
              <ZoomIn className="w-6 h-6 text-emerald-700" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Health Alert Component
const HealthAlert = ({ alert }) => {
  const severityColors = {
    high: "bg-red-50 border-red-200 text-red-700",
    medium: "bg-yellow-50 border-yellow-200 text-yellow-700",
    low: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div
      className={`p-4 rounded-xl border ${severityColors[alert.severity]} mb-4`}
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{alert.title}</h4>
          <p className="text-sm opacity-90">{alert.description}</p>
          <div className="flex items-center space-x-4 mt-2 text-xs">
            <span className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{alert.affectedStudents} students</span>
            </span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{alert.center}</span>
            </span>
          </div>
        </div>
        <button className="text-xs font-medium hover:opacity-80 transition-opacity">
          View Details
        </button>
      </div>
    </div>
  );
};

// Google Form Component
const GoogleFormSection = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <FileText className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Student Data Collection
          </h2>
          <p className="text-slate-600">
            Access the Google Form for student information
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Student Registration Form
            </h3>
            <p className="text-slate-600 mb-4">
              Collect comprehensive student data including academic performance,
              health metrics, and personal information.
            </p>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>500+ responses</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Updated daily</span>
              </span>
            </div>
          </div>
          <a
            href="https://forms.google.com/your-form-link"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors font-medium flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Form</span>
          </a>
        </div>
      </div>
    </div>
  );
};

// Progress Report Section
const ProgressReportSection = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);

    try {
      // Create a download link for the existing PDF file
      const pdfUrl = "/diksha_health_report.pdf";

      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "diksha_health_report.pdf";
      link.target = "_blank";

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      toast.success("Health report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download health report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <Download className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Progress Reports
          </h2>
          <p className="text-slate-600">
            Generate comprehensive reports for administrative review
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-100">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Student Health Analysis Report
            </h3>
            <p className="text-slate-600 mb-4">
              Generate detailed health analysis including BMI calculations,
              growth tracking, and nutritional assessments.
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span>BMI Analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Growth Tracking</span>
              </div>
            </div>
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Generate Health Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("dashboard");
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
        }
      }

      toast.success(`Successfully imported ${lines.length - 1} records`);
      setCsvData("");
      fetchStudents();
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sample health alerts
  const healthAlerts = [
    {
      title: "Low BMI Students Detected",
      description:
        "15 students across 3 centers have BMI below recommended levels for their age group.",
      severity: "high",
      affectedStudents: 15,
      center: "Multiple Centers",
    },
    {
      title: "Growth Monitoring Required",
      description:
        "Regular height and weight measurements needed for Grade 3-5 students.",
      severity: "medium",
      affectedStudents: 45,
      center: "Bihar Center",
    },
    {
      title: "Nutrition Program Success",
      description:
        "85% improvement in nutritional indicators over the last quarter.",
      severity: "low",
      affectedStudents: 200,
      center: "All Centers",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-6 py-8">
        {/* Admin Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-600">
                Comprehensive overview of Diksha Foundation operations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Welcome back,</p>
                <p className="font-medium text-slate-800">
                  {userData?.firstname || "Admin"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 border-t border-emerald-100 pt-6">
            <div className="flex space-x-1 bg-emerald-50 rounded-lg p-1">
              <button
                onClick={() => setSelectedTab("dashboard")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedTab === "dashboard"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-emerald-700 hover:text-emerald-800"
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setSelectedTab("students")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedTab === "students"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-emerald-700 hover:text-emerald-800"
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Students ({students.length})
              </button>
              <button
                onClick={() => setSelectedTab("csv-import")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedTab === "csv-import"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-emerald-700 hover:text-emerald-800"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 inline mr-2" />
                CSV Import
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === "dashboard" && (
          <>
            {/* Progress Report Section */}
            <div className="mb-8">
              <ProgressReportSection />
            </div>
          </>
        )}

        {selectedTab === "dashboard" && (
          <>
            {/* Analytics Graphs Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Analytics Dashboard
                  </h2>
                  <p className="text-slate-600">
                    Comprehensive performance analysis across all centers
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <GraphDisplay
                  title="Overall Performance by Center"
                  description="Performance distribution comparison across Bihar, Patna, and SMT centers"
                  imageSrc="/admin_1_overall_performance_by_center.png"
                  altText="Overall Performance by Center"
                />

                <GraphDisplay
                  title="Average Score by Grade & Center"
                  description="Grade-wise performance analysis across different centers"
                  imageSrc="/admin_2_avg_score_by_grade_center.png"
                  altText="Average Score by Grade and Center"
                />

                <GraphDisplay
                  title="Gender Performance Comparison"
                  description="Male vs Female performance analysis across centers"
                  imageSrc="/admin_3_gender_comparison.png"
                  altText="Gender Performance Comparison"
                />

                <GraphDisplay
                  title="Question-wise Performance"
                  description="Average performance on individual questions by center"
                  imageSrc="/admin_4_question_performance.png"
                  altText="Question-wise Performance"
                />

                <GraphDisplay
                  title="Score Distribution by Center"
                  description="Distribution of student scores across different centers"
                  imageSrc="/admin_5_score_distribution.png"
                  altText="Score Distribution by Center"
                />

                <GraphDisplay
                  title="Section Performance Comparison"
                  description="Performance comparison by sections across centers"
                  imageSrc="/admin_6_section_performance.png"
                  altText="Section Performance Comparison"
                />
              </div>
            </div>

            {/* Health Alerts */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Health Alerts
                  </h2>
                  <p className="text-slate-600">
                    Critical health monitoring and intervention alerts
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {healthAlerts.map((alert, index) => (
                  <HealthAlert key={index} alert={alert} />
                ))}
              </div>
            </div>

            {/* Google Form Section */}
            {/* <GoogleFormSection /> */}
          </>
        )}

        {/* Students Management Tab */}
        {selectedTab === "students" && (
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Students Management
              </h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-600">Total Students</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {students.length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-emerald-500" />
                </div>
              </div>

              <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-teal-600">Active Students</p>
                    <p className="text-2xl font-bold text-teal-700">
                      {students.filter((s) => s.role === "student").length}
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-teal-500" />
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Avg GPA</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {(
                        students.reduce((acc, s) => acc + (s.gpa || 0), 0) /
                          students.length || 0
                      ).toFixed(1)}
                    </p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600">Avg Attendance</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {Math.round(
                        students.reduce(
                          (acc, s) => acc + (s.attendance || 0),
                          0
                        ) / students.length || 0
                      )}
                      %
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-emerald-50 border-b border-emerald-100">
                    <th className="px-4 py-3 text-left text-sm font-medium text-emerald-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-emerald-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-emerald-700">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-emerald-700">
                      GPA
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-emerald-700">
                      Attendance
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-emerald-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-emerald-50 hover:bg-emerald-25"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                            {student.firstname?.[0]}
                            {student.lastname?.[0]}
                          </div>
                          {student.firstname} {student.lastname}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {student.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {student.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {student.gpa?.toFixed(1) || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {student.attendance || "N/A"}%
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button className="text-emerald-600 hover:text-emerald-800">
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

        {/* CSV Import Tab */}
        {selectedTab === "csv-import" && (
          <div className="mb-8">
            <CSVDataImporter />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
