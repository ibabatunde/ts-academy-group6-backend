const { MailtrapClient } = require("mailtrap");

const apiKey = process.env.MAILTRAP_API_KEY;
const isSandbox = process.env.MAILTRAP_USE_SANDBOX === 'true';
const inboxId = isSandbox ? Number(process.env.MAILTRAP_INBOX_ID) : undefined;

const client = new MailtrapClient({
    token: apiKey,
    sandbox: isSandbox,
    testInboxId: inboxId,
});

const sendMail = async ({ to, subject, text }) => {
    if (!to || !subject) {
        throw new Error('To and subject are required to send an email');
    }

    client
        .send({
            from: {
                name: 'Payroll Management System',
                email: 'pms@demomailtrap.co'
            },
            to: [{ email: to }],
            subject,
            text,
        })
        .then(() => {
            console.log(`Email sent to ${to} with subject "${subject}"`);
        })
        .catch((error) => {
            console.error(`Failed to send email to ${to}:`, error);
        });
};

module.exports = sendMail;
