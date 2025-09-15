const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Database setup
const db = new sqlite3.Database('./jade_ai.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Resumes table
  db.run(`CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    skills TEXT,
    experience_years REAL,
    education TEXT,
    jade_format TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    owner_id INTEGER,
    FOREIGN KEY (owner_id) REFERENCES users (id)
  )`);

  // Job descriptions table
  db.run(`CREATE TABLE IF NOT EXISTS job_descriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    content TEXT NOT NULL,
    title TEXT,
    company TEXT,
    location TEXT,
    required_skills TEXT,
    preferred_skills TEXT,
    experience_required REAL,
    education_required TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    owner_id INTEGER,
    FOREIGN KEY (owner_id) REFERENCES users (id)
  )`);

  // Matches table
  db.run(`CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_percentage REAL NOT NULL,
    skills_match REAL,
    experience_match REAL,
    education_match REAL,
    overall_feedback TEXT,
    strengths TEXT,
    weaknesses TEXT,
    recommendations TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resume_id INTEGER,
    jd_id INTEGER,
    owner_id INTEGER,
    FOREIGN KEY (resume_id) REFERENCES resumes (id),
    FOREIGN KEY (jd_id) REFERENCES job_descriptions (id),
    FOREIGN KEY (owner_id) REFERENCES users (id)
  )`);

  // Jade templates table
  db.run(`CREATE TABLE IF NOT EXISTS jade_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    owner_id INTEGER,
    FOREIGN KEY (owner_id) REFERENCES users (id)
  )`);
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads', file.fieldname);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Jade AI Backend API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
app.post('/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (user) {
        return res.status(400).json({ error: 'Email or username already exists' });
      }
      
      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);
      
      // Insert user
      db.run('INSERT INTO users (email, username, hashed_password) VALUES (?, ?, ?)', 
        [email, username, hashedPassword], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }
          
          res.status(201).json({
            id: this.lastID,
            email,
            username,
            is_active: true,
            created_at: new Date().toISOString()
          });
        });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user || !bcrypt.compareSync(password, user.hashed_password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { sub: user.id.toString() },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );
      
      res.json({
        access_token: token,
        token_type: 'bearer'
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Resume routes
app.post('/resumes/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { originalname, filename, path: filePath, size } = req.file;
    
    // For now, we'll just store the file info
    // In a real implementation, you'd parse the file content here
    const content = `File uploaded: ${originalname}`;
    const summary = `Resume summary for ${originalname}`;
    
    db.run(
      'INSERT INTO resumes (filename, original_filename, file_path, file_size, content, summary, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [filename, originalname, filePath, size, content, summary, req.user.sub],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to save resume' });
        }
        
        res.status(201).json({
          id: this.lastID,
          filename,
          original_filename: originalname,
          file_size: size,
          content,
          summary,
          created_at: new Date().toISOString(),
          owner_id: req.user.sub
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/resumes', authenticateToken, (req, res) => {
  db.all('SELECT * FROM resumes WHERE owner_id = ?', [req.user.sub], (err, resumes) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(resumes);
  });
});

// Job description routes
app.post('/jds/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { originalname, filename, path: filePath, size } = req.file;
    
    const content = `Job description uploaded: ${originalname}`;
    const title = `Job Title from ${originalname}`;
    
    db.run(
      'INSERT INTO job_descriptions (filename, original_filename, file_path, file_size, content, title, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [filename, originalname, filePath, size, content, title, req.user.sub],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to save job description' });
        }
        
        res.status(201).json({
          id: this.lastID,
          filename,
          original_filename: originalname,
          file_size: size,
          content,
          title,
          created_at: new Date().toISOString(),
          owner_id: req.user.sub
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/jds', authenticateToken, (req, res) => {
  db.all('SELECT * FROM job_descriptions WHERE owner_id = ?', [req.user.sub], (err, jds) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(jds);
  });
});

// Match routes
app.post('/matches', authenticateToken, (req, res) => {
  try {
    const { resume_id, jd_id } = req.body;
    
    // Simple mock matching algorithm
    const match_percentage = Math.random() * 100;
    const skills_match = Math.random() * 100;
    const experience_match = Math.random() * 100;
    const education_match = Math.random() * 100;
    
    const overall_feedback = `This is a mock match analysis. Resume ${resume_id} matches Job Description ${jd_id} with ${match_percentage.toFixed(1)}% compatibility.`;
    
    db.run(
      'INSERT INTO matches (match_percentage, skills_match, experience_match, education_match, overall_feedback, resume_id, jd_id, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [match_percentage, skills_match, experience_match, education_match, overall_feedback, resume_id, jd_id, req.user.sub],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create match' });
        }
        
        res.status(201).json({
          id: this.lastID,
          match_percentage,
          skills_match,
          experience_match,
          education_match,
          overall_feedback,
          resume_id,
          jd_id,
          created_at: new Date().toISOString(),
          owner_id: req.user.sub
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/matches', authenticateToken, (req, res) => {
  db.all('SELECT * FROM matches WHERE owner_id = ?', [req.user.sub], (err, matches) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(matches);
  });
});

app.get('/matches/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM matches WHERE id = ? AND owner_id = ?', [id, req.user.sub], (err, match) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json(match);
  });
});

// Jade template routes
app.post('/jade/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { originalname, filename, path: filePath } = req.file;
    const content = fs.readFileSync(filePath, 'utf8');
    
    db.run(
      'INSERT INTO jade_templates (name, filename, file_path, content, owner_id) VALUES (?, ?, ?, ?, ?)',
      [originalname, filename, filePath, content, req.user.sub],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to save template' });
        }
        
        res.status(201).json({
          id: this.lastID,
          name: originalname,
          filename,
          content,
          is_active: false,
          created_at: new Date().toISOString(),
          owner_id: req.user.sub
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/jade/templates', authenticateToken, (req, res) => {
  db.all('SELECT * FROM jade_templates WHERE owner_id = ?', [req.user.sub], (err, templates) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(templates);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Jade AI Backend Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/docs`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});
