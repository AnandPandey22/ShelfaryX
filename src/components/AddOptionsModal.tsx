import React, { useState } from 'react';
import { X, Download, Upload, Plus, FileText, User, BookOpen, ArrowRight } from 'lucide-react';
import { BookCategory } from '../types';

interface AddOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'books' | 'students';
  categories?: BookCategory[];
  onManualAdd: () => void;
  onBulkImport: (data: any[]) => Promise<{ success: number; errors: string[] }>;
  institutionId?: string;
}

const AddOptionsModal: React.FC<AddOptionsModalProps> = ({
  isOpen,
  onClose,
  type,
  categories = [],
  onManualAdd,
  onBulkImport,
  institutionId
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    errors: string[];
    total: number;
  } | null>(null);
  const [showUploadSection, setShowUploadSection] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResults(null);
    }
  };

  const downloadTemplate = () => {
    let headers: string[] = [];
    let sampleData: any[] = [];

    if (type === 'books') {
      headers = [
        'Title*',
        'Author*',
        'ISBN*',
        'Category*',
        'Publisher',
        'Publish Year',
        'Total Copies*',
        'Available Copies*',
        'Description'
      ];
      
      sampleData = [
        {
          'Title*': 'Sample Book Title',
          'Author*': 'Sample Author',
          'ISBN*': '9781234567890',
          'Category*': categories.length > 0 ? categories[0].name : 'Fiction',
          'Publisher': 'Sample Publisher',
          'Publish Year': '2023',
          'Total Copies*': '5',
          'Available Copies*': '5',
          'Description': 'Sample book description'
        }
      ];
    } else {
      headers = [
        'Name*',
        'Student ID*',
        'Email',
        'Class*',
        'Section*',
        'Mobile Number*',
        'Address*',
        'College Branch*'
      ];
      
      sampleData = [
        {
          'Name*': 'John Doe',
          'Student ID*': 'CS2021001',
          'Email': 'john.doe@email.com',
          'Class*': 'B.Tech',
          'Section*': 'A',
          'Mobile Number*': '+1234567890',
          'Address*': '123 Main Street, City',
          'College Branch*': 'Computer Science'
        }
      ];
    }

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes in CSV
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${type}_template.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const data: any[] = [];

          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
              const row: any = {};
              headers.forEach((header, index) => {
                row[header] = values[index] || '';
              });
              data.push(row);
            }
          }

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  const validateData = (data: any[]): { valid: any[], errors: string[] } => {
    const valid: any[] = [];
    const errors: string[] = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because of header row and 0-based index
      let hasError = false;

      if (type === 'books') {
        // Validate required fields for books
        if (!row['Title*']?.trim()) {
          errors.push(`Row ${rowNumber}: Title is required`);
          hasError = true;
        }
        if (!row['Author*']?.trim()) {
          errors.push(`Row ${rowNumber}: Author is required`);
          hasError = true;
        }
        if (!row['ISBN*']?.trim()) {
          errors.push(`Row ${rowNumber}: ISBN is required`);
          hasError = true;
        }
        if (!row['Category*']?.trim()) {
          errors.push(`Row ${rowNumber}: Category is required`);
          hasError = true;
        }
        if (!row['Total Copies*'] || isNaN(Number(row['Total Copies*']))) {
          errors.push(`Row ${rowNumber}: Total Copies must be a valid number`);
          hasError = true;
        }
        if (!row['Available Copies*'] || isNaN(Number(row['Available Copies*']))) {
          errors.push(`Row ${rowNumber}: Available Copies must be a valid number`);
          hasError = true;
        }

        // Transform data for books
        if (!hasError) {
          valid.push({
            title: row['Title*'].trim(),
            author: row['Author*'].trim(),
            isbn: row['ISBN*'].trim(),
            category: row['Category*'].trim(),
            publisher: row['Publisher']?.trim() || '',
            publishYear: row['Publish Year'] ? parseInt(row['Publish Year']) : null,
            totalCopies: parseInt(row['Total Copies*']),
            availableCopies: parseInt(row['Available Copies*']),
            description: row['Description']?.trim() || '',
            institutionId: institutionId
          });
        }
      } else {
        // Validate required fields for students
        if (!row['Name*']?.trim()) {
          errors.push(`Row ${rowNumber}: Name is required`);
          hasError = true;
        }
        if (!row['Student ID*']?.trim()) {
          errors.push(`Row ${rowNumber}: Student ID is required`);
          hasError = true;
        }
        if (!row['Class*']?.trim()) {
          errors.push(`Row ${rowNumber}: Class is required`);
          hasError = true;
        }
        if (!row['Section*']?.trim()) {
          errors.push(`Row ${rowNumber}: Section is required`);
          hasError = true;
        }
        if (!row['Mobile Number*']?.trim()) {
          errors.push(`Row ${rowNumber}: Mobile Number is required`);
          hasError = true;
        }
        if (!row['Address*']?.trim()) {
          errors.push(`Row ${rowNumber}: Address is required`);
          hasError = true;
        }
        if (!row['College Branch*']?.trim()) {
          errors.push(`Row ${rowNumber}: College Branch is required`);
          hasError = true;
        }

        // Transform data for students
        if (!hasError) {
          valid.push({
            name: row['Name*'].trim(),
            studentId: row['Student ID*'].trim(),
            email: row['Email']?.trim() || `${row['Student ID*'].toLowerCase()}@college.edu`,
            class: row['Class*'].trim(),
            section: row['Section*'].trim(),
            mobileNumber: row['Mobile Number*'].trim(),
            address: row['Address*'].trim(),
            collegeBranch: row['College Branch*'].trim(),
            password: 'password123', // Default password
            course: row['Class*'].trim(),
            branch: row['College Branch*'].trim(),
            college: 'College',
            joinDate: new Date().toLocaleDateString('en-CA'),
            isActive: true,
            institutionId: institutionId
          });
        }
      }
    });

    return { valid, errors };
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadResults(null);

    try {
      // Process file
      setUploadProgress(20);
      const data = await processFile(selectedFile);
      
      // Validate data
      setUploadProgress(40);
      const { valid, errors } = validateData(data);
      
      if (errors.length > 0) {
        setUploadResults({
          success: 0,
          errors,
          total: data.length
        });
        setUploadProgress(100);
        return;
      }

      // Upload data
      setUploadProgress(60);
      const result = await onBulkImport(valid);
      
      setUploadProgress(100);
      setUploadResults({
        success: result.success,
        errors: result.errors,
        total: data.length
      });

      // Reset file selection
      setSelectedFile(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Auto-close modal after successful upload (if no errors)
      if (result.errors.length === 0) {
        setTimeout(() => {
          onClose();
        }, 1000); // Close after 1 second to show success message
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadResults({
        success: 0,
        errors: ['Failed to process file. Please check the file format.'],
        total: 0
      });
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-8 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {type === 'books' ? (
                <BookOpen className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Add {type === 'books' ? 'Books' : 'Students'}
            </h2>
            <p className="text-gray-600 text-lg">
              Choose how you'd like to add {type === 'books' ? 'books' : 'students'} to your library
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {!showUploadSection ? (
            /* Main Options */
            <div className="space-y-4">
              {/* Download Template Option */}
              <button
                onClick={downloadTemplate}
                className="w-full group relative bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-900">Download Template</h3>
                      <p className="text-gray-600">Get a CSV template with sample data and instructions</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Upload File Option */}
              <button
                onClick={() => setShowUploadSection(true)}
                className="w-full group relative bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-900">Upload File</h3>
                      <p className="text-gray-600">Import multiple {type} from a CSV file</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-green-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Manual Add Option */}
              <button
                onClick={onManualAdd}
                className="w-full group relative bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-900">Manual Add</h3>
                      <p className="text-gray-600">Add {type === 'books' ? 'a book' : 'a student'} one by one</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-purple-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Categories Info for Books */}
              {type === 'books' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-green-800">
                        Category Information
                      </h3>
                      {categories.length > 0 ? (
                        <p className="text-sm text-green-700 mt-1">
                          Available categories: {categories.map(c => c.name).join(', ')}
                        </p>
                      ) : (
                        <p className="text-sm text-green-700 mt-1">
                          No categories exist yet. New categories will be automatically created from your CSV file.
                        </p>
                      )}
                      <p className="text-sm text-blue-700 mt-2">
                        💡 <strong>Auto-Create Feature:</strong> If you use a category name that doesn't exist, it will be automatically created for you!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Upload Section */
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => setShowUploadSection(false)}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
                Back to options
              </button>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload your CSV file
                </h3>
                <p className="text-gray-500 mb-6">
                  Select a CSV file with the correct format
                </p>
                <input
                  id="file-input"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="file-input"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                </label>
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-3">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Upload Results */}
              {uploadResults && (
                <div className={`p-6 rounded-xl ${
                  uploadResults.errors.length > 0
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${
                        uploadResults.errors.length > 0 ? 'text-red-800' : 'text-green-800'
                      }`}>
                        Upload {uploadResults.errors.length > 0 ? 'Failed' : 'Successful'}
                      </h3>
                                                                    <p className={`text-sm mt-1 ${
                         uploadResults.errors.length > 0 ? 'text-red-700' : 'text-green-700'
                       }`}>
                         {uploadResults.success} of {uploadResults.total} records processed successfully
                         {uploadResults.errors.length === 0 && uploadResults.success > 0 && (
                           <span className="block mt-2 text-xs">Modal will close automatically in 1 second...</span>
                         )}
                       </p>
                       {/* Show auto-created categories info */}
                       {uploadResults.errors.length > 0 && uploadResults.errors[0]?.includes('✅ Auto-created') && (
                         <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                           <p className="text-sm text-blue-800 font-medium">
                             {uploadResults.errors[0]}
                           </p>
                         </div>
                       )}
                      {uploadResults.errors.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-red-800">Errors:</p>
                          <ul className="text-sm text-red-700 mt-1 space-y-1 max-h-32 overflow-y-auto">
                            {uploadResults.errors.map((error, index) => (
                              <li key={index} className="list-disc list-inside">
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {selectedFile && !uploading && (
                <div className="text-center">
                  <button
                    onClick={handleUpload}
                    className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload and Process
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddOptionsModal; 