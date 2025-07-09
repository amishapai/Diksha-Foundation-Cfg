#!/usr/bin/env python3
"""
Excel to CSV Converter for School Management System
Converts your existing Excel files to the required CSV format for import
"""

import pandas as pd
import os
import sys

def convert_students_data(excel_file, output_file):
    """Convert Excel file to students CSV format"""
    try:
        # Read Excel file
        df = pd.read_excel(excel_file)
        
        # Map your columns to required format
        # Adjust these column mappings based on your Excel structure
        column_mapping = {
            'First Name': 'firstname',
            'Last Name': 'lastname', 
            'Email': 'email',
            'Class': 'class',
            'GPA': 'gpa',
            'Attendance': 'attendance'
        }
        
        # Rename columns
        df_mapped = df.rename(columns=column_mapping)
        
        # Select only required columns
        required_columns = ['firstname', 'lastname', 'email', 'class', 'gpa', 'attendance']
        df_final = df_mapped[required_columns]
        
        # Clean data
        df_final['gpa'] = pd.to_numeric(df_final['gpa'], errors='coerce').fillna(3.0)
        df_final['attendance'] = pd.to_numeric(df_final['attendance'], errors='coerce').fillna(90)
        
        # Save to CSV
        df_final.to_csv(output_file, index=False)
        print(f"✅ Students data converted: {output_file}")
        print(f"📊 Records: {len(df_final)}")
        
    except Exception as e:
        print(f"❌ Error converting students data: {e}")

def convert_attendance_data(excel_file, output_file):
    """Convert Excel file to attendance CSV format"""
    try:
        df = pd.read_excel(excel_file)
        
        # Map your columns to required format
        column_mapping = {
            'Student ID': 'student_id',
            'Date': 'date',
            'Status': 'status',
            'Remarks': 'remarks'
        }
        
        df_mapped = df.rename(columns=column_mapping)
        required_columns = ['student_id', 'date', 'status', 'remarks']
        df_final = df_mapped[required_columns]
        
        # Format date
        df_final['date'] = pd.to_datetime(df_final['date']).dt.strftime('%Y-%m-%d')
        df_final['status'] = df_final['status'].fillna('Present')
        df_final['remarks'] = df_final['remarks'].fillna('On time')
        
        df_final.to_csv(output_file, index=False)
        print(f"✅ Attendance data converted: {output_file}")
        print(f"📊 Records: {len(df_final)}")
        
    except Exception as e:
        print(f"❌ Error converting attendance data: {e}")

def convert_grades_data(excel_file, output_file):
    """Convert Excel file to grades CSV format"""
    try:
        df = pd.read_excel(excel_file)
        
        column_mapping = {
            'Student ID': 'student_id',
            'Subject': 'subject',
            'Grade': 'grade',
            'Marks': 'marks',
            'Date': 'date'
        }
        
        df_mapped = df.rename(columns=column_mapping)
        required_columns = ['student_id', 'subject', 'grade', 'marks', 'date']
        df_final = df_mapped[required_columns]
        
        # Format date
        df_final['date'] = pd.to_datetime(df_final['date']).dt.strftime('%Y-%m-%d')
        df_final['marks'] = pd.to_numeric(df_final['marks'], errors='coerce').fillna(0)
        
        df_final.to_csv(output_file, index=False)
        print(f"✅ Grades data converted: {output_file}")
        print(f"📊 Records: {len(df_final)}")
        
    except Exception as e:
        print(f"❌ Error converting grades data: {e}")

def main():
    """Main conversion function"""
    print("🔄 Excel to CSV Converter for School Management System")
    print("=" * 60)
    
    # Check if charts directory exists
    charts_dir = "charts/datasets"
    if not os.path.exists(charts_dir):
        print(f"❌ Directory not found: {charts_dir}")
        return
    
    # Create output directory
    output_dir = "converted_data"
    os.makedirs(output_dir, exist_ok=True)
    
    # Convert each Excel file
    excel_files = [
        "khan_academy_combined_2025.xlsx",
        "khan_activity.xlsx", 
        "complete_data_with_assessments.xlsx"
    ]
    
    for excel_file in excel_files:
        file_path = os.path.join(charts_dir, excel_file)
        
        if os.path.exists(file_path):
            print(f"\n📁 Processing: {excel_file}")
            
            # Determine conversion type based on filename
            if "combined" in excel_file.lower():
                output_file = os.path.join(output_dir, "students_converted.csv")
                convert_students_data(file_path, output_file)
                
            elif "activity" in excel_file.lower():
                output_file = os.path.join(output_dir, "attendance_converted.csv")
                convert_attendance_data(file_path, output_file)
                
            elif "assessments" in excel_file.lower():
                output_file = os.path.join(output_dir, "grades_converted.csv")
                convert_grades_data(file_path, output_file)
        else:
            print(f"⚠️  File not found: {file_path}")
    
    print("\n" + "=" * 60)
    print("🎉 Conversion completed!")
    print(f"📂 Check the '{output_dir}' folder for converted CSV files")
    print("\n📋 Next steps:")
    print("1. Review the converted CSV files")
    print("2. Go to http://localhost:5174/admin")
    print("3. Use the 'Import Data' feature")
    print("4. Upload the converted CSV files")

if __name__ == "__main__":
    # Check if pandas is installed
    try:
        import pandas as pd
    except ImportError:
        print("❌ pandas not installed. Install with: pip install pandas openpyxl")
        sys.exit(1)
    
    main()
