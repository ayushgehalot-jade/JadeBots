# Jade AI Setup Guide

This guide will help you set up and run the Jade AI application on your local machine.

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/downloads)

### Required Accounts
- **OpenAI API Key** - [Get your API key here](https://platform.openai.com/api-keys)

## Quick Start (Windows)

1. **Clone or download the project**
2. **Run the setup script**:
   ```cmd
   start.bat
   ```
3. **Configure your environment**:
   - Edit `backend/.env` file
   - Add your OpenAI API key
4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Quick Start (Linux/Mac)

1. **Clone or download the project**
2. **Make the script executable**:
   ```bash
   chmod +x start.sh
   ```
3. **Run the setup script**:
   ```bash
   ./start.sh
   ```
4. **Configure your environment**:
   - Edit `backend/.env` file
   - Add your OpenAI API key
5. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Manual Setup

If you prefer to set up manually or the automated scripts don't work:

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**:
   ```bash
   # Copy the example file
   cp env_example.txt .env
   
   # Edit .env file with your settings
   # Add your OpenAI API key
   ```

5. **Create upload directories**:
   ```bash
   mkdir -p uploads/resumes uploads/jds uploads/jade_templates
   ```

6. **Start the backend**:
   ```bash
   python run.py
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the frontend**:
   ```bash
   npm start
   ```

## Configuration

### Environment Variables

Edit the `backend/.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL=sqlite:///./jade_ai.db

# Security (Change this in production!)
SECRET_KEY=your-secret-key-here-change-in-production

# OpenAI Configuration (Required for AI features)
OPENAI_API_KEY=your-openai-api-key-here

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=False
```

### OpenAI API Key Setup

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Create a new API key
4. Copy the key and paste it in your `.env` file
5. Make sure you have credits in your OpenAI account

## Using Docker (Alternative)

If you prefer using Docker:

1. **Install Docker and Docker Compose**
2. **Set your OpenAI API key**:
   ```bash
   export OPENAI_API_KEY=your-api-key-here
   ```
3. **Start all services**:
   ```bash
   docker-compose up -d
   ```
4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

## Troubleshooting

### Common Issues

#### Backend Issues

**Port 8000 already in use**:
```bash
# Find and kill the process using port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

**Python dependencies not installing**:
```bash
# Upgrade pip
pip install --upgrade pip

# Install with verbose output
pip install -r requirements.txt -v
```

**Database connection issues**:
- Check if the database file exists
- Ensure write permissions in the backend directory
- Try deleting the database file to recreate it

#### Frontend Issues

**Port 3000 already in use**:
```bash
# Find and kill the process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Node modules issues**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API connection issues**:
- Check if backend is running on port 8000
- Verify CORS settings in backend
- Check browser console for errors

#### OpenAI API Issues

**API key not working**:
- Verify the key is correct in `.env` file
- Check if you have credits in your OpenAI account
- Ensure the key has the right permissions

**Rate limiting**:
- OpenAI has rate limits on API calls
- Consider upgrading your OpenAI plan for higher limits
- Implement caching for repeated requests

### Getting Help

1. **Check the logs**:
   - Backend logs appear in the terminal where you started it
   - Frontend logs appear in the browser console

2. **Verify all services are running**:
   - Backend: http://localhost:8000/docs
   - Frontend: http://localhost:3000

3. **Check file permissions**:
   - Ensure the application can read/write to upload directories
   - Check database file permissions

4. **Network issues**:
   - Disable firewall temporarily to test
   - Check if antivirus is blocking connections

## First Time Usage

1. **Register an account** on the frontend
2. **Upload a resume** (PDF, DOC, or DOCX)
3. **Upload a job description** (PDF, DOC, DOCX, or TXT)
4. **Create a match** between resume and job description
5. **View detailed results** with AI analysis
6. **Try Jade format conversion** for standardized resumes

## Production Deployment

For production deployment:

1. **Use PostgreSQL** instead of SQLite
2. **Set strong SECRET_KEY**
3. **Configure proper CORS settings**
4. **Use environment variables** for all sensitive data
5. **Set up proper logging**
6. **Use a production WSGI server** like Gunicorn
7. **Serve frontend as static files** with Nginx

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review the main README.md
3. Check the API documentation at http://localhost:8000/docs
4. Open an issue in the repository

## Next Steps

After successful setup:

1. Explore the dashboard
2. Upload sample resumes and job descriptions
3. Test the matching functionality
4. Try the Jade format conversion
5. Customize templates for your needs


