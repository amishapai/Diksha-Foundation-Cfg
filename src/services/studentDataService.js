import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc,
  query, 
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from '../components/firebase';

// Import complete student data from CSV
export const importCompleteStudentData = async (csvData) => {
  try {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const batch = writeBatch(db);
    let importCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const studentData = {};
      
      headers.forEach((header, index) => {
        studentData[header] = values[index] || '';
      });

      // Create structured student record
      const structuredData = {
        rollNo: studentData['Roll No'],
        firstname: studentData['First name'],
        lastname: studentData['Last name'] || '',
        age: parseInt(studentData['DOB /Age']) || 0,
        grade: parseInt(studentData['Grade']) || 0,
        gradeLL: parseInt(studentData['Grade LL']) || 0,
        section: studentData['Section'],
        mandal: studentData['Mandal'],
        villageName: studentData['Village Name'],
        gender: studentData['Gender (M/F)'],
        center: studentData['Center'],
        centerName: studentData['Center_Name'],
        
        // Assessment scores
        assessmentScores: {
          Q1: parseInt(studentData['Q1']) || 0,
          Q2: parseInt(studentData['Q2']) || 0,
          Q3: parseInt(studentData['Q3']) || 0,
          Q4: parseInt(studentData['Q4']) || 0,
          Q5: parseInt(studentData['Q5']) || 0,
          Q6: parseInt(studentData['Q6']) || 0,
          Q7: parseInt(studentData['Q7']) || 0,
          Q8: parseInt(studentData['Q8']) || 0,
          Q9: parseInt(studentData['Q9']) || 0,
          Q10: parseInt(studentData['Q10']) || 0,
        },
        
        // Performance metrics
        totalScore: parseInt(studentData['Total Score']) || 0,
        totalMarks: parseInt(studentData['Total Marks']) || 30,
        totalPercentage: parseFloat(studentData['Total %']) || 0,
        
        // Generate email for login (you can modify this logic)
        email: `${studentData['First name'].toLowerCase()}.${studentData['Roll No'].toLowerCase()}@school.edu`,
        
        // Additional computed fields
        fullName: `${studentData['First name']} ${studentData['Last name']}`.trim(),
        studentId: studentData['Roll No'],
        class: `Grade ${studentData['Grade']}-${studentData['Section']}`,
        
        // Role and metadata
        role: 'student',
        dataSource: 'complete_student_data_csv',
        importedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      // Add to batch
      const docRef = doc(collection(db, 'complete_students'));
      batch.set(docRef, structuredData);
      importCount++;
    }

    await batch.commit();
    return { success: true, count: importCount };
  } catch (error) {
    console.error('Error importing complete student data:', error);
    return { success: false, error: error.message };
  }
};

// Get student by roll number or email
export const getStudentByIdentifier = async (identifier) => {
  try {
    // Try to find by roll number first
    let q = query(
      collection(db, 'complete_students'),
      where('rollNo', '==', identifier)
    );
    
    let querySnapshot = await getDocs(q);
    
    // If not found by roll number, try by email
    if (querySnapshot.empty) {
      q = query(
        collection(db, 'complete_students'),
        where('email', '==', identifier)
      );
      querySnapshot = await getDocs(q);
    }
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { 
        success: true, 
        data: { id: doc.id, ...doc.data() } 
      };
    } else {
      return { success: false, error: 'Student not found' };
    }
  } catch (error) {
    console.error('Error getting student:', error);
    return { success: false, error: error.message };
  }
};

// Get all students from complete data
export const getAllCompleteStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'complete_students'));
    const students = [];
    
    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: students };
  } catch (error) {
    console.error('Error getting all students:', error);
    return { success: false, error: error.message };
  }
};

// Get students by center
export const getStudentsByCenter = async (center) => {
  try {
    const q = query(
      collection(db, 'complete_students'),
      where('center', '==', center)
    );
    
    const querySnapshot = await getDocs(q);
    const students = [];
    
    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: students };
  } catch (error) {
    console.error('Error getting students by center:', error);
    return { success: false, error: error.message };
  }
};

// Calculate performance analytics
export const calculateStudentAnalytics = (studentData) => {
  const { assessmentScores, totalScore, totalMarks, totalPercentage } = studentData;
  
  // Question-wise performance
  const questionAnalysis = Object.entries(assessmentScores).map(([question, score]) => ({
    question,
    score,
    maxScore: 4, // Assuming max score per question is 4
    percentage: (score / 4) * 100,
    performance: score >= 3 ? 'Excellent' : score >= 2 ? 'Good' : score >= 1 ? 'Average' : 'Needs Improvement'
  }));
  
  // Subject categorization (you can customize this based on your curriculum)
  const subjectMapping = {
    Q1: 'Mathematics',
    Q2: 'Science', 
    Q3: 'English',
    Q4: 'Social Studies',
    Q5: 'Mathematics',
    Q6: 'Science',
    Q7: 'English', 
    Q8: 'Social Studies',
    Q9: 'General Knowledge',
    Q10: 'Logical Reasoning'
  };
  
  // Subject-wise performance
  const subjectPerformance = {};
  Object.entries(assessmentScores).forEach(([question, score]) => {
    const subject = subjectMapping[question];
    if (!subjectPerformance[subject]) {
      subjectPerformance[subject] = { totalScore: 0, totalQuestions: 0 };
    }
    subjectPerformance[subject].totalScore += score;
    subjectPerformance[subject].totalQuestions += 1;
  });
  
  const subjectAnalysis = Object.entries(subjectPerformance).map(([subject, data]) => ({
    subject,
    score: data.totalScore,
    maxScore: data.totalQuestions * 4,
    percentage: (data.totalScore / (data.totalQuestions * 4)) * 100,
    grade: getGradeFromPercentage((data.totalScore / (data.totalQuestions * 4)) * 100)
  }));
  
  // Overall performance metrics
  const overallAnalytics = {
    totalScore,
    totalMarks,
    percentage: totalPercentage,
    grade: getGradeFromPercentage(totalPercentage),
    rank: calculateRank(totalPercentage), // You can implement ranking logic
    strengths: questionAnalysis.filter(q => q.score >= 3).map(q => subjectMapping[q.question]),
    improvements: questionAnalysis.filter(q => q.score <= 1).map(q => subjectMapping[q.question])
  };
  
  return {
    questionAnalysis,
    subjectAnalysis,
    overallAnalytics
  };
};

// Helper function to get grade from percentage
const getGradeFromPercentage = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  return 'D';
};

// Helper function to calculate rank (simplified)
const calculateRank = (percentage) => {
  if (percentage >= 90) return 'Top 10%';
  if (percentage >= 75) return 'Top 25%';
  if (percentage >= 50) return 'Top 50%';
  return 'Below Average';
};

export default {
  importCompleteStudentData,
  getStudentByIdentifier,
  getAllCompleteStudents,
  getStudentsByCenter,
  calculateStudentAnalytics
};
