const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));  // 'combined' is one of the log formats provided by morgan

// In-memory storage for sales data
let sales = [];

// POST endpoint to accept sales data
app.post('/sales', (req, res) => {
    const sale = req.body;
    console.log("Received POST request at /sales:");
    console.log(req.body); // This will log the posted data

    sales.push(sale);
    res.send('Sale added successfully');
});

// GET endpoint to retrieve sales data
app.get('/sales', (req, res) => {
    res.json(sales);
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
