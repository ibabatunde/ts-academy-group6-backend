const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Manager', 'Employee'], default: 'Employee' },
    department: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    bankDetails: {
        accountNumber: String,
        bankName: String
    },
    isLeaveApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        next(err);
    }
});

employeeSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);