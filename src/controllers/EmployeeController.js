const Employee = require('../models/Employee');
const generateAuthToken = require('../utils/generateAuthToken');

exports.createEmployee = async (req, res) => {

    try {
        const { firstName, lastName, email, password, role, department, baseSalary, bankDetails } = req.body;
        if (!firstName || !lastName || !email || !password || !role || !baseSalary || !department || !bankDetails) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee with this email already exists' });
        }

        const newEmployee = new Employee({
            firstName,
            lastName,
            email,
            password,
            role,
            department,
            baseSalary,
            bankDetails
        });

        await newEmployee.save();

        const employeeData = newEmployee.toObject();
        delete employeeData.password;

        res.status(201).json({
            message: "Employee created successfully",
            employee: employeeData
        });


    } catch (error) {
        res.status(500).json({ message: 'Server error while creating employee', error: error.message });
    }

}

exports.loginEmployee = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await employee.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateAuthToken(employee);

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error while logging in', error: error.message });
    }
}
