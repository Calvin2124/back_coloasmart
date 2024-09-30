const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');


const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Authentification failed' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Authentification failed' });
        }

        req.user = user;
        next();
    }catch (err) {
        res.status(401).json({ message: 'You need to be authenticated' });
    }
}
module.exports = authMiddleware;