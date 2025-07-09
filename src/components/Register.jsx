import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log("user:", user);
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          firstname: fname,
          lastname: lname,
          role: role,
          // Add some default academic data for new students
          class: "Grade 10-A",
          gpa: 3.5 + Math.random() * 1, // Random GPA between 3.5-4.5
          attendance: 85 + Math.floor(Math.random() * 15), // Random attendance 85-99%
          subjects: [
            {
              name: "Mathematics",
              grade: "A-",
              progress: 85 + Math.floor(Math.random() * 15),
              color: "emerald",
            },
            {
              name: "English Literature",
              grade: "A",
              progress: 85 + Math.floor(Math.random() * 15),
              color: "teal",
            },
            {
              name: "Science",
              grade: "B+",
              progress: 80 + Math.floor(Math.random() * 20),
              color: "blue",
            },
            {
              name: "History",
              grade: "A-",
              progress: 85 + Math.floor(Math.random() * 15),
              color: "emerald",
            },
            {
              name: "Art",
              grade: "A",
              progress: 90 + Math.floor(Math.random() * 10),
              color: "teal",
            },
            {
              name: "Physical Education",
              grade: "B",
              progress: 75 + Math.floor(Math.random() * 20),
              color: "blue",
            },
          ],
          createdAt: new Date().toISOString(),
        });
        setEmail("");
        setFname("");
        setLname("");
        setPassword("");

        toast.success("User registered successfully", {
          position: "top-right",
        });

        // Navigate to dashboard which will auto-redirect based on role
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000); // Wait 2 seconds to show the success message
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 transform transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join us and start your journey today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                  placeholder="Enter your first name"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  required
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                  placeholder="Enter your last name"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Role *
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400 appearance-none cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600 mb-1">
                    Password strength
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        password.length < 6
                          ? "w-1/4 bg-red-500"
                          : password.length < 8
                          ? "w-2/4 bg-yellow-500"
                          : password.length < 12
                          ? "w-3/4 bg-blue-500"
                          : "w-full bg-green-500"
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <NavLink
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline"
              >
                Sign in to your account
              </NavLink>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>By creating an account, you agree to our</p>
          <div className="space-x-4 mt-2">
            <p className="inline text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
              Terms of Service
            </p>
            <span>•</span>
            <p className="inline text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
              Privacy Policy
            </p>
          </div>
        </div>
      </div>
      {/* Toast Container - REQUIRED for toasts to show */}
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
export default Register;
