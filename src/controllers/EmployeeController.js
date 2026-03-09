                                                                                                                                                                                        const Employee = require('../models/Employee');
const generateAuthToken = require('../utils/generateAuthToken');
const sendMail = require('../utils/mailer');
const Payroll = require('../models/Payroll');

const createEmployee = async (req, res) => {

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

        await sendMail({
            to: email,
            subject: 'Welcome to the Payroll Management System',
            text: `Hello ${firstName},\n\nYour employee account has been created successfully. You can now log in using the following credentials:\nEmail: ${email}\nPassword: ${password}\n\nBest regards,\nPayroll Management Team`
        });

        res.status(201).json({
            message: "Employee created successfully",
            employee: employeeData
        });


    } catch (error) {
        res.status(500).json({ message: 'Server error while creating employee', error: error.message });
    }

}

const loginEmployee = async (req, res) => {
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
const getEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ employee });
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching employee', error: error.message });
    }
}

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching employees', error: error.message });
    }
}
const getPayroll = async (req, res) => {
    const { id } = req.params;
    try {
        const payrolls = await Payroll.findById(id).populate('employeeId', 'firstName lastName email');
        if (!payrolls) {
            return res.status(404).json({ message: 'Payroll not found' });
        }
        res.status(200).json({ payrolls });
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching payroll', error: error.message });
    }
}
const getPayrolls = async (req, res) => {
    try {
        const payrolls = await Payroll.find();
        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching payrolls', error: error.message });
    }
}
const createPayroll = async (req, res) => {
    try {
        const payroll = await Payroll.create(req.body);
        res.status(200).json(payroll);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating payroll', error: error.message });
    }
};
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndUpdate(id, req.body);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const updatedEmployee = await Employee.findById(id);
        res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating employee', error: error.message });
    }
};
const updatePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const payroll = await Payroll.findByIdAndUpdate(id, req.body);
        if (!payroll) {
            return res.status(404).json({ message: 'Payroll not found' });
        }
        const updatedPayroll = await Payroll.findById(id);
        res.status(200).json({ message: 'Payroll updated successfully', payroll: updatedPayroll });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating payroll', error: error.message });
    }
};
module.exports = {
    createEmployee,
    loginEmployee,
    getEmployee,
    getEmployees,
    getPayroll,
    getPayrolls,
    createPayroll,
    updateEmployee,
    updatePayroll
};