const Employee = require('../models/Employee');
const PasswordToken = require('../models/PasswordToken');
const generateAuthToken = require('../utils/generateAuthToken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const sendEmail = require('../utils/mailer');

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

        const employee = await Employee.create({
            firstName,
            lastName,
            email,
            password,
            role,
            department,
            baseSalary,
            bankDetails
        });

        const token = generateAuthToken(employee);

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        //Remove any existing passwordSetups for this employee
        await PasswordToken.deleteMany({
            employeeId: employee._id,
        })

        var userToken = new PasswordToken({
            employeeId: employee._id,
            passwordSetupToken : hashedToken,
            passwordSetupExpires : new Date(
                Date.now() + 30 * 60 * 1000  //30 minutes
            )  
        })       
       
        const setupLink = `${process.env.FRONTEND_URL}/setup-password?token=${token}`
        
        const emailDetails = { 
            subject: "Set up your password",
            html:` <h2>Welcome, </h2>
                    <p>Please click the link below to set up your password:</p>

                    <a href="${setupLink}">${setupLink}</a>

                    <p>This link expires in 30 minutes.</p>

                    <h3>Thank you</h3> `
        };
       
        await sendEmail(emailDetails.subject, emailDetails.html, email);
        await userToken.save();
        
        const employeeData = employee.toObject();
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
        const { token  } = req.query;
        const { password} = req.body;

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

        const passwordToken = await PasswordToken.findOne({
            passwordSetupToken: hashedToken,
            passwordSetupExpires: { $gt: Date.now() }
        }).populate("employeeId");

        if (!passwordToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            })
        }

        const employee = passwordToken.employeeId;
        employee.password = password            

        await employee.save();

        await passwordToken.deleteOne();

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
