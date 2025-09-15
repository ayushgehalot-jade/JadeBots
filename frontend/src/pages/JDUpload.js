import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { jdAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

const JDUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Auto-upload files
    newFiles.forEach(uploadFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  const uploadFile = async (fileObj) => {
    try {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'uploading', progress: 50 }
            : f
        )
      );

      const response = await jdAPI.upload(fileObj.file);
      
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileObj.id 
            ? { 
                ...f, 
                status: 'success', 
                progress: 100,
                jd: response.data
              }
            : f
        )
      );

      toast.success(`${fileObj.file.name} uploaded successfully!`);
    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'error', progress: 0 }
            : f
        )
      );
      
      toast.error(`Failed to upload ${fileObj.file.name}`);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'uploading':
        return <div className="spinner h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'uploading':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Job Descriptions</h1>
        <p className="text-gray-600">
          Upload job description files in PDF, DOC, DOCX, or TXT format. Our AI will analyze and extract key requirements.
        </p>
      </div>

      {/* Upload Area */}
      <div className="card mb-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-lg text-blue-600">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-lg text-gray-600 mb-2">
                Drag & drop job description files here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, DOC, DOCX, and TXT files
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
          <div className="space-y-3">
            {uploadedFiles.map((fileObj) => (
              <div
                key={fileObj.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(fileObj.status)}`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(fileObj.status)}
                  <div>
                    <p className="font-medium text-gray-900">{fileObj.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {fileObj.status === 'uploading' && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${fileObj.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {fileObj.status === 'success' && fileObj.jd && (
                    <div className="text-sm text-green-600">
                      <p>✓ Analyzed</p>
                      <p className="text-xs">
                        {fileObj.jd.title || 'Job Description'}
                      </p>
                    </div>
                  )}
                  
                  {fileObj.status === 'error' && (
                    <button
                      onClick={() => uploadFile(fileObj)}
                      className="btn btn-outline btn-sm"
                    >
                      Retry
                    </button>
                  )}
                  
                  <button
                    onClick={() => removeFile(fileObj.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-green-50 border-green-200 mt-8">
        <h3 className="text-lg font-semibold text-green-900 mb-2">Tips for Best Results</h3>
        <ul className="text-green-700 space-y-1">
          <li>• Include clear job title, company name, and location</li>
          <li>• List required and preferred skills explicitly</li>
          <li>• Specify years of experience required</li>
          <li>• Include education requirements and qualifications</li>
          <li>• Use clear section headings for better parsing</li>
        </ul>
      </div>
    </div>
  );
};

export default JDUpload;


