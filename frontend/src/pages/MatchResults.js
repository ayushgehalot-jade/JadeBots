import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { matchAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  FileText, 
  Briefcase,
  ArrowLeft,
  Download
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MatchResults = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      const response = await matchAPI.getById(matchId);
      setMatch(response.data);
    } catch (error) {
      toast.error('Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Match Not Found</h1>
          <p className="text-gray-600 mb-6">The requested match could not be found.</p>
          <Link to="/match-resume" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Matching
          </Link>
        </div>
      </div>
    );
  }

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return '#10b981'; // green
    if (percentage >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getMatchLabel = (percentage) => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  const pieData = [
    { name: 'Match', value: match.match_percentage, color: getMatchColor(match.match_percentage) },
    { name: 'Gap', value: 100 - match.match_percentage, color: '#e5e7eb' }
  ];

  const barData = [
    { name: 'Overall', value: match.match_percentage },
    { name: 'Skills', value: match.skills_match || 0 },
    { name: 'Experience', value: match.experience_match || 0 },
    { name: 'Education', value: match.education_match || 0 }
  ];

  const strengths = match.strengths ? JSON.parse(match.strengths) : [];
  const weaknesses = match.weaknesses ? JSON.parse(match.weaknesses) : [];
  const recommendations = match.recommendations ? JSON.parse(match.recommendations) : [];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/match-resume" className="btn btn-outline mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Matching
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Match Results</h1>
            <p className="text-gray-600">
              Analysis of resume compatibility with job requirements
            </p>
          </div>
          
          <div className="text-right">
            <div className={`text-4xl font-bold ${getMatchColor(match.match_percentage)}`}>
              {match.match_percentage.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-500">{getMatchLabel(match.match_percentage)}</p>
          </div>
        </div>
      </div>

      {/* Match Overview */}
      <div className="grid grid-2 gap-8 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Resume Details
          </h2>
          <div className="space-y-2">
            <p><span className="font-medium">File:</span> {match.resume?.original_filename}</p>
            <p><span className="font-medium">Experience:</span> {match.resume?.experience_years || 'Not specified'} years</p>
            {match.resume?.summary && (
              <div>
                <p className="font-medium mb-1">Summary:</p>
                <p className="text-sm text-gray-600">{match.resume.summary}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-green-600" />
            Job Description Details
          </h2>
          <div className="space-y-2">
            <p><span className="font-medium">Title:</span> {match.job_description?.title || 'Not specified'}</p>
            <p><span className="font-medium">Company:</span> {match.job_description?.company || 'Not specified'}</p>
            <p><span className="font-medium">Experience Required:</span> {match.job_description?.experience_required || 'Not specified'} years</p>
            {match.job_description?.location && (
              <p><span className="font-medium">Location:</span> {match.job_description.location}</p>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-2 gap-8 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Overall Match</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                {match.match_percentage.toFixed(0)}%
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Detailed Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analysis Sections */}
      <div className="grid grid-3 gap-6 mb-8">
        {/* Strengths */}
        <div className="card bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Strengths
          </h3>
          {strengths.length > 0 ? (
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="text-green-700 text-sm flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-600 text-sm">No specific strengths identified</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="card bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Areas for Improvement
          </h3>
          {weaknesses.length > 0 ? (
            <ul className="space-y-2">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="text-red-700 text-sm flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-600 text-sm">No major weaknesses identified</p>
          )}
        </div>

        {/* Recommendations */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Recommendations
          </h3>
          {recommendations.length > 0 ? (
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-blue-700 text-sm flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-blue-600 text-sm">No specific recommendations</p>
          )}
        </div>
      </div>

      {/* Overall Feedback */}
      {match.overall_feedback && (
        <div className="card bg-gray-50 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Assessment</h3>
          <p className="text-gray-700 leading-relaxed">{match.overall_feedback}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-center mt-8">
        <Link to="/match-resume" className="btn btn-outline">
          <ArrowLeft className="h-4 w-4" />
          Create Another Match
        </Link>
        <button className="btn btn-primary">
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </div>
    </div>
  );
};

export default MatchResults;


