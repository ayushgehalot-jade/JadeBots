# Jade AI - Intelligent Resume Matching Platform

A comprehensive application that uses AI to match resumes with job descriptions and convert resumes to a standardized Jade format.

## Features

### Core Functionality
- **Resume Upload & Analysis**: Upload resumes in PDF, DOC, or DOCX format with AI-powered content extraction
- **Job Description Upload & Analysis**: Upload job descriptions with intelligent requirement parsing
- **AI-Powered Matching**: Advanced algorithm to match resumes with job descriptions and provide percentage-based compatibility scores
- **Resume Summary Generation**: Automatic generation of concise resume summaries for quick review
- **Jade Format Conversion**: Convert resumes to standardized Jade format for better compatibility
- **Jade Template Management**: Upload and manage custom Jade format templates

### User Interface
- **Modern React Frontend**: Clean, responsive interface with drag-and-drop file uploads
- **Interactive Dashboard**: Overview of all resumes, job descriptions, and matches
- **Detailed Match Results**: Comprehensive analysis with charts, strengths, weaknesses, and recommendations
- **User Authentication**: Secure login and registration system

### Technical Features
- **FastAPI Backend**: High-performance Python API with automatic documentation
- **SQLAlchemy ORM**: Robust database management with PostgreSQL/SQLite support
- **OpenAI Integration**: Advanced AI analysis using GPT models
- **File Processing**: Support for multiple document formats with text extraction
- **JWT Authentication**: Secure token-based authentication system

## Project Structure

```
JadeBots/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── database.py             # Database configuration
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── requirements.txt        # Python dependencies
│   ├── env_example.txt         # Environment variables template
│   ├── services/               # Business logic services
│   │   ├── auth_service.py     # Authentication service
│   │   ├── resume_service.py   # Resume management
│   │   ├── jd_service.py       # Job description management
│   │   ├── matching_service.py # Resume-JD matching
│   │   └── jade_service.py     # Jade format conversion
│   └── utils/                  # Utility functions
│       ├── file_parser.py      # Document parsing
│       └── ai_analyzer.py      # AI analysis functions
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Application pages
│   │   ├── services/           # API service functions
│   │   ├── contexts/           # React contexts
│   │   └── App.js              # Main application component
│   └── package.json            # Node.js dependencies
└── README.md                   # This file
```

## Installation & Setup

### Prerequisites
- Node.js 16+
- OpenAI API key

### Backend Setup

cd backend-nodejs

```bash
   npm install
   ```
   ```bash
   npm start
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   
   The application will be available at `http://localhost:3000`

## Usage

### Getting Started

1. **Register an Account**: Create a new account or login with existing credentials
2. **Upload Resumes**: Go to the Resume Upload page and drag & drop your resume files
3. **Upload Job Descriptions**: Upload job description files in the JD Upload section
4. **Create Matches**: Use the Match Resume page to pair resumes with job descriptions
5. **View Results**: Analyze detailed match results with AI-generated insights
6. **Jade Conversion**: Convert resumes to standardized Jade format

### Key Features

#### Resume Analysis
- Automatic extraction of skills, experience, and education
- AI-generated summaries for quick review
- Support for PDF, DOC, and DOCX formats

#### Job Description Processing
- Intelligent parsing of job requirements
- Extraction of required/preferred skills
- Experience and education requirement analysis

#### Matching Algorithm
- Skills compatibility analysis
- Experience level matching
- Education requirement comparison
- Overall percentage-based match score
- Detailed feedback and recommendations

#### Jade Format
- Standardized resume format for better compatibility
- Custom template support
- AI-powered conversion maintaining all original information

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Key Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `POST /resumes/upload` - Upload resume files
- `POST /jds/upload` - Upload job description files
- `POST /matches` - Create resume-JD matches
- `GET /matches/{id}` - Get detailed match results
- `POST /jade/convert/{resume_id}` - Convert resume to Jade format
- `POST /jade/upload` - Upload Jade templates

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///./jade_ai.db` |
| `SECRET_KEY` | JWT secret key | Required |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Required |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8000` |

### Database

The application supports both SQLite (default) and PostgreSQL databases. For production, it's recommended to use PostgreSQL:

```bash
DATABASE_URL=postgresql://username:password@localhost/dbname
```

## Development

### Backend Development

- The backend uses FastAPI with automatic API documentation
- Services are organized by functionality in the `services/` directory
- Database models are defined in `models.py`
- API schemas are in `schemas.py`

### Frontend Development

- Built with React 18 and modern hooks
- Uses React Router for navigation
- Styled with custom CSS classes
- API integration through Axios

### Adding New Features

1. **Backend**: Add new models, services, and API endpoints
2. **Frontend**: Create new components and pages
3. **Integration**: Update API service functions

## Deployment

### Production Deployment

1. **Backend**:
   - Use a production WSGI server like Gunicorn
   - Set up proper environment variables
   - Use PostgreSQL for the database
   - Configure proper CORS settings

2. **Frontend**:
   - Build the production bundle: `npm run build`
   - Serve static files with a web server like Nginx
   - Configure API endpoint URLs

### Docker Deployment

Create `docker-compose.yml` for easy deployment:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/jade_ai
    depends_on:
      - db
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=jade_ai
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.

## Roadmap

- [ ] Advanced AI models for better matching accuracy
- [ ] Bulk resume processing
- [ ] Integration with job boards
- [ ] Advanced reporting and analytics
- [ ] Mobile application
- [ ] API rate limiting and caching
- [ ] Multi-language support