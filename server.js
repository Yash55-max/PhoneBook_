const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Increase body size limit to 10mb for image Data URLs
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' })); // Limit to 1MB for images

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling for payload too large and JSON parse errors
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        console.error('Payload too large');
        return res.status(413).send('Payload too large');
    }
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON');
        return res.status(400).send('Bad JSON');
    }
    next();
});

let contacts = [];
let id = 1;

// Get all contacts
app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

// Add a new contact
app.post('/api/contacts', (req, res) => {
    console.log('POST /api/contacts');
    console.log('Request body keys:', Object.keys(req.body));
    if (req.body.image) {
        console.log('Image field length:', req.body.image.length);
    }
    const contact = { ...req.body, _id: id++ };
    contacts.push(contact);
    res.status(201).json(contact);
});

// Update a contact
app.put('/api/contacts/:id', (req, res) => {
    console.log('PUT /api/contacts/' + req.params.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request body keys:', Object.keys(req.body));
    
    const contactId = parseInt(req.params.id, 10);
    const index = contacts.findIndex(c => c._id === contactId);
    
    if (index === -1) {
        console.log('Contact not found with ID:', contactId);
        return res.status(404).send('Contact not found');
    }
    
    console.log('Current contact:', JSON.stringify(contacts[index], null, 2));
    
    // Update all fields from request body
    const updatedContact = { ...contacts[index], ...req.body };
    
    // Only update image if provided, otherwise keep the old image
    if (typeof req.body.image === "undefined") {
        updatedContact.image = contacts[index].image;
    }
    
    contacts[index] = updatedContact;
    console.log('Updated contact:', JSON.stringify(contacts[index], null, 2));
    
    res.json(contacts[index]);
});

// Delete a contact
app.delete('/api/contacts/:id', (req, res) => {
    const contactId = parseInt(req.params.id, 10);
    contacts = contacts.filter(c => c._id !== contactId);
    res.status(204).send();
});

// Catch-all error handler for unexpected errors
app.use((err, req, res, next) => {
    console.error('UNEXPECTED ERROR:', err);
    res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}/api/contacts`);
});

