const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController');
const authorizeRoles = require('../middleware/authorizeRoles');

// POST /api/v1/employees/register
router.post('/register', authorizeRoles('Admin'), employeeController.createEmployee);

// POST /api/v1/employees/login
router.post('/login', employeeController.loginEmployee);

module.exports = router;