const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendOrderConfirmationEmail = async ({ email, customer_name, itemsArray, total_amount, orderId, address }) => {
    try {
        const itemRows = itemsArray.map(item => `<li>Product ID: ${item.product_id} - Qty: ${item.quantity} - Price: Rs. ${item.price}</li>`).join('');

        const mailOptions = {
            from: `"UZquettaStore" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Order Confirmation - Order #${orderId}`,
            html: `
        <h2>Hi ${customer_name},</h2>
        <p>Thank you for your order! Your order has been placed successfully.</p>
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Total Amount:</strong> Rs. ${total_amount}</p>
        <p><strong>Shipping Address:</strong> ${address}</p>
        <h3>Order Items:</h3>
        <ul>
          ${itemRows}
        </ul>
        <br/>
        <p>Thanks for shopping with UZquettaStore.</p>
      `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error sending email to ${email}: ${error.message}`);
    }
};

const sendAdminNotificationEmail = async ({ customer_name, itemsArray, total_amount, orderId, paymentMethod, screenshot_url }) => {
    try {
        const itemRows = itemsArray.map(item => `<li>Product ID: ${item.product_id} - Qty: ${item.quantity} - Price: Rs. ${item.price}</li>`).join('');

        const html = `
      <h2>New Order Received (#${orderId})</h2>
      <p><strong>Customer:</strong> ${customer_name}</p>
      <p><strong>Total Amount:</strong> Rs. ${total_amount}</p>
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      ${screenshot_url ? `<p><strong>Attachment:</strong> <a href="${process.env.FRONTEND_URL}${screenshot_url}">View Screenshot</a></p>` : ''}
      <h3>Items:</h3>
      <ul>
        ${itemRows}
      </ul>
    `;

        const mailOptions = {
            from: `"UZquettaStore System" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Admin email
            subject: `New Order #${orderId} - ${paymentMethod}`,
            html,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error sending admin notification: ${error.message}`);
    }
};

module.exports = {
    sendOrderConfirmationEmail,
    sendAdminNotificationEmail
};
