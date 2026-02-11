const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
})

const sendEmail = async (subject, html, email, from) => {
  await transporter.sendMail({
    from: from || `"Payroll Systems Ltd" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: html,
  });
};      

module.exports = sendEmail;