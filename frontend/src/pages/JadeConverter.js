import React, { useState, useEffect } from 'react';
import { resumeAPI, jadeAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  Settings, 
  FileText, 
  Download, 
  Eye, 
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const JadeConverter = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [convertedResume, setConvertedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.getAll();
      setResumes(response.data);
    } catch (error) {
      toast.error('Failed to load resumes');
    } finally {
      setFetching(false);
    }
  };

  const handleConvert = async () => {
    if (!selectedResume) {
      toast.error('Please select a resume to convert');
      return;
    }

    setLoading(true);
    try {
      const response = await jadeAPI.convert(selectedResume);
      setConvertedResume(response.data);
      toast.success('Resume converted to Jade format successfully!');
    } catch (error) {
      toast.error('Failed to convert resume to Jade format');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!convertedResume) return;

    const element = document.createElement('a');
    const file = new Blob([convertedResume.jade_format], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `jade_format_${selectedResume}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (fetching) {
    return (
      <div className="container py-8">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Jade Format Converter</h1>
          <p className="text-gray-600 mb-6">
            You need to upload at least one resume to use the Jade format converter.
          </p>
          <a href="/resume-upload" className="btn btn-primary">
            <FileText className="h-4 w-4" />
            Upload Resume
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Jade Format Converter</h1>
        <p className="text-gray-600">
          Convert your resumes to the standardized Jade format for better compatibility and analysis.
        </p>
      </div>

      <div className="grid grid-2 gap-8">
        {/* Resume Selection */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Select Resume to Convert
          </h2>
          
          <div className="space-y-3 mb-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedResume === resume.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedResume(resume.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{resume.original_filename}</p>
                    <p className="text-sm text-gray-500">
                      {resume.experience_years ? `${resume.experience_years} years experience` : 'Experience not specified'}
                    </p>
                    {resume.summary && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {resume.summary}
                      </p>
                    )}
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedResume === resume.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedResume === resume.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleConvert}
            disabled={loading || !selectedResume}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Converting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Convert to Jade Format
              </div>
            )}
          </button>
        </div>

        {/* Conversion Results */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Jade Format Output
          </h2>
          
          {convertedResume ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Conversion Successful</span>
              </div>
              
              <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {convertedResume.jade_format}
                </pre>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="btn btn-primary"
                >
                  <Download className="h-4 w-4" />
                  Download Jade Format
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Select a resume and click convert to see the Jade format output
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="card bg-blue-50 border-blue-200 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">About Jade Format</h3>
        <div className="text-blue-700 space-y-2">
          <p>
            The Jade format is a standardized resume format designed to improve compatibility 
            across different systems and enhance AI analysis capabilities.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Structured format for better parsing and analysis</li>
            <li>Consistent section organization</li>
            <li>Optimized for AI-powered matching algorithms</li>
            <li>Maintains all original information while improving readability</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JadeConverter;


