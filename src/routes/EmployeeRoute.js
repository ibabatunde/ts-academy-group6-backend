const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController');

// POST /api/v1/employees/register
router.post('/register', employeeController.createEmployee);

module.exports = router;