const mongoose = require('mongoose');

const attendanceLogSchema = new mongoose.Schema({
    date:      { type: Date,   required: true },   // exact timestamp of login
    increment: { type: Number, required: true }    // amount added to netPay
}, { _id: true });                                  // keep _id so we can target a single log

const payrollSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: String, required: true }, 
    year: { type: Number, required: true }, 
    netPay: Number, // Update the value after every login
    attendanceLogs: { type: [attendanceLogSchema], default: [] },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    processedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payroll', payrollSchema);