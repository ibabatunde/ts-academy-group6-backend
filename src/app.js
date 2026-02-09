const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json()); 
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({ message: "Payroll System API is active" });
});

const employeeRoutes = require('./routes/EmployeeRoute');
app.use('/api/v1/employees', employeeRoutes);
module.exports = app;