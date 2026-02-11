const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    passwordSetupToken:{
        type: String,
        required: true
    },
    passwordSetupExpires: {
        type: Date,
        required: true
    },
    employeeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', //references existing employee model
        required : true
    }
})

module.exports = mongoose.model('PasswordToken', tokenSchema);