const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const logEmail = (message) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(path.join(__dirname, 'email_debug_test.log'), `[${timestamp}] ${message}\n`);
};

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
});

const run = async () => {
    logEmail('Starting standalone test...');
    try {
        await transporter.sendMail({
            from: `"Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: 'Log Test',
            text: 'Test'
        });
        logEmail('Success in standalone');
    } catch (e) {
        logEmail(`Failed in standalone: ${e.message}`);
    }
};

run();
