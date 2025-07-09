import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../components/firebase";

// Function to create the first admin user
export const createAdminUser = async (adminData) => {
  try {
    // Create authentication user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      adminData.email, 
      adminData.password
    );
    
    const user = userCredential.user;

    // Create admin document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      firstname: adminData.firstname,
      lastname: adminData.lastname,
      role: "admin",
      createdAt: new Date().toISOString(),
      isFirstAdmin: true,
      permissions: {
        manageUsers: true,
        importData: true,
        viewReports: true,
        manageSystem: true
      }
    });

    console.log("Admin user created successfully:", user.uid);
    return { success: true, userId: user.uid };
  } catch (error) {
    console.error("Error creating admin user:", error);
    return { success: false, error: error.message };
  }
};

// Default admin credentials (change these!)
export const DEFAULT_ADMIN = {
  email: "admin@school.edu",
  password: "admin123456",
  firstname: "System",
  lastname: "Administrator"
};

// Function to check if any admin exists
export const checkAdminExists = async () => {
  try {
    const { getAllUsers } = await import('../services/databaseService');
    const result = await getAllUsers();
    
    if (result.success) {
      const admins = result.data.filter(user => user.role === 'admin');
      return admins.length > 0;
    }
    return false;
  } catch (error) {
    console.error("Error checking admin existence:", error);
    return false;
  }
};

// Setup instructions for first-time use
export const SETUP_INSTRUCTIONS = `
🔧 ADMIN SETUP INSTRUCTIONS

1. First Admin User:
   - Email: admin@school.edu
   - Password: admin123456
   - Change these credentials after first login!

2. Database Collections Created:
   - users (students, teachers, admins)
   - attendance (daily attendance records)
   - grades (student grades and marks)
   - subjects (course information)
   - assessments (tests and assignments)

3. CSV Import Formats:

   Students CSV:
   firstname,lastname,email,class,gpa,attendance
   
   Attendance CSV:
   student_id,date,status,remarks
   
   Grades CSV:
   student_id,subject,grade,marks,date

4. Access URLs:
   - Admin Dashboard: /admin
   - Student Dashboard: /student
   - Registration: /register
   - Login: /login

5. Sample Data:
   Check the sample_data folder for example CSV files
`;

export default {
  createAdminUser,
  checkAdminExists,
  DEFAULT_ADMIN,
  SETUP_INSTRUCTIONS
};
