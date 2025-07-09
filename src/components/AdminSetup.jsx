import React, { useState } from 'react';
import { createAdminUser, DEFAULT_ADMIN, SETUP_INSTRUCTIONS } from '../utils/adminSetup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const AdminSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(DEFAULT_ADMIN);
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const result = await createAdminUser(formData);
      
      if (result.success) {
        toast.success('Admin user created successfully! You can now login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(`Failed to create admin: ${result.error}`);
      }
    } catch (error) {
      toast.error('Error creating admin user');
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            School Management System Setup
          </h1>
          <p className="text-gray-600">
            Create your first admin user to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Setup Instructions */}
          {showInstructions && (
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Setup Instructions</h2>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-3">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">🔧 First Admin User:</h3>
                  <p>Default credentials are pre-filled. Change them after first login!</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">📊 Database Collections:</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>users (students, teachers, admins)</li>
                    <li>attendance (daily records)</li>
                    <li>grades (marks and assessments)</li>
                    <li>subjects (course information)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-1">📁 CSV Import Formats:</h3>
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <p><strong>Students:</strong> firstname,lastname,email,class,gpa,attendance</p>
                    <p><strong>Attendance:</strong> student_id,date,status,remarks</p>
                    <p><strong>Grades:</strong> student_id,subject,grade,marks,date</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-1">🔗 Access URLs:</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Admin Dashboard: /admin</li>
                    <li>Student Dashboard: /student</li>
                    <li>Registration: /register</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Admin Creation Form */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Create Admin User</h2>
            
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 characters. Change this after first login!
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Security Note:</strong> These are default credentials. 
                  Please change them immediately after your first login for security.
                </p>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Admin...
                  </>
                ) : (
                  'Create Admin User'
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Already have an admin account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
