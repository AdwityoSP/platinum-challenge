const { User } = require('../models');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const transporter = require('../helpers/transporter');
const secretKey = process.env.SECRETKEY_JWT

const register = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const pass = req.body.password;

    const checkUser = await User.findOne({ where: { username: username } });
    if (checkUser) {
        return res.status(500).json({ message: 'Email or username has been already taken' });
    }
    const checkEmail = await User.findOne({ where: { email: email } });
    if (checkEmail) {
        return res.status(500).json({ message: 'Email or username has been already taken' });
    }

    try {
        if (pass.length < 8) {
            return res.status(500).json('Password At Least 8 Characters');
        }

        const encryptedPassword = bcrypt.hashSync(pass, 10);
        const token = jwt.sign({}, secretKey, {
            expiresIn: '1d'
        })

        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: username,
            email: email,
            password: encryptedPassword,
            role: req.body.role,
            token: token,
            isVerified: false,
            isExpired: false,
        }

        await User.create(data)

        const mail = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Verifikasi',
            text: `Link verifikasi: http://localhost:3000/api/user/verify/${token}`,
        }

        transporter.sendMail(mail, (err, info) => {
            if (err) {
                console.log(err);
            }
        })
        return res.status(200).json({ message: 'Link verifikasi sudah dikirim melalui email' });
    } catch {
        return res.json({ message: 'Internal Server Error' });
    }
}

const verification = async (req, res) => {
    try {
        const token = req.params.token;
        const userByToken = await User.findOne({
            where: { token: token }
        })

        if (userByToken) {
            const validateToken = userByToken.isExpired;
            if (validateToken) {
                return res.status(500).json({
                    message: 'Token expired!'
                })
            }

            await User.update(
                {
                    isVerified: true,
                    isExpired: true
                }, {
                where: { token: token }
            }
            )
            return res.status(200).json({
                message: 'User berhasil di verifikasi!'
            })
        }
        return res.status(500).json({
            message: 'Token tidak valid'
        })
    } catch {
        return res.status(500).json({
            message: 'Server is Error'
        })
    }
}

const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({
            where: { email: email, isVerified: true },
        })
        if (!user) {
            return res.json({ message: 'Lakukan verifikasi dahulu!' })
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) {
            return res.json({ message: 'Email or Password Wrong!!' })
        }

        const accessToken = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, secretKey, {
            expiresIn: '1d'
        })

        return res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role,
            accessToken: accessToken
        })
    } catch {
        return res.status(500).json({
            message: 'Server is Error!'
        })
    }
}

const authorization = async (req, res) => {
    try {
        const currentUser = req.user;

        return res.status(200).json({
            id: currentUser.id,
            username: currentUser.username,
            role: currentUser.role
        })
    } catch {
        return res.status(500).json({
            message: 'Server is Error'
        })
    }
}

const list = async (req, res) => {
    try {
        let result = await User.findAll()

        return res.status(200).json(result)
    } catch {
        return res.status(500).json({
            message: 'Server is Error'
        })
    }
}

const getById = async (req, res) => {
    const userId = req.params.id;
    // if (isNaN(userId)) {
    //     return res.json({
    //         message: 'userId harus angka'
    //     })
    // }

    try {
        let user = await User.findByPk(userId);
        if (!user) {
            return res.status(500).json({
                message: 'User not found!'
            })
        }
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({
            message: 'Server is Error'
        })
    }
}

const update = async (req, res) => {
    const password = req.body.password;
    const encryptedPassword = bcrypt.hashSync(password, 10)
    const userId = req.params.id;

    try {
        let user = await User.findByPk(userId);
        if (!user) {
            return res.status(500).json({
                message: 'User tidak ditemukan.'
            })
        }
        await User.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: encryptedPassword,
            role: req.body.role
        })
        return res.status(200).json({
            message: 'User berhasil diperbarui.',
            result: user
        })
    } catch {
        return res.status(500).json({
            message: 'User gagal diperbarui.'
        })
    }
}

const deleteById = async (req, res) => {
    try {
        let user = {};
        user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(500).json({
                message: 'User tidak ditemukan.'
            })
        }

        await User.destroy()
        return res.status(200).json({
            message: 'User berhasil dihapus.'
        })
    } catch {
        return res.status(500).json({
            message: 'User gagal dihapus.'
        })
    }
}

module.exports = {
    register,
    verification,
    login,
    authorization,
    list,
    getById,
    update,
    deleteById,
}