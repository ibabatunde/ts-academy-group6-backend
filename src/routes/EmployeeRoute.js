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
router.post('/login', employeeController.loginEmployee);

/**
 * @swagger
 * /api/v1/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
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
 * /api/v1/employees/payroll:
 *   get:
 *     summary: Get all payrolls
 *     tags: [Payroll]
 *     responses:
 *       200:
 *         description: List of payrolls
 */
router.get(
  '/payroll',
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payroll ID
 *         schema:
 *           type: string
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Payroll ID
 *         schema:
 *           type: string
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
 * /payrolls/{payrollId}/attendance/{logId}:
 *   delete:
 *     summary: "Admin only: revert a single attendance log entry"
 *     tags: [Payrolls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: payrollId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the payroll to modify
 *         example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the specific attendance log entry to remove
 *         example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *     responses:
 *       200:
 *         description: Attendance entry reverted and netPay adjusted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Attendance entry reverted successfully"
 *                 payroll:
 *                   $ref: '#/components/schemas/Payroll'
 *       400:
 *         description: Payroll is already marked as Paid — revert blocked
 *       404:
 *         description: Payroll or attendance log entry not found
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