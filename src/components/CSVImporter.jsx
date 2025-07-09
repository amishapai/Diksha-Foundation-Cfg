import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X } from 'lucide-react';
import { csvImportService } from '../services/databaseService';
import { toast } from 'react-toastify';

const CSVImporter = ({ isOpen, onClose, importType = 'students' }) => {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState('');
  const [preview, setPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const importTypes = {
    students: {
      name: 'Students',
      expectedHeaders: ['firstname', 'lastname', 'email', 'class', 'gpa', 'attendance'],
      description: 'Import student records with basic information'
    },
    attendance: {
      name: 'Attendance',
      expectedHeaders: ['student_id', 'date', 'status', 'remarks'],
      description: 'Import daily attendance records'
    },
    grades: {
      name: 'Grades',
      expectedHeaders: ['student_id', 'subject', 'grade', 'marks', 'date'],
      description: 'Import student grades and marks'
    },
    subjects: {
      name: 'Subjects',
      expectedHeaders: ['name', 'code', 'credits', 'teacher'],
      description: 'Import subject information'
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      setCsvData(text);
      generatePreview(text);
    };
    
    reader.readAsText(uploadedFile);
  };

  const generatePreview = (csvText) => {
    try {
      const { headers, data } = csvImportService.parseCSV(csvText);
      setPreview(data.slice(0, 5)); // Show first 5 rows
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Error parsing CSV file');
    }
  };

  const handleImport = async () => {
    if (!csvData.trim()) {
      toast.error('Please upload a file or paste CSV data');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      let result;
      
      switch (importType) {
        case 'students':
          result = await csvImportService.importStudents(csvData);
          break;
        case 'attendance':
          result = await csvImportService.importAttendance(csvData);
          break;
        case 'grades':
          result = await csvImportService.importGrades(csvData);
          break;
        default:
          throw new Error('Invalid import type');
      }

      setImportResult(result);
      
      if (result.success) {
        toast.success(`Successfully imported ${result.count} records`);
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

  const resetForm = () => {
    setFile(null);
    setCsvData('');
    setPreview([]);
    setImportResult(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const currentType = importTypes[importType];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Import {currentType.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {currentType.description}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Expected Format */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Expected CSV Format:
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <code className="text-sm text-gray-800">
                {currentType.expectedHeaders.join(', ')}
              </code>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload CSV or Excel file
                </span>
                {file && (
                  <span className="text-sm text-blue-600 mt-2">
                    Selected: {file.name}
                  </span>
                )}
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
              placeholder="Paste your CSV data here..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Preview (First 5 rows):
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0] || {}).map((header) => (
                        <th
                          key={header}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-2 text-sm text-gray-900"
                          >
                            {value}
                          </td>
                        ))}
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
                    ? `Successfully imported ${importResult.count} records`
                    : `Import failed: ${importResult.error}`
                  }
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={resetForm}
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
                  Import Data
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVImporter;
