const Employee = require('../models/Employee');

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