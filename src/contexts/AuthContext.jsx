import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../components/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch additional user data from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const firestoreData = userDocSnap.data();
            setUserData({
              uid: user.uid,
              email: user.email,
              firstname: firestoreData.firstname || '',
              lastname: firestoreData.lastname || '',
              role: firestoreData.role || 'student',
              fullName: `${firestoreData.firstname || ''} ${firestoreData.lastname || ''}`.trim(),
              avatar: `${firestoreData.firstname?.[0] || ''}${firestoreData.lastname?.[0] || ''}`.toUpperCase(),
              // Add default student data - this could come from a separate collection
              studentId: `STU${user.uid.slice(-6).toUpperCase()}`,
              class: firestoreData.class || "Grade 10-A",
              semester: "Fall 2024",
              overallGPA: firestoreData.gpa || 3.7,
              attendance: firestoreData.attendance || 92,
              subjects: firestoreData.subjects || [
                { name: "Mathematics", grade: "A-", progress: 88, color: "emerald" },
                { name: "English Literature", grade: "A", progress: 94, color: "teal" },
                { name: "Science", grade: "B+", progress: 82, color: "blue" },
                { name: "History", grade: "A-", progress: 89, color: "emerald" },
                { name: "Art", grade: "A", progress: 96, color: "teal" },
                { name: "Physical Education", grade: "B", progress: 78, color: "blue" },
              ]
            });
          } else {
            // If no additional data exists, create basic user data
            setUserData({
              uid: user.uid,
              email: user.email,
              firstname: '',
              lastname: '',
              role: 'student',
              fullName: user.email.split('@')[0], // Use email prefix as fallback
              avatar: user.email[0].toUpperCase(),
              studentId: `STU${user.uid.slice(-6).toUpperCase()}`,
              class: "Grade 10-A",
              semester: "Fall 2024",
              overallGPA: 3.7,
              attendance: 92,
              subjects: [
                { name: "Mathematics", grade: "A-", progress: 88, color: "emerald" },
                { name: "English Literature", grade: "A", progress: 94, color: "teal" },
                { name: "Science", grade: "B+", progress: 82, color: "blue" },
                { name: "History", grade: "A-", progress: 89, color: "emerald" },
                { name: "Art", grade: "A", progress: 96, color: "teal" },
                { name: "Physical Education", grade: "B", progress: 78, color: "blue" },
              ]
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
