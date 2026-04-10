const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

const logEmail = (message) => {
    const timestamp = new Date().toISOString();
    try {
        const absoluteLogPath = path.resolve(process.cwd(), 'email_debug.log');
        fs.appendFileSync(absoluteLogPath, `[${timestamp}] ${message}\n`);
    } catch (e) {
        console.error('Log write failed:', e.message);
    }
};

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
});

const sendOrderConfirmationEmail = async ({ email, customer_name, itemsArray, total_amount, orderId, address }) => {
    try {
        const itemRows = itemsArray.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.price}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"UZquettaStore" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Order Confirmed! #${orderId} - UZquettaStore`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #d4af37; margin: 0;">UZquettaStore</h1>
                        <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 12px; color: #888;">Order Confirmation</p>
                    </div>
                    
                    <h2 style="font-size: 18px;">Hi ${customer_name},</h2>
                    <p>Thank you for choosing UZquettaStore! Your order has been successfully placed and is now being processed.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Order ID:</strong> #${orderId}</p>
                        <p style="margin: 5px 0;"><strong>Shipping Address:</strong> ${address}</p>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background-color: #f4f4f4;">
                                <th style="padding: 10px; text-align: left;">Product</th>
                                <th style="padding: 10px; text-align: center;">Qty</th>
                                <th style="padding: 10px; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemRows}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Grand Total:</td>
                                <td style="padding: 10px; text-align: right; font-weight: bold; color: #d4af37;">Rs. ${total_amount}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
                        If you have any questions, feel free to contact us on WhatsApp.
                    </p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        logEmail(`Customer confirmation success for ${email}: ${info.messageId}`);
        return info;
    } catch (error) {
        logEmail(`Customer confirmation failed for ${email}: ${error.message}\nStack: ${error.stack}`);
        console.error(`Error sending email to ${email}: ${error.message}`);
        throw error;
    }
};

const sendAdminNotificationEmail = async ({ customer_name, itemsArray, total_amount, orderId, paymentMethod, screenshot_path }) => {
    try {
        const itemRows = itemsArray.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.price}</td>
            </tr>
        `).join('');

        const html = `
            <div style="font-family: sans-serif; color: #333;">
                <h2 style="color: #e53e3e;">New Order Alert! (#${orderId})</h2>
                <p>A new order has been placed on UZquettaStore.</p>
                
                <div style="background: #fdf2f2; padding: 15px; border-radius: 5px; border-left: 5px solid #e53e3e;">
                    <p><strong>Customer:</strong> ${customer_name}</p>
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                    <p><strong>Total Amount:</strong> <span style="font-size: 1.2em; font-weight: bold; color: #e53e3e;">Rs. ${total_amount}</span></p>
                </div>

                <h3>Order Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f4f4f4;">
                            <th style="padding: 8px; text-align: left;">Item</th>
                            <th style="padding: 8px; text-align: center;">Qty</th>
                            <th style="padding: 8px; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemRows}
                    </tbody>
                </table>
                
                ${screenshot_path ? `<p style="margin-top: 20px;"><strong>Note:</strong> Payment screenshot is attached to this email.</p>` : '<p><strong>Note:</strong> No screenshot provided (likely COD).</p>'}
            </div>
        `;

        const attachments = [];
        if (screenshot_path) {
            // Use directly if it's a URL (Cloudinary), resolve if it's a local path
            const isUrl = screenshot_path.startsWith('http');
            const finalPath = isUrl ? screenshot_path : path.resolve(process.cwd(), screenshot_path);
            
            attachments.push({
                filename: `payment_proof_${orderId}.png`,
                path: finalPath
            });
            logEmail(`Attaching screenshot (${isUrl ? 'URL' : 'Local'}): ${finalPath}`);
        }

        const mailOptions = {
            from: `"UZquettaStore Admin" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            subject: `[NEW ORDER] #${orderId} - ${paymentMethod}`,
            html,
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        logEmail(`Admin notification success: ${info.messageId}`);
        return info;
    } catch (error) {
        logEmail(`Admin notification failed: ${error.message}\nStack: ${error.stack}`);
        console.error(`Error sending admin notification: ${error.message}`);
        throw error;
    }
};

module.exports = {
    sendOrderConfirmationEmail,
    sendAdminNotificationEmail
};
