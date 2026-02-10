const Employee = require('../models/Employee');
const generateAuthToken = require('../utils/generateAuthToken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const sendPasswordSetupEmail = require('../utils/mailer');

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

        const token = generateAuthToken(newEmployee);
        const salt = await bcrypt.genSalt(10);
        //const hashedToken = await bcrypt.hash(token, salt);
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        newEmployee.passwordSetupToken = hashedToken;
        newEmployee.passwordSetupExpires = new Date(
            Date.now() + 30 * 60 * 1000  //30 minutes
        );

        //this code block is effective when we have the 
        //front-end url as we expect a link to be sent to the user upon registration
        //For now, we should be able to test the setup-password endpoint
        //on postman upon successful registration of a user
        const setupLink = `${process.env.FRONTEND_URL}/setup-password?token=${token}`

        await sendPasswordSetupEmail(email, setupLink);

        await newEmployee.save();

        const employeeData = newEmployee.toObject();
        delete employeeData.password;

        res.status(201).json({
            message: "Employee created successfully. Password setup link sent",
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

exports.setupPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const employee = await Employee.findOne({
            passwordSetupToken: hashedToken,
            passwordSetupExpires: { $gt: Date.now() }
        })

        console.log(employee.password);
        if (!employee) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            })
        }

        employee.password = password     
        //Clear reset fields
        employee.passwordSetupExpires = undefined
        employee.passwordSetupToken = undefined

        await employee.save();

        console.log("After saving to db:", employee.password);

        res.status(200).json({ 
            success: true,
            message: "Password set successfully" 
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Some error occurred! Please try again',
            error: error.message
        })
    }
}
