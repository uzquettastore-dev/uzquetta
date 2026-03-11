const pool = require('../config/db');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const { rows: existingUsers } = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { rows: result } = await pool.query(
            'INSERT INTO Users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
            [name, email, hashedPassword]
        );

        const user = {
            id: result[0].id,
            name,
            email,
            role: 'customer'
        };

        res.status(201).json({
            ...user,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Special Admin Login Check from .env
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@uzquettastore.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (email === adminEmail && password === adminPassword) {
            let { rows: users } = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
            let adminUser;

            if (users.length === 0) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const { rows: result } = await pool.query(
                    'INSERT INTO Users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
                    ['Admin', email, hashedPassword, 'admin']
                );
                adminUser = { id: result[0].id, name: 'Admin', email, role: 'admin' };
            } else {
                adminUser = users[0];
                if (adminUser.role !== 'admin') {
                    await pool.query('UPDATE Users SET role = $1 WHERE id = $2', ['admin', adminUser.id]);
                    adminUser.role = 'admin';
                }
            }

            return res.json({
                id: adminUser.id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role,
                token: generateToken(adminUser.id),
            });
        }

        // Normal Customer Login
        const { rows: users } = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // Prevent Admin from logging in through normal customer flow if they try with wrong password
        if (user.role === 'admin' && (email !== adminEmail || password !== adminPassword)) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const { rows: users } = await pool.query('SELECT id, name, email, phone, address, role FROM Users WHERE id = $1', [req.user.id]);

        if (users.length > 0) {
            res.json(users[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const { rows: users } = await pool.query('SELECT * FROM Users WHERE id = $1', [req.user.id]);

        if (users.length > 0) {
            const user = users[0];
            const name = req.body.name || user.name;
            const email = req.body.email || user.email;
            const phone = req.body.phone || user.phone;
            const address = req.body.address || user.address;

            let password = user.password;
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(req.body.password, salt);
            }

            await pool.query(
                'UPDATE Users SET name = $1, email = $2, phone = $3, address = $4, password = $5 WHERE id = $6',
                [name, email, phone, address, password, req.user.id]
            );

            res.json({
                id: user.id,
                name,
                email,
                phone,
                address,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
};
