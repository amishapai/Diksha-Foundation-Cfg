import pandas as pd
import os
from dotenv import load_dotenv
import google.generativeai as genai
from fpdf import FPDF

def generate_health_report(csv_file_path, output_pdf_name="diksha_health_report.pdf"):
    """
    Generate a health report PDF from student data in a CSV file.
    
    Args:
        csv_file_path (str): Path to the CSV file containing student data
        output_pdf_name (str): Name of the output PDF file (default: "diksha_health_report.pdf")
    
    Returns:
        str: Path to the generated PDF file
    """
    # Load environment variables
    load_dotenv()
    
    # Get API key
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    # Configure Gemini
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    # Load CSV file
    try:
        df = pd.read_csv(csv_file_path)
    except FileNotFoundError:
        raise FileNotFoundError(f"CSV file not found: {csv_file_path}")
    except Exception as e:
        raise Exception(f"Error reading CSV file: {e}")
    
    # Select relevant health columns
    required_columns = ["Roll No", "Name of the Student", "Grade", "Height (cm)", "Weight (kg)"]
    
    # Check if all required columns exist
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")
    
    health_df = df[required_columns]
    
    # Convert to JSON
    health_json = health_df.to_json(orient="records", indent=2)
    
    # Generate content using Gemini
    prompt = f"""
You are a admin working for the Diksha Foundation.

Below is the data of students, each with:
- Roll Number
- Name
- Grade
- Height (in cm)
- Weight (in kg)

{health_json}

Your task:

1. Classify each student into the following age group categories:

| Age Group | Expected Height (cm) | Expected Weight (kg) |
|-----------|----------------------|-----------------------|
| 5-7       | 105-120              | 10-16                 |
| 8-10      | 120-135              | 13-22                 |
| 11-13     | 135-150              | 22-35                 |
| 14-16     | 150-165              | 35-50                 |
| 17+       | 165-175              | 45-60                 |

2. Since age is not directly provided, infer age group based on **grade**:
   - Grade 1-2 → 5-7 years
   - Grade 3-5 → 8-10 years
   - Grade 6-7 → 11-13 years
   - Grade 8-10 → 14-16 years
   - Grade 11+ → 17+ years

3. For each student:
   - Classify them into an age group
   - Compare their height and weight against the minimum thresholds for their group
   - Flag students who are below **either** minimum height **or** weight for their age group

4. Generate a clear report with:
   - Detailed summary: number of students falling below health standards. NO TABLES
   - A list listing flagged students with their Name and roll no grouped by their class and center.
   - General suggestions for health interventions (nutrition, referrals, etc.)

Output in structured text format. Give a very detailed summary of the stats. Avoid using markdown format text in answer (no asterisks)
"""
    
    try:
        response = model.generate_content(prompt)
        gemini_text = response.text
    except Exception as e:
        raise Exception(f"Error generating content with Gemini: {e}")
    
    # Generate PDF
    try:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.set_font("Arial", size=12)
        
        # Split long text into lines
        for line in gemini_text.split('\n'):
            pdf.multi_cell(0, 10, line)
        
        pdf.output(output_pdf_name)
        return output_pdf_name
        
    except Exception as e:
        raise Exception(f"Error generating PDF: {e}")

# Example usage
if __name__ == "__main__":
    # For backward compatibility, you can still use the Excel file
    # by converting it to CSV first or modifying the function to accept Excel files
    
    # Example with CSV file:
    # generate_health_report("student_data.csv")
    
    # For the existing Excel file, you can convert it first:
    try:
        # Convert Excel to CSV if needed
        df = pd.read_excel("complete_data.xlsx")
        df.to_csv("complete_data.csv", index=False)
        
        # Generate report
        pdf_path = generate_health_report("complete_data.csv")
        print(f"Health report generated successfully: {pdf_path}")
        
    except Exception as e:
        print(f"Error: {e}")