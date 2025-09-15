import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI, jdAPI, matchAPI } from '../services/api';
import { toast } from 'react-toastify';
import { GitBranch, FileText, Briefcase, ArrowRight, Loader } from 'lucide-react';

const MatchResume = () => {
  const [resumes, setResumes] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [selectedJD, setSelectedJD] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resumesRes, jdsRes] = await Promise.all([
        resumeAPI.getAll(),
        jdAPI.getAll()
      ]);

      setResumes(resumesRes.data);
      setJobDescriptions(jdsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setFetching(false);
    }
  };

  const handleMatch = async () => {
    if (!selectedResume || !selectedJD) {
      toast.error('Please select both a resume and job description');
      return;
    }

    setLoading(true);
    try {
      const response = await matchAPI.create(selectedResume, selectedJD);
      toast.success('Match created successfully!');
      navigate(`/match-results/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to create match');
    } finally {
      setLoading(false);
    }
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

  if (resumes.length === 0 || jobDescriptions.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <GitBranch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Resume Match</h1>
          <p className="text-gray-600 mb-6">
            {resumes.length === 0 && jobDescriptions.length === 0
              ? 'You need to upload both resumes and job descriptions to create matches.'
              : resumes.length === 0
              ? 'You need to upload at least one resume to create matches.'
              : 'You need to upload at least one job description to create matches.'
            }
          </p>
          <div className="flex gap-4 justify-center">
            {resumes.length === 0 && (
              <a href="/resume-upload" className="btn btn-primary">
                <FileText className="h-4 w-4" />
                Upload Resume
              </a>
            )}
            {jobDescriptions.length === 0 && (
              <a href="/jd-upload" className="btn btn-primary">
                <Briefcase className="h-4 w-4" />
                Upload Job Description
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Resume Match</h1>
        <p className="text-gray-600">
          Select a resume and job description to analyze compatibility and generate match insights.
        </p>
      </div>

      <div className="grid grid-2 gap-8">
        {/* Resume Selection */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Select Resume
          </h2>
          
          <div className="space-y-3">
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
        </div>

        {/* Job Description Selection */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-green-600" />
            Select Job Description
          </h2>
          
          <div className="space-y-3">
            {jobDescriptions.map((jd) => (
              <div
                key={jd.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedJD === jd.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedJD(jd.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {jd.title || jd.original_filename}
                    </p>
                    <p className="text-sm text-gray-500">
                      {jd.company && `${jd.company} • `}
                      {jd.experience_required ? `${jd.experience_required} years required` : 'Experience not specified'}
                    </p>
                    {jd.location && (
                      <p className="text-xs text-gray-600 mt-1">
                        📍 {jd.location}
                      </p>
                    )}
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedJD === jd.id
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedJD === jd.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Match Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleMatch}
          disabled={loading || !selectedResume || !selectedJD}
          className="btn btn-primary btn-lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader className="h-5 w-5 animate-spin" />
              Analyzing Match...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Create Match
              <ArrowRight className="h-5 w-5" />
            </div>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="card bg-blue-50 border-blue-200 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">How Matching Works</h3>
        <ul className="text-blue-700 space-y-1">
          <li>• AI analyzes skills compatibility between resume and job requirements</li>
          <li>• Experience level matching based on years of experience</li>
          <li>• Education requirements comparison</li>
          <li>• Generates detailed feedback and recommendations</li>
          <li>• Provides percentage-based match score</li>
        </ul>
      </div>
    </div>
  );
};

export default MatchResume;


