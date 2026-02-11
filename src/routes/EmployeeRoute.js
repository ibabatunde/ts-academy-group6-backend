const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController');
const authenticate = require('../middleware/authenticate');
const authorizeRoles = require('../middleware/authorizeRoles');

// POST /api/v1/employees/register
router.post(
    '/register', 
    authenticate, 
    authorizeRoles('Admin'), 
    employeeController.createEmployee
);

// POST /api/v1/employees/login
router.post('/login', employeeController.loginEmployee);
router.post('/setup-password', employeeController.setupPassword);

module.exports = router;