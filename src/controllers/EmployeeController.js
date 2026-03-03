const Employee = require('../models/Employee');
const generateAuthToken = require('../utils/generateAuthToken');
const sendMail = require('../utils/mailer');

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
// update new password
exports.updatepassword = async (req,res) => {
try{
        const {email,oldPassword, NewPassword } = req.body;
        if(!email || !oldPassword) {
            return res.status(400).json({message: 'Email and OldPassword are required'});
        }
const employee = await Employee.findOne ({email});
     if(!employee) {
        return res.status (400).json({message:'invalid email or passord'})
     }

     const isMatch = await employee.comparePassword (oldPassword);
     if (!isMatch){
        return res.status (400).json({message: 'invalid email or passsword'})
    }
   

//bcrypt password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(NewPassword, salt);

//update Password
employee.password = hashedPassword;

//save changes 
await employee.save();

//send a success response 
res.status(200) .json ({message: `Password update sucessfully`});
}
catch(error){
    console.log(error)
    res.status(500).json({messgae:`server error while updating password`, error: error.message});
}
}