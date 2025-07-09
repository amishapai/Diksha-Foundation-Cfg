import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Users, BarChart3 } from 'lucide-react';
import { importCompleteStudentData } from '../services/studentDataService';
import { toast } from 'react-toastify';

const CSVDataImporter = () => {
  const [csvData, setCsvData] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [preview, setPreview] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setCsvData(text);
      generatePreview(text);
    };
    reader.readAsText(file);
  };

  const generatePreview = (csvText) => {
    try {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const previewData = [];

      // Show first 3 rows as preview
      for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        previewData.push(row);
      }

      setPreview(previewData);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Error parsing CSV file');
    }
  };

  const handleImport = async () => {
    if (!csvData.trim()) {
      toast.error('Please upload a CSV file or paste data');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const result = await importCompleteStudentData(csvData);
      setImportResult(result);

      if (result.success) {
        toast.success(`Successfully imported ${result.count} student records!`);
        setCsvData('');
        setPreview([]);
      } else {
        toast.error(`Import failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import failed');
      setImportResult({ success: false, error: error.message });
    } finally {
      setImporting(false);
    }
  };

  const sampleFormat = `Roll No,First name,Last name,DOB /Age,Grade,Grade LL,Section,Mandal,Village Name,Gender (M/F),Q1,Q2,Q3,Q4,Q5,Q6,Q7,Q8,Q9,Q10,Total Score,Total Marks,Total %,Center,Center_Name
BIH_1,Ashley,,15,10,10,A,Kellyburgh,Melanie Route,F,1,3,2,2,1,1,3,0,3,3,19,30,63.33,BIH,Bihar`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
      <div className="flex items-center mb-6">
        <FileSpreadsheet className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-xl font-bold text-gray-800">Import Complete Student Data</h2>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-blue-800 mb-2">Expected CSV Format:</h3>
        <div className="text-sm text-blue-700 mb-3">
          Your CSV should contain the following columns:
        </div>
        <div className="bg-white p-3 rounded border text-xs font-mono overflow-x-auto">
          <div className="whitespace-nowrap">
            Roll No, First name, Last name, DOB /Age, Grade, Grade LL, Section, Mandal, Village Name, Gender (M/F), Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10, Total Score, Total Marks, Total %, Center, Center_Name
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload CSV File
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">
              Click to upload complete_student_data.csv
            </span>
          </label>
        </div>
      </div>

      {/* Manual CSV Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or Paste CSV Data
        </label>
        <textarea
          value={csvData}
          onChange={(e) => {
            setCsvData(e.target.value);
            generatePreview(e.target.value);
          }}
          placeholder={`Paste your CSV data here...\n\nExample:\n${sampleFormat}`}
          className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Preview (First 3 rows):
          </h3>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Village</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Score</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.map((row, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 text-gray-900">{row['Roll No']}</td>
                    <td className="px-3 py-2 text-gray-900">{row['First name']} {row['Last name']}</td>
                    <td className="px-3 py-2 text-gray-900">{row['DOB /Age']}</td>
                    <td className="px-3 py-2 text-gray-900">{row['Grade']}</td>
                    <td className="px-3 py-2 text-gray-900">{row['Village Name']}</td>
                    <td className="px-3 py-2 text-gray-900">{row['Total Score']}</td>
                    <td className="px-3 py-2 text-gray-900">{row['Total %']}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <div className={`mb-6 p-4 rounded-lg ${
          importResult.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            {importResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            )}
            <span className={`text-sm font-medium ${
              importResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {importResult.success 
                ? `Successfully imported ${importResult.count} student records with assessment data!`
                : `Import failed: ${importResult.error}`
              }
            </span>
          </div>
          {importResult.success && (
            <div className="mt-2 text-sm text-green-700">
              Students can now login with their generated email addresses and see their assessment performance.
            </div>
          )}
        </div>
      )}

      {/* Import Button */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setCsvData('');
            setPreview([]);
            setImportResult(null);
          }}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleImport}
          disabled={!csvData.trim() || importing}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {importing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Importing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Import Student Data
            </>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <Users className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">After importing:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Students will be created with auto-generated email addresses</li>
              <li>Email format: firstname.rollno@school.edu (e.g., ashley.bih_1@school.edu)</li>
              <li>Students can login and see their assessment performance</li>
              <li>Question-wise and subject-wise analytics will be available</li>
              <li>Performance grades and rankings will be calculated automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVDataImporter;
