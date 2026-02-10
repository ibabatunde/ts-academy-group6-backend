const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
})

const sendPasswordSetupEmail = async (email, link) => {
  await transporter.sendMail({
    from: `"Payroll Systems Ltd" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Set up your password",
    html: `
      <h2>Welcome, </h2>
      <p>Please click the link below to set up your password:</p>

      <a href="${link}">${link}</a>

      <p>This link expires in 30 minutes.</p>

      <h3>Thank you</h3>

    `,
  });
};      

module.exports = sendPasswordSetupEmail;