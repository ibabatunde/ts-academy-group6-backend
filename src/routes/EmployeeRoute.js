const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController');
const authenticate = require('../middleware/authenticate');
const authorizeRoles = require('../middleware/authorizeRoles');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
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
 *           format: email
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [Admin, Manager, Employee]
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
 *
 *     Payroll:
 *       type: object
 *       required:
 *         - employeeId
 *         - amount
 *         - payDate
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated payroll ID
 *         employeeId:
 *           type: string
 *           description: Reference to Employee
 *         amount:
 *           type: number
 *         payDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [Paid, Pending, Failed]
 */

/**
 * @swagger
 * tags:
 *   - name: Employees
 *     description: Employee management
 *   - name: Payroll
 *     description: Payroll management
 */

/**
 * @swagger
 * /api/v1/employees/register:
 *   post:
 *     summary: Register a new employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
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
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', employeeController.loginEmployee);

/**
 * @swagger
 * /api/v1/employees/update-password:
 *   put:
 *     summary: Update employee password
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     description: Update password using old password verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, oldPassword, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.put(
  '/update-password',
  authenticate,
  employeeController.updatePassword
);

/**
 * @swagger
 * /api/v1/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees
 */
router.get(
  '/',
  authenticate,
  authorizeRoles('Admin', 'Manager'),
  employeeController.getEmployees
);

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   get:
 *     summary: Get a single employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee details
 *       404:
 *         description: Employee not found
 */
router.get(
  '/:id',
  authenticate,
  authorizeRoles('Admin', 'Manager'),
  employeeController.getEmployee
);

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   put:
 *     summary: Update an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 */
router.put(
  '/:id',
  authenticate,
  authorizeRoles('Admin', 'Manager'),
  employeeController.updateEmployee
);

/**
 * @swagger
 * /api/v1/employees/payroll/all:
 *   get:
 *     summary: Get all payrolls
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payrolls
 */
router.get(
  '/payroll/all',
  authenticate,
  authorizeRoles('Admin', 'Manager'),
  employeeController.getPayrolls
);

/**
 * @swagger
 * /api/v1/employees/payroll/{id}:
 *   get:
 *     summary: Get a single payroll
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payroll ID
 *     responses:
 *       200:
 *         description: Payroll details
 *       404:
 *         description: Payroll not found
 */
router.get(
  '/payroll/:id',
  authenticate,
  authorizeRoles('Admin', 'Manager'),
  employeeController.getPayroll
);

/**
 * @swagger
 * /api/v1/employees/payroll/{id}:
 *   put:
 *     summary: Update a payroll record
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payroll ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payroll'
 *     responses:
 *       200:
 *         description: Payroll updated successfully
 *       404:
 *         description: Payroll not found
 */
router.put(
  '/payroll/:id',
  authenticate,
  authorizeRoles('Admin', 'Manager'),
  employeeController.updatePayroll
);

/**
 * @swagger
 * /api/v1/employees/payrolls/{payrollId}/attendance/{logId}:
 *   delete:
 *     summary: Admin only - revert a single attendance log entry
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: payrollId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance entry reverted successfully
 *       400:
 *         description: Payroll already paid
 *       404:
 *         description: Payroll or log not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/payrolls/:payrollId/attendance/:logId',
  authenticate,
  authorizeRoles('Admin', 'Manager'),
  employeeController.revertAttendance
);

module.exports = router;