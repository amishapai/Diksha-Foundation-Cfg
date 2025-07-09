// Sample student data
export const students = [
  {
    id: 1,
    name: "Priya Sharma",
    rollNumber: "2024001",
    className: "Class 10A",
    section: "A",
    email: "priya.sharma@school.com",
    phone: "+91 98765 43210",
    parentName: "Rajesh Sharma",
    parentPhone: "+91 98765 43211",
    admissionDate: "2020-06-15"
  },
  {
    id: 2,
    name: "Arjun Patel",
    rollNumber: "2024002",
    className: "Class 10A",
    section: "A",
    email: "arjun.patel@school.com",
    phone: "+91 98765 43212",
    parentName: "Meera Patel",
    parentPhone: "+91 98765 43213",
    admissionDate: "2020-06-15"
  },
  {
    id: 3,
    name: "Zara Khan",
    rollNumber: "2024003",
    className: "Class 10B",
    section: "B",
    email: "zara.khan@school.com",
    phone: "+91 98765 43214",
    parentName: "Ahmed Khan",
    parentPhone: "+91 98765 43215",
    admissionDate: "2020-06-15"
  },
  {
    id: 4,
    name: "Rahul Verma",
    rollNumber: "2024004",
    className: "Class 10A",
    section: "A",
    email: "rahul.verma@school.com",
    phone: "+91 98765 43216",
    parentName: "Sunita Verma",
    parentPhone: "+91 98765 43217",
    admissionDate: "2020-06-15"
  },
  {
    id: 5,
    name: "Ananya Reddy",
    rollNumber: "2024005",
    className: "Class 10B",
    section: "B",
    email: "ananya.reddy@school.com",
    phone: "+91 98765 43218",
    parentName: "Krishna Reddy",
    parentPhone: "+91 98765 43219",
    admissionDate: "2020-06-15"
  },
  {
    id: 6,
    name: "Vikram Singh",
    rollNumber: "2024006",
    className: "Class 10A",
    section: "A",
    email: "vikram.singh@school.com",
    phone: "+91 98765 43220",
    parentName: "Gurpreet Singh",
    parentPhone: "+91 98765 43221",
    admissionDate: "2020-06-15"
  },
  {
    id: 7,
    name: "Meera Joshi",
    rollNumber: "2024007",
    className: "Class 10B",
    section: "B",
    email: "meera.joshi@school.com",
    phone: "+91 98765 43222",
    parentName: "Ramesh Joshi",
    parentPhone: "+91 98765 43223",
    admissionDate: "2020-06-15"
  },
  {
    id: 8,
    name: "Aditya Kumar",
    rollNumber: "2024008",
    className: "Class 10A",
    section: "A",
    email: "aditya.kumar@school.com",
    phone: "+91 98765 43224",
    parentName: "Suresh Kumar",
    parentPhone: "+91 98765 43225",
    admissionDate: "2020-06-15"
  }
];

// Sample academic records
export const academicRecords = [
  // Priya Sharma's records
  {
    id: 1,
    studentId: 1,
    examDate: "2024-01-15",
    examType: "midterm",
    overallPercentage: 95.8,
    subjects: [
      { name: "Mathematics", marks: 95, totalMarks: 100, percentage: 95 },
      { name: "English", marks: 98, totalMarks: 100, percentage: 98 },
      { name: "Science", marks: 92, totalMarks: 100, percentage: 92 },
      { name: "Social Science", marks: 96, totalMarks: 100, percentage: 96 },
      { name: "Hindi", marks: 94, totalMarks: 100, percentage: 94 }
    ]
  },
  {
    id: 2,
    studentId: 1,
    examDate: "2024-02-20",
    examType: "final",
    overallPercentage: 97.2,
    subjects: [
      { name: "Mathematics", marks: 98, totalMarks: 100, percentage: 98 },
      { name: "English", marks: 96, totalMarks: 100, percentage: 96 },
      { name: "Science", marks: 95, totalMarks: 100, percentage: 95 },
      { name: "Social Science", marks: 98, totalMarks: 100, percentage: 98 },
      { name: "Hindi", marks: 97, totalMarks: 100, percentage: 97 }
    ]
  },

  // Arjun Patel's records
  {
    id: 3,
    studentId: 2,
    examDate: "2024-01-15",
    examType: "midterm",
    overallPercentage: 94.2,
    subjects: [
      { name: "Mathematics", marks: 96, totalMarks: 100, percentage: 96 },
      { name: "English", marks: 92, totalMarks: 100, percentage: 92 },
      { name: "Science", marks: 94, totalMarks: 100, percentage: 94 },
      { name: "Social Science", marks: 95, totalMarks: 100, percentage: 95 },
      { name: "Hindi", marks: 92, totalMarks: 100, percentage: 92 }
    ]
  },
  {
    id: 4,
    studentId: 2,
    examDate: "2024-02-20",
    examType: "final",
    overallPercentage: 95.6,
    subjects: [
      { name: "Mathematics", marks: 97, totalMarks: 100, percentage: 97 },
      { name: "English", marks: 94, totalMarks: 100, percentage: 94 },
      { name: "Science", marks: 95, totalMarks: 100, percentage: 95 },
      { name: "Social Science", marks: 96, totalMarks: 100, percentage: 96 },
      { name: "Hindi", marks: 96, totalMarks: 100, percentage: 96 }
    ]
  },

  // Zara Khan's records
  {
    id: 5,
    studentId: 3,
    examDate: "2024-01-15",
    examType: "midterm",
    overallPercentage: 92.7,
    subjects: [
      { name: "Mathematics", marks: 90, totalMarks: 100, percentage: 90 },
      { name: "English", marks: 95, totalMarks: 100, percentage: 95 },
      { name: "Science", marks: 93, totalMarks: 100, percentage: 93 },
      { name: "Social Science", marks: 94, totalMarks: 100, percentage: 94 },
      { name: "Hindi", marks: 91, totalMarks: 100, percentage: 91 }
    ]
  },
  {
    id: 6,
    studentId: 3,
    examDate: "2024-02-20",
    examType: "final",
    overallPercentage: 96.2,
    subjects: [
      { name: "Mathematics", marks: 95, totalMarks: 100, percentage: 95 },
      { name: "English", marks: 98, totalMarks: 100, percentage: 98 },
      { name: "Science", marks: 96, totalMarks: 100, percentage: 96 },
      { name: "Social Science", marks: 97, totalMarks: 100, percentage: 97 },
      { name: "Hindi", marks: 95, totalMarks: 100, percentage: 95 }
    ]
  },

  // Rahul Verma's records
  {
    id: 7,
    studentId: 4,
    examDate: "2024-01-15",
    examType: "midterm",
    overallPercentage: 91.5,
    subjects: [
      { name: "Mathematics", marks: 88, totalMarks: 100, percentage: 88 },
      { name: "English", marks: 94, totalMarks: 100, percentage: 94 },
      { name: "Science", marks: 92, totalMarks: 100, percentage: 92 },
      { name: "Social Science", marks: 93, totalMarks: 100, percentage: 93 },
      { name: "Hindi", marks: 90, totalMarks: 100, percentage: 90 }
    ]
  },
  {
    id: 8,
    studentId: 4,
    examDate: "2024-02-20",
    examType: "final",
    overallPercentage: 93.8,
    subjects: [
      { name: "Mathematics", marks: 92, totalMarks: 100, percentage: 92 },
      { name: "English", marks: 95, totalMarks: 100, percentage: 95 },
      { name: "Science", marks: 94, totalMarks: 100, percentage: 94 },
      { name: "Social Science", marks: 95, totalMarks: 100, percentage: 95 },
      { name: "Hindi", marks: 93, totalMarks: 100, percentage: 93 }
    ]
  },

  // Ananya Reddy's records
  {
    id: 9,
    studentId: 5,
    examDate: "2024-01-15",
    examType: "midterm",
    overallPercentage: 90.3,
    subjects: [
      { name: "Mathematics", marks: 88, totalMarks: 100, percentage: 88 },
      { name: "English", marks: 92, totalMarks: 100, percentage: 92 },
      { name: "Science", marks: 89, totalMarks: 100, percentage: 89 },
      { name: "Social Science", marks: 91, totalMarks: 100, percentage: 91 },
      { name: "Hindi", marks: 91, totalMarks: 100, percentage: 91 }
    ]
  },
  {
    id: 10,
    studentId: 5,
    examDate: "2024-02-20",
    examType: "final",
    overallPercentage: 94.1,
    subjects: [
      { name: "Mathematics", marks: 92, totalMarks: 100, percentage: 92 },
      { name: "English", marks: 96, totalMarks: 100, percentage: 96 },
      { name: "Science", marks: 93, totalMarks: 100, percentage: 93 },
      { name: "Social Science", marks: 95, totalMarks: 100, percentage: 95 },
      { name: "Hindi", marks: 94, totalMarks: 100, percentage: 94 }
    ]
  },

  // Vikram Singh's records
  {
    id: 11,
    studentId: 6,
    examDate: "2024-01-15",
    examType: "midterm",
    overallPercentage: 88.7,
    subjects: [
      { name: "Mathematics", marks: 85, totalMarks: 100, percentage: 85 },
      { name: "English", marks: 90, totalMarks: 100, percentage: 90 },
      { name: "Science", marks: 88, totalMarks: 100, percentage: 88 },
      { name: "Social Science", marks: 89, totalMarks: 100, percentage: 89 },
      { name: "Hindi", marks: 89, totalMarks: 100, percentage: 89 }
    ]
  },
  {
    id: 12,
    studentId: 6,
    examDate: "2024-02-20",
    examType: "final",
    overallPercentage: 91.2,
    subjects: [
      { name: "Mathematics", marks: 89, totalMarks: 100, percentage: 89 },
      { name: "English", marks: 93, totalMarks: 100, percentage: 93 },
      { name: "Science", marks: 91, totalMarks: 100, percentage: 91 },
      { name: "Social Science", marks: 92, totalMarks: 100, percentage: 92 },
      { name: "Hindi", marks: 91, totalMarks: 100, percentage: 91 }
    ]
  },

  // Meera Joshi's records
  {
    id: 13,
    studentId: 7,
    examDate: "2024-01-15",
    examType: "midterm",
    overallPercentage: 87.4,
    subjects: [
      { name: "Mathematics", marks: 84, totalMarks: 100, percentage: 84 },
      { name: "English", marks: 89, totalMarks: 100, percentage: 89 },
      { name: "Science", marks: 87, totalMarks: 100, percentage: 87 },
      { name: "Social Science", marks: 88, totalMarks: 100, percentage: 88 },
      { name: "Hindi", marks: 87, totalMarks: 100, percentage: 87 }
    ]
  },
  {
    id: 14,
    studentId: 7,
    examDate: "2024-02-20",
    examType: "final",
    overallPercentage: 89.8,
    subjects: [
      { name: "Mathematics", marks: 87, totalMarks: 100, percentage: 87 },
      { name: "English", marks: 91, totalMarks: 100, percentage: 91 },
      { name: "Science", marks: 89, totalMarks: 100, percentage: 89 },
      { name: "Social Science", marks: 90, totalMarks: 100, percentage: 90 },
      { name: "Hindi", marks: 92, totalMarks: 100, percentage: 92 }
    ]
  },

  // Aditya Kumar's records
  {
    id: 15,
    studentId: 8,
    examDate: "2024-01-15",
    examType: "midterm",
    overallPercentage: 85.6,
    subjects: [
      { name: "Mathematics", marks: 82, totalMarks: 100, percentage: 82 },
      { name: "English", marks: 87, totalMarks: 100, percentage: 87 },
      { name: "Science", marks: 85, totalMarks: 100, percentage: 85 },
      { name: "Social Science", marks: 86, totalMarks: 100, percentage: 86 },
      { name: "Hindi", marks: 88, totalMarks: 100, percentage: 88 }
    ]
  },
  {
    id: 16,
    studentId: 8,
    examDate: "2024-02-20",
    examType: "final",
    overallPercentage: 88.4,
    subjects: [
      { name: "Mathematics", marks: 85, totalMarks: 100, percentage: 85 },
      { name: "English", marks: 89, totalMarks: 100, percentage: 89 },
      { name: "Science", marks: 87, totalMarks: 100, percentage: 87 },
      { name: "Social Science", marks: 88, totalMarks: 100, percentage: 88 },
      { name: "Hindi", marks: 91, totalMarks: 100, percentage: 91 }
    ]
  }
]; 