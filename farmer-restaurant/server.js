const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the root directory (where index.html is)
app.use(express.static(path.join(__dirname, '')));

// Database file path
const dbPath = path.join(__dirname, 'submissions.json');

// Initialize database file if it doesn't exist
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
}

// API Route to handle form submissions
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// API Route to handle image upload from Restaurant Dashboard
app.post('/api/upload-waste', upload.single('wasteImage'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }
        console.log('Received organic waste image:', req.file.originalname);
        res.status(200).json({ success: true, message: 'Image uploaded successfully!', path: req.file.path });
    } catch (error) {
        console.error('Error handling upload:', error);
        res.status(500).json({ success: false, message: 'Internal server error during upload' });
    }
});

app.post('/api/join', (req, res) => {
    try {
        const newSubmission = req.body;

        // Basic validation
        if (!newSubmission.name || !newSubmission.email || !newSubmission.role) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Add timestamp
        newSubmission.timestamp = new Date().toISOString();

        // Read existing data
        const data = fs.readFileSync(dbPath, 'utf8');
        const submissions = JSON.parse(data);

        // Add new submission
        submissions.push(newSubmission);

        // Save back to file
        fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));

        console.log('New ecosystem partner joined:', newSubmission.name, `(${newSubmission.role})`);

        res.status(201).json({ success: true, message: 'Successfully joined the ecosystem!' });
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running!`);
    console.log(`- Local: http://localhost:${PORT}`);
});
