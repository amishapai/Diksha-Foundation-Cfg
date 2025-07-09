# 🗄️ Database Setup Guide

## Overview
This guide will help you set up the complete database system for the School Management System with Firebase Firestore.

## 🚀 Quick Start

### 1. First Time Setup
1. Go to: `http://localhost:5174/setup`
2. Create your first admin user
3. Login with admin credentials
4. Access admin dashboard at: `http://localhost:5174/admin`

### 2. Default Admin Credentials
```
Email: admin@school.edu
Password: admin123456
```
**⚠️ IMPORTANT: Change these credentials after first login!**

## 📊 Database Structure

### Collections Created:

#### 1. **users** - Main user collection
```javascript
{
  id: "auto-generated",
  email: "user@school.edu",
  firstname: "John",
  lastname: "Doe", 
  role: "student|admin|teacher",
  class: "Grade 10-A",
  gpa: 3.8,
  attendance: 95,
  subjects: [...],
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

#### 2. **attendance** - Daily attendance records
```javascript
{
  id: "auto-generated",
  studentId: "STU001",
  date: "2024-01-15",
  status: "Present|Absent|Late",
  remarks: "On time",
  recordedAt: "2024-01-15T09:00:00.000Z"
}
```

#### 3. **grades** - Student grades and marks
```javascript
{
  id: "auto-generated",
  studentId: "STU001",
  subject: "Mathematics",
  grade: "A-",
  marks: 88,
  date: "2024-01-20",
  createdAt: "2024-01-20T10:00:00.000Z"
}
```

#### 4. **subjects** - Course information
```javascript
{
  id: "auto-generated",
  name: "Mathematics",
  code: "MATH101",
  credits: 3,
  teacher: "Dr. Smith",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## 📁 CSV Import Formats

### Students Import
```csv
firstname,lastname,email,class,gpa,attendance
John,Doe,john.doe@school.edu,Grade 10-A,3.8,95
Jane,Smith,jane.smith@school.edu,Grade 10-A,3.9,92
```

### Attendance Import
```csv
student_id,date,status,remarks
STU001,2024-01-15,Present,On time
STU002,2024-01-15,Absent,Sick leave
```

### Grades Import
```csv
student_id,subject,grade,marks,date
STU001,Mathematics,A-,88,2024-01-20
STU001,English,A,92,2024-01-20
```

### Subjects Import
```csv
name,code,credits,teacher
Mathematics,MATH101,3,Dr. Smith
English Literature,ENG101,3,Prof. Johnson
```

## 🔧 Admin Functions

### 1. Student Management
- View all students
- Add/Edit/Delete students
- Search and filter students
- View student statistics

### 2. Data Import
- CSV file upload
- Excel file support (.xlsx, .xls)
- Bulk import with preview
- Error handling and validation

### 3. Analytics
- Class statistics
- Average GPA calculation
- Attendance tracking
- Performance reports

## 🛠️ Using Your Existing Data

### From Excel Files
1. Open your Excel file (khan_academy_combined_2025.xlsx, etc.)
2. Save as CSV format
3. Ensure column headers match our format
4. Use the admin dashboard import feature

### Sample Data Conversion
Your existing files in `charts/datasets/` can be converted:

1. **khan_academy_combined_2025.xlsx** → Students data
2. **khan_activity.xlsx** → Activity/Attendance data
3. **complete_data_with_assessments.xlsx** → Grades/Assessment data

## 📋 Step-by-Step Import Process

### 1. Prepare Your Data
```bash
# Example: Convert your Excel to CSV
# Open Excel file → Save As → CSV (Comma delimited)
```

### 2. Format Headers
Ensure your CSV headers match exactly:
- **Students**: `firstname,lastname,email,class,gpa,attendance`
- **Attendance**: `student_id,date,status,remarks`
- **Grades**: `student_id,subject,grade,marks,date`

### 3. Import via Admin Dashboard
1. Login as admin
2. Go to "Import Data" tab
3. Select import type
4. Upload CSV or paste data
5. Preview and confirm
6. Import data

## 🔐 Security Features

### Role-Based Access
- **Admin**: Full system access
- **Student**: Personal dashboard only
- **Teacher**: Class management (future feature)

### Data Protection
- Firebase Authentication
- Firestore security rules
- Protected routes
- Input validation

## 🚨 Troubleshooting

### Common Issues:

1. **Import Fails**
   - Check CSV format
   - Ensure headers match exactly
   - Remove special characters

2. **Admin Access Denied**
   - Verify user role in database
   - Check authentication status

3. **Data Not Showing**
   - Refresh the page
   - Check browser console for errors
   - Verify Firebase connection

## 📞 Support

### Sample Files Location
Check `sample_data/` folder for example CSV files:
- `students_sample.csv`
- `attendance_sample.csv`
- `grades_sample.csv`

### Database Service Functions
All database operations are in `src/services/databaseService.js`:
- User management
- Data import/export
- Analytics
- CSV parsing

## 🎯 Next Steps

1. **Setup Admin User**: Visit `/setup`
2. **Import Your Data**: Use existing Excel files
3. **Test System**: Create test students
4. **Configure Settings**: Customize for your school
5. **Train Users**: Show teachers/staff how to use

---

**Ready to get started?** Go to `http://localhost:5174/setup` and create your admin user!
