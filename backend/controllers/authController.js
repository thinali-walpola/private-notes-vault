const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!password) return res.status(400).json({ message: 'Password is required' });

    try {
        // Hash the password securely before inserting into SQL database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // SQL Query to insert the user
        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        
        db.run(query, [name, email, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ message: 'User already exists' });
                }
                return res.status(500).json({ message: err.message });
            }

            // 'this.lastID' returns the ID of the newly inserted row
            res.status(201).json({
                _id: this.lastID,
                name,
                email,
                token: generateToken(this.lastID)
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    
    db.get(query, [email], async (err, user) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        try {
            // Compare the text password with the hashed SQL password
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user.id)
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

module.exports = { registerUser, loginUser };