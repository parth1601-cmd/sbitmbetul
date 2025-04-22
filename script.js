const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// Middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file
app.use(express.static('public'));

// Route to handle registration form submission
app.post('/register', (req, res) => {
    const { name, email, phone, course, dob } = req.body;

    // Basic validation
    if (!name || !email || !phone || !course || !dob) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    // Prepare registration data
    const registrationData = {
        name,
        email,
        phone,
        course,
        dob,
        registrationDate: new Date()
    };

    // Save data to a JSON file (you can replace this with a database)
    fs.readFile('registrations.json', (err, data) => {
        let registrations = [];
        if (!err) {
            registrations = JSON.parse(data);
        }
        registrations.push(registrationData);

        fs.writeFile('registrations.json', JSON.stringify(registrations, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving registration data' });
            }
            res.status(200).json({ message: 'Registration successful!' });
        });
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
