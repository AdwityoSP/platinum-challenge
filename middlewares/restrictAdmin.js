require('dotenv').config()
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRETKEY_JWT;

const restrictAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.email = decoded.email;
        console.log('email:', req.email)

        req.role = decoded.role;
        console.log('role:', req.role)
        if (req.role === 'admin') {
            next();
        } else {
            return res.status(500).json({ message: 'Hanya admin yang bisa akses' })
        }
    })
}


module.exports = restrictAdmin;