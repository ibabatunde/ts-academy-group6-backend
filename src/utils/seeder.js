require('dotenv').config({ path: 'properties.env' });
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

const employees = [
    {
        firstName: "Admin",
        lastName: "User",
        email: "admin@payroll.com",
        password: "admin123",
        role: "Admin",
        department: "Management",
        baseSalary: 100000,
        bankDetails: { accountNumber: "123456", bankName: "GT Bank" }
    },
    {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@payroll.com",
        password: "password123",
        role: "Employee",
        department: "Engineering",
        baseSalary: 75000,
        bankDetails: { accountNumber: "654321", bankName: "Access Bank" }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for seeding...");

        await Employee.deleteMany();
        console.log("Cleared old employees.");

        await Employee.create(employees);
        
        console.log("Database Seeded Successfully!");
        process.exit();
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedDB();