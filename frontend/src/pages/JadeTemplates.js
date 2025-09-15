import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { jadeAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Star,
  Trash2,
  Eye
} from 'lucide-react';

const JadeTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await jadeAPI.getTemplates();
      setTemplates(response.data);
    } catch (error) {
      toast.error('Failed to load Jade templates');
    } finally {
      setFetching(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      uploadTemplate(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/json': ['.json']
    },
    multiple: false
  });

  const uploadTemplate = async (file) => {
    setLoading(true);
    try {
      const response = await jadeAPI.uploadTemplate(file);
      setTemplates(prev => [...prev, response.data]);
      toast.success('Jade template uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload Jade template');
    } finally {
      setLoading(false);
    }
  };

  const setActiveTemplate = async (templateId) => {
    try {
      await jadeAPI.setActiveTemplate(templateId);
      setTemplates(prev => 
        prev.map(template => ({
          ...template,
          is_active: template.id === templateId
        }))
      );
      toast.success('Active template updated!');
    } catch (error) {
      toast.error('Failed to set active template');
    }
  };

  const deleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      await jadeAPI.deleteTemplate(templateId);
      setTemplates(prev => prev.filter(template => template.id !== templateId));
      toast.success('Template deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete template');
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

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Jade Templates</h1>
        <p className="text-gray-600">
          Manage your Jade format templates for resume conversion.
        </p>
      </div>

      {/* Upload Area */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload New Template</h2>
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
            <p className="text-lg text-blue-600">Drop the template file here...</p>
          ) : (
            <div>
              <p className="text-lg text-gray-600 mb-2">
                Drag & drop a template file here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports TXT, MD, and JSON files
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Templates List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Your Templates</h2>
        
        {templates.length > 0 ? (
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg ${
                  template.is_active 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{template.name}</p>
                        {template.is_active && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            <Star className="h-3 w-3" />
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {template.description || 'No description provided'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Created: {new Date(template.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const element = document.createElement('div');
                        element.innerHTML = `
                          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div class="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
                              <h3 class="text-lg font-semibold mb-4">${template.name}</h3>
                              <pre class="text-sm text-gray-700 whitespace-pre-wrap">${template.content}</pre>
                              <button onclick="this.closest('.fixed').remove()" class="mt-4 btn btn-primary">Close</button>
                            </div>
                          </div>
                        `;
                        document.body.appendChild(element);
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {!template.is_active && (
                      <button
                        onClick={() => setActiveTemplate(template.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Set Active
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="btn btn-danger btn-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No Jade templates uploaded yet</p>
            <p className="text-sm text-gray-400">
              Upload your first template to get started with Jade format conversion
            </p>
          </div>
        )}
      </div>

      {/* Information */}
      <div className="card bg-blue-50 border-blue-200 mt-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">About Jade Templates</h3>
        <div className="text-blue-700 space-y-2">
          <p>
            Jade templates define the structure and format for converting resumes to the standardized Jade format.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Only one template can be active at a time</li>
            <li>Active template is used for all resume conversions</li>
            <li>Templates should include placeholders for resume sections</li>
            <li>Supports plain text, markdown, and JSON formats</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JadeTemplates;


