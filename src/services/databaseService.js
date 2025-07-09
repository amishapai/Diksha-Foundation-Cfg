import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  writeBatch
} from 'firebase/firestore';
import { db } from '../components/firebase';

// Database Collections
export const COLLECTIONS = {
  USERS: 'users',
  STUDENTS: 'students',
  ATTENDANCE: 'attendance',
  GRADES: 'grades',
  SUBJECTS: 'subjects',
  CLASSES: 'classes',
  ASSESSMENTS: 'assessments',
  REPORTS: 'reports'
};

// User Management
export const userService = {
  // Create new user
  async createUser(userData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Error getting user:', error);
      return { success: false, error: error.message };
    }
  },

  // Update user
  async updateUser(userId, updateData) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: users };
    } catch (error) {
      console.error('Error getting users:', error);
      return { success: false, error: error.message };
    }
  }
};

// Student Management
export const studentService = {
  // Create student profile
  async createStudent(studentData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.STUDENTS), {
        ...studentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating student:', error);
      return { success: false, error: error.message };
    }
  },

  // Get students by class
  async getStudentsByClass(className) {
    try {
      const q = query(
        collection(db, COLLECTIONS.STUDENTS),
        where('class', '==', className),
        orderBy('lastname')
      );
      const querySnapshot = await getDocs(q);
      const students = [];
      querySnapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: students };
    } catch (error) {
      console.error('Error getting students by class:', error);
      return { success: false, error: error.message };
    }
  }
};

// Attendance Management
export const attendanceService = {
  // Record attendance
  async recordAttendance(attendanceData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ATTENDANCE), {
        ...attendanceData,
        recordedAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error recording attendance:', error);
      return { success: false, error: error.message };
    }
  },

  // Get attendance by student
  async getAttendanceByStudent(studentId, startDate, endDate) {
    try {
      let q = query(
        collection(db, COLLECTIONS.ATTENDANCE),
        where('studentId', '==', studentId),
        orderBy('date', 'desc')
      );

      if (startDate && endDate) {
        q = query(q, where('date', '>=', startDate), where('date', '<=', endDate));
      }

      const querySnapshot = await getDocs(q);
      const attendance = [];
      querySnapshot.forEach((doc) => {
        attendance.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: attendance };
    } catch (error) {
      console.error('Error getting attendance:', error);
      return { success: false, error: error.message };
    }
  },

  // Bulk import attendance
  async bulkImportAttendance(attendanceRecords) {
    try {
      const batch = writeBatch(db);
      
      attendanceRecords.forEach((record) => {
        const docRef = doc(collection(db, COLLECTIONS.ATTENDANCE));
        batch.set(docRef, {
          ...record,
          importedAt: new Date().toISOString()
        });
      });

      await batch.commit();
      return { success: true, count: attendanceRecords.length };
    } catch (error) {
      console.error('Error bulk importing attendance:', error);
      return { success: false, error: error.message };
    }
  }
};

// Grades Management
export const gradesService = {
  // Add grade
  async addGrade(gradeData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.GRADES), {
        ...gradeData,
        createdAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding grade:', error);
      return { success: false, error: error.message };
    }
  },

  // Get grades by student
  async getGradesByStudent(studentId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.GRADES),
        where('studentId', '==', studentId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const grades = [];
      querySnapshot.forEach((doc) => {
        grades.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: grades };
    } catch (error) {
      console.error('Error getting grades:', error);
      return { success: false, error: error.message };
    }
  },

  // Bulk import grades
  async bulkImportGrades(gradesRecords) {
    try {
      const batch = writeBatch(db);
      
      gradesRecords.forEach((record) => {
        const docRef = doc(collection(db, COLLECTIONS.GRADES));
        batch.set(docRef, {
          ...record,
          importedAt: new Date().toISOString()
        });
      });

      await batch.commit();
      return { success: true, count: gradesRecords.length };
    } catch (error) {
      console.error('Error bulk importing grades:', error);
      return { success: false, error: error.message };
    }
  }
};

// Subjects Management
export const subjectsService = {
  // Add subject
  async addSubject(subjectData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.SUBJECTS), {
        ...subjectData,
        createdAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding subject:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all subjects
  async getAllSubjects() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.SUBJECTS));
      const subjects = [];
      querySnapshot.forEach((doc) => {
        subjects.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: subjects };
    } catch (error) {
      console.error('Error getting subjects:', error);
      return { success: false, error: error.message };
    }
  }
};

// CSV Import Utilities
export const csvImportService = {
  // Parse CSV data
  parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }

    return { headers, data };
  },

  // Import students from CSV
  async importStudents(csvData) {
    try {
      const { data } = this.parseCSV(csvData);
      const batch = writeBatch(db);
      
      data.forEach((student) => {
        const docRef = doc(collection(db, COLLECTIONS.USERS));
        batch.set(docRef, {
          firstname: student.firstname || '',
          lastname: student.lastname || '',
          email: student.email || '',
          role: 'student',
          class: student.class || '',
          gpa: parseFloat(student.gpa) || 0,
          attendance: parseInt(student.attendance) || 0,
          createdAt: new Date().toISOString(),
          importedAt: new Date().toISOString()
        });
      });

      await batch.commit();
      return { success: true, count: data.length };
    } catch (error) {
      console.error('Error importing students:', error);
      return { success: false, error: error.message };
    }
  },

  // Import attendance from CSV
  async importAttendance(csvData) {
    try {
      const { data } = this.parseCSV(csvData);
      return await attendanceService.bulkImportAttendance(data);
    } catch (error) {
      console.error('Error importing attendance:', error);
      return { success: false, error: error.message };
    }
  },

  // Import grades from CSV
  async importGrades(csvData) {
    try {
      const { data } = this.parseCSV(csvData);
      return await gradesService.bulkImportGrades(data);
    } catch (error) {
      console.error('Error importing grades:', error);
      return { success: false, error: error.message };
    }
  }
};

// Analytics and Reports
export const analyticsService = {
  // Get class statistics
  async getClassStats(className) {
    try {
      const students = await studentService.getStudentsByClass(className);
      if (!students.success) return students;

      const stats = {
        totalStudents: students.data.length,
        averageGPA: 0,
        averageAttendance: 0,
        topPerformers: [],
        lowPerformers: []
      };

      if (students.data.length > 0) {
        const totalGPA = students.data.reduce((sum, student) => sum + (student.gpa || 0), 0);
        const totalAttendance = students.data.reduce((sum, student) => sum + (student.attendance || 0), 0);
        
        stats.averageGPA = totalGPA / students.data.length;
        stats.averageAttendance = totalAttendance / students.data.length;
        
        // Sort by GPA for top/low performers
        const sortedByGPA = [...students.data].sort((a, b) => (b.gpa || 0) - (a.gpa || 0));
        stats.topPerformers = sortedByGPA.slice(0, 5);
        stats.lowPerformers = sortedByGPA.slice(-5).reverse();
      }

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting class stats:', error);
      return { success: false, error: error.message };
    }
  }
};
