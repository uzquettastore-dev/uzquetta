const pool = require('../config/db');
// NodeMailer imported
const { sendOrderConfirmationEmail, sendAdminNotificationEmail } = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const {
        orderItems, // Array of { product_id, quantity, price }
        customer_name,
        email,
        phone,
        address,
        delivery_charges,
        paymentMethod,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    const client = await pool.getConnection();

    try {
        await client.query('BEGIN');

        // 1. Calculate total amount
        let itemsArray = typeof orderItems === 'string' ? JSON.parse(orderItems) : orderItems;

        let itemsTotal = 0;
        for (let item of itemsArray) {
            itemsTotal += Number(item.price) * Number(item.quantity);

            // Check stock before proceeding
            const { rows: productData } = await client.query('SELECT stock FROM Products WHERE id = $1', [item.product_id]);
            if (productData.length === 0) throw new Error(`Product ID ${item.product_id} not found`);
            if (productData[0].stock < item.quantity) {
                throw new Error(`Insufficient stock for product ID ${item.product_id}`);
            }
        }

        const total_amount = itemsTotal + Number(delivery_charges);

        // 2. Insert into Orders
        const { rows: orderResult } = await client.query(
            `INSERT INTO Orders (
        user_id, customer_name, email, phone, address, 
        total_amount, delivery_charges, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending') RETURNING id`,
            [req.user ? req.user.id : null, customer_name, email, phone, address, total_amount, delivery_charges]
        );

        const orderId = orderResult[0].id;

        // 3. Insert into OrderItems and reduce stock
        for (let item of itemsArray) {
            await client.query(
                'INSERT INTO OrderItems (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, item.price]
            );

            // Reduce stock
            await client.query(
                'UPDATE Products SET stock = stock - $1 WHERE id = $2',
                [item.quantity, item.product_id]
            );
        }

        // 4. Insert into Payments
        let screenshot_url = null;
        if (req.file) {
            screenshot_url = req.file.path;
        }

        await client.query(
            'INSERT INTO Payments (order_id, method, status, screenshot_url) VALUES ($1, $2, $3, $4)',
            [orderId, paymentMethod, 'Pending', screenshot_url]
        );

        await client.query('COMMIT');

        // 5. Send Emails
        sendOrderConfirmationEmail({ email, customer_name, itemsArray, total_amount, orderId, address });
        sendAdminNotificationEmail({ customer_name, itemsArray, total_amount, orderId, paymentMethod, screenshot_url });

        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(400).json({ message: error.message });
    } finally {
        client.release();
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const { rows: orders } = await pool.query('SELECT * FROM Orders WHERE id = $1', [req.params.id]);

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orders[0];

        // Check if user is admin or the order belongs to user
        if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to view this order' });
        }

        const { rows: orderItems } = await pool.query(`
      SELECT oi.*, p.name as product_name, p.image_url 
      FROM OrderItems oi 
      JOIN Products p ON oi.product_id = p.id 
      WHERE oi.order_id = $1`,
            [order.id]
        );
        const { rows: payments } = await pool.query('SELECT * FROM Payments WHERE order_id = $1', [order.id]);

        res.json({
            ...order,
            orderItems,
            payment: payments[0] || null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update payment status to verified
// @route   PUT /api/orders/:id/verify
// @access  Private/Admin
const updateOrderToVerified = async (req, res) => {
    try {
        const result = await pool.query(
            'UPDATE Payments SET status = $1 WHERE order_id = $2',
            [req.body.status || 'Verified', req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Order payment not found' });
        }

        res.json({ message: 'Payment status updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const result = await pool.query(
            'UPDATE Orders SET status = $1 WHERE id = $2',
            [req.body.status, req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const { rows: orders } = await pool.query('SELECT * FROM Orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const { rows: orders } = await pool.query(`
      SELECT o.*, p.method as payment_method, p.status as payment_status 
      FROM Orders o 
      LEFT JOIN Payments p ON o.id = p.order_id 
      ORDER BY o.created_at DESC
    `);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToVerified,
    updateOrderStatus,
    getMyOrders,
    getOrders,
};
