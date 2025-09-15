import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI, jdAPI, matchAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  FileText, 
  Upload, 
  GitBranch, 
  TrendingUp, 
  Users, 
  Briefcase,
  Plus,
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    resumes: 0,
    jobDescriptions: 0,
    matches: 0,
    averageMatch: 0
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resumesRes, jdsRes, matchesRes] = await Promise.all([
        resumeAPI.getAll(),
        jdAPI.getAll(),
        matchAPI.getAll()
      ]);

      const resumes = resumesRes.data;
      const jobDescriptions = jdsRes.data;
      const matches = matchesRes.data;

      // Calculate average match percentage
      const averageMatch = matches.length > 0 
        ? matches.reduce((sum, match) => sum + match.match_percentage, 0) / matches.length 
        : 0;

      setStats({
        resumes: resumes.length,
        jobDescriptions: jobDescriptions.length,
        matches: matches.length,
        averageMatch: Math.round(averageMatch)
      });

      // Get recent matches (last 5)
      setRecentMatches(matches.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
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

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Jade AI - Your intelligent resume matching platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4 mb-8">
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Resumes</p>
              <p className="text-2xl font-bold text-blue-900">{stats.resumes}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Job Descriptions</p>
              <p className="text-2xl font-bold text-green-900">{stats.jobDescriptions}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Matches</p>
              <p className="text-2xl font-bold text-purple-900">{stats.matches}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <GitBranch className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card bg-orange-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Avg Match %</p>
              <p className="text-2xl font-bold text-orange-900">{stats.averageMatch}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-2 mb-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/resume-upload" className="btn btn-primary w-full">
              <Plus className="h-4 w-4" />
              Upload Resume
            </Link>
            <Link to="/jd-upload" className="btn btn-outline w-full">
              <Upload className="h-4 w-4" />
              Upload Job Description
            </Link>
            <Link to="/match-resume" className="btn btn-outline w-full">
              <GitBranch className="h-4 w-4" />
              Create Match
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Matches</h2>
          {recentMatches.length > 0 ? (
            <div className="space-y-3">
              {recentMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Match #{match.id}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(match.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      match.match_percentage >= 80 
                        ? 'bg-green-100 text-green-800'
                        : match.match_percentage >= 60
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {match.match_percentage.toFixed(1)}%
                    </span>
                    <Link 
                      to={`/match-results/${match.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No matches yet</p>
          )}
        </div>
      </div>

      {/* Getting Started */}
      {stats.resumes === 0 && stats.jobDescriptions === 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Getting Started</h2>
          <p className="text-blue-700 mb-4">
            Welcome to Jade AI! To get started, you'll need to upload some resumes and job descriptions.
          </p>
          <div className="flex gap-4">
            <Link to="/resume-upload" className="btn btn-primary">
              <FileText className="h-4 w-4" />
              Upload Your First Resume
            </Link>
            <Link to="/jd-upload" className="btn btn-outline">
              <Briefcase className="h-4 w-4" />
              Upload Job Description
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


