const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: String, required: true }, 
    year: { type: Number, required: true }, 
    netPay: Number, // Update the value after every login
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    processedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payroll', payrollSchema);