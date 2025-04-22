const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Here you would normally add code to save the user to a database
    // For now, we'll just return a success message

    if (username && password) {
        res.status(200).send({ message: 'User registered successfully!' });
    } else {
        res.status(400).send({ message: 'Username and password are required!' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/registrationDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Schema and Model
const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  course: { type: String, required: true },
  dob: { type: Date, required: true },
});

const Registration = mongoose.model('Registration', registrationSchema);

// Routes
app.post('/register', async (req, res) => {
  try {
    const { name, email, phone, course, dob } = req.body;

    // Additional validation
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    if (age < 17 || age > 35) {
      return res.status(400).json({ error: 'Age must be between 17 and 35.' });
    }

    // Save registration to the database
    const registration = new Registration({ name, email, phone, course, dob });
    await registration.save();

    res.status(201).json({ message: 'Registration successful!' });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already registered.' });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to Shri Balaji Institute Registration Backend');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
SSSSSSS
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Registration submitted successfully!');
            window.location.href = 'success.html';
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (err) {
        console.error('Error submitting form:', err);
        alert('Error submitting form. Please try again later.');
    }
});
