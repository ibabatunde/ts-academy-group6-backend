const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController');
const authenticate = require('../middleware/authenticate');
const authorizeRoles = require('../middleware/authorizeRoles');

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - role
 *         - department
 *         - baseSalary
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated employee ID
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: ['Admin', 'Manager', 'Employee']
 *         department:
 *           type: string
 *         baseSalary:
 *           type: number
 *         bankDetails:
 *           type: object
 *           properties:
 *             accountNumber:
 *               type: string
 *             bankName:
 *               type: string
 */

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management
 */

/**
 * @swagger
 * /api/v1/employees/register:
 *   post:
 *     summary: Register a new employee
 *     tags: [Employees]   
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Invalid input
 */
// POST /api/v1/employees/register

router.post(
    '/register', 
    authenticate, 
    authorizeRoles('Admin'), 
    employeeController.createEmployee
);

/**
 * @swagger
 * /api/v1/employees/login:
 *   post:
 *     summary: Login an employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

// POST /api/v1/employees/login

router.post('/login', employeeController.loginEmployee);

module.exports = router;