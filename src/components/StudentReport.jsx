import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import {
  getStudentByIdentifier,
  calculateStudentAnalytics,
} from "../services/studentDataService";
import {
  User,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  MessageCircle,
  X,
  Send,
  ChevronDown,
  Target,
  BarChart3,
  GraduationCap,
  Trophy,
  LogOut,
  Brain,
} from "lucide-react";
import { GamesHub } from "./games";

// Progress Circle Component
const ProgressCircle = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "emerald",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    emerald: "stroke-emerald-500",
    teal: "stroke-teal-500",
    blue: "stroke-blue-500",
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-emerald-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={colorClasses[color]}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1s ease-in-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-slate-700">{percentage}%</span>
      </div>
    </div>
  );
};

// Subject Card Component
const SubjectCard = ({ subject, grade, progress, color = "emerald" }) => {
  const colorClasses = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    teal: "bg-teal-50 border-teal-200 text-teal-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div className="bg-white rounded-xl border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}
        >
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-800">{grade}</div>
          <div className="text-sm text-slate-600">Grade</div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-3">{subject}</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Progress</span>
          <span className="text-slate-800 font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-emerald-100 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! How are you feeling ? ",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = { id: Date.now(), text: inputValue, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      const input = inputValue;
      setInputValue("");

      try {
        const response = await fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });

        const data = await response.json();
        console.log("API response:", data);

        const sentiment = data.sentiment || "Unknown"; // fallback for safety

        const botMessage = {
          id: Date.now() + 1,
          text: `Sentiment: ${sentiment}`,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage = {
          id: Date.now() + 2,
          text: "Oops! Something went wrong with the server.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold">Study Assistant</h3>
                <p className="text-xs opacity-90">Online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                    message.sender === "user"
                      ? "bg-emerald-500 text-white"
                      : "bg-emerald-50 text-slate-800 border border-emerald-100"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-emerald-100">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="How are you feeling?"
                className="flex-1 px-3 py-2 border border-emerald-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    </div>
  );
};

// Main Student Report Component
const StudentReport = () => {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [csvStudentData, setCsvStudentData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGames, setShowGames] = useState(false);

  // If no user is logged in, redirect to login
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Fetch CSV student data when user data is available
  useEffect(() => {
    const fetchStudentData = async () => {
      if (userData && userData.email) {
        try {
          setLoading(true);
          // Try to find student by email or roll number
          const result = await getStudentByIdentifier(userData.email);

          if (result.success) {
            setCsvStudentData(result.data);
            const analyticsData = calculateStudentAnalytics(result.data);
            setAnalytics(analyticsData);
          } else {
            // If not found in CSV data, use default userData
            console.log("Student not found in CSV data, using default data");
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [userData]);

  // Show loading if user data is not yet available
  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Use CSV data if available, otherwise fall back to userData
  const studentData = csvStudentData || userData;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header with Logout */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-emerald-800">
                  Student Dashboard
                </h1>
                <p className="text-xs text-emerald-600">
                  Welcome back, {studentData.firstname || "Student"}!
                </p>
              </div>
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
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Student Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {studentData.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {studentData.fullName ||
                    `${studentData.firstname} ${studentData.lastname}` ||
                    "Student"}
                </h2>
                <p className="text-emerald-600 font-medium">
                  {studentData.class}
                </p>
                <p className="text-slate-600 text-sm">
                  ID: {studentData.studentId}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="text-center">
                <ProgressCircle
                  percentage={Math.round(studentData.overallGPA * 25)}
                  color="emerald"
                />
                <div className="mt-3">
                  <div className="text-lg font-semibold text-slate-800">
                    Overall GPA
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {studentData.overallGPA}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-slate-800">Attendance</span>
                </div>
                <span className="text-xl font-bold text-emerald-600">
                  {studentData.attendance}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl border border-teal-100">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-teal-600" />
                  <span className="font-medium text-slate-800">Rank</span>
                </div>
                <span className="text-xl font-bold text-teal-600">3rd</span>
              </div>
            </div>
          </div>
        </div>

        {/* CSV Assessment Data Section - Only show if we have CSV data */}
        {csvStudentData && analytics && (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                Assessment Performance
              </h2>
            </div>

            {/* Overall Performance Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {csvStudentData.totalScore}
                </div>
                <div className="text-sm text-blue-700">Total Score</div>
                <div className="text-xs text-gray-600">
                  out of {csvStudentData.totalMarks}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {csvStudentData.totalPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-green-700">Percentage</div>
                <div className="text-xs text-gray-600">Overall Performance</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.overallAnalytics.grade}
                </div>
                <div className="text-sm text-purple-700">Grade</div>
                <div className="text-xs text-gray-600">Performance Level</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {analytics.overallAnalytics.rank}
                </div>
                <div className="text-sm text-orange-700">Rank</div>
                <div className="text-xs text-gray-600">Class Position</div>
              </div>
            </div>

            {/* Question-wise Performance */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Question-wise Performance
              </h3>
              <div className="grid md:grid-cols-5 gap-4">
                {analytics.questionAnalysis.map((question, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 text-center"
                  >
                    <div className="text-lg font-bold text-gray-800">
                      {question.question}
                    </div>
                    <div className="text-2xl font-bold text-blue-600 my-2">
                      {question.score}/4
                    </div>
                    <div className="text-xs text-gray-600">
                      {question.percentage.toFixed(0)}%
                    </div>
                    <div
                      className={`text-xs mt-1 px-2 py-1 rounded-full ${
                        question.performance === "Excellent"
                          ? "bg-green-100 text-green-800"
                          : question.performance === "Good"
                          ? "bg-blue-100 text-blue-800"
                          : question.performance === "Average"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {question.performance}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject-wise Performance */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Subject-wise Performance
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analytics.subjectAnalysis.map((subject, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-800">
                        {subject.subject}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          subject.grade.startsWith("A")
                            ? "bg-green-100 text-green-800"
                            : subject.grade.startsWith("B")
                            ? "bg-blue-100 text-blue-800"
                            : subject.grade.startsWith("C")
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {subject.grade}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Score:</span>
                        <span className="font-medium">
                          {subject.score}/{subject.maxScore}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Percentage:</span>
                        <span className="font-medium">
                          {subject.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${subject.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-emerald-600">↗</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Performance
            </h3>
            <p className="text-3xl font-bold text-slate-800">Excellent</p>
            <p className="text-sm text-slate-600 mt-2">
              Above average in 5/6 subjects
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-2xl font-bold text-teal-600">88%</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Goal Progress
            </h3>
            <p className="text-3xl font-bold text-slate-800">On Track</p>
            <p className="text-sm text-slate-600 mt-2">
              Semester goals 88% complete
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">42h</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Study Hours
            </h3>
            <p className="text-3xl font-bold text-slate-800">This Week</p>
            <p className="text-sm text-slate-600 mt-2">6h above average</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-emerald-600">3</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Achievements
            </h3>
            <p className="text-3xl font-bold text-slate-800">New</p>
            <p className="text-sm text-slate-600 mt-2">Earned this semester</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300 cursor-pointer" onClick={() => setShowGames(true)}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-purple-600">🎮</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Educational Games
            </h3>
            <p className="text-3xl font-bold text-slate-800">Play</p>
            <p className="text-sm text-slate-600 mt-2">Improve your IQ & skills</p>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Subject Performance
            </h2>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <BarChart3 className="w-4 h-4" />
              <span>Current Semester</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentData.subjects.map((subject, index) => (
              <SubjectCard key={index} {...subject} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Recent Achievements
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Dean's List Recognition
                </h3>
                <p className="text-sm text-slate-600">
                  Achieved for outstanding academic performance
                </p>
              </div>
              <div className="text-sm text-emerald-600 font-medium">
                2 days ago
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Perfect Attendance Award
                </h3>
                <p className="text-sm text-slate-600">
                  No absences for the past month
                </p>
              </div>
              <div className="text-sm text-teal-600 font-medium">
                1 week ago
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Science Fair Winner
                </h3>
                <p className="text-sm text-slate-600">
                  1st place in school science competition
                </p>
              </div>
              <div className="text-sm text-blue-600 font-medium">
                2 weeks ago
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Hub */}
      {showGames && (
        <GamesHub 
          onBack={() => setShowGames(false)}
          userRole="student"
        />
      )}

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default StudentReport;
