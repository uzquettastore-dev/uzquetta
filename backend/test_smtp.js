const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const testMail = async () => {
    console.log('Testing SMTP with user:', process.env.SMTP_USER);
    try {
        const info = await transporter.sendMail({
            from: `"SMTP Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: 'SMTP Credentials Test',
            text: 'If you receive this, your SMTP settings are correct!',
            html: '<b>If you receive this, your SMTP settings are correct!</b>'
        });
        console.log('Success! Message ID:', info.messageId);
    } catch (error) {
        console.error('SMTP Error:', error.message);
        if (error.code === 'EAUTH') {
            console.log('\nTIP: This is an Authentication Error.');
            console.log('1. Make sure SMTP_USER is your correct Gmail.');
            console.log('2. Make sure SMTP_PASS is a 16-character "App Password", NOT your regular password.');
            console.log('3. "2-Step Verification" must be enabled on your Google account.');
        }
    }
};

testMail();
