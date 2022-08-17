const { User } = require('../models');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secretKey = process.env.secretkey_jwt
const register = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (password.length < 8) {
        return res.json({ error: 'Password must be at least 8 chars' })
    }

    const encryptedPassword = bcrypt.hashSync(password, 10)

    try {
        let user = {};
        user = await User.findOne({ where: { username: username } })
        if (user) {
            return res.json({ message: 'User is already registered!' })
        }
        let data = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            password: encryptedPassword
        })
        return res.status(201).send({
            message: 'Registrasi berhasil.',
            id: data.id,
            username: data.username
        })
    } catch {
        return res.status(404).send({
            err: 'Server is Error'
        })
    }
}

const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        let user = {};
        user = await User.findOne({
            where: { username: username }
        })
        if (!user) {
            return res.json({ message: 'User Not Found!' })
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) {
            return res.json({ message: 'Username or Password Wrong!!' })
        }

        const accesToken = jwt.sign({
            id: user.id,
            username: user.username
        }, secretKey)

        return res.status(201).send({
            id: user.id,
            username: user.username,
            accesToken: accesToken
        })
    } catch {
        return res.status(404).send({
            message: 'Server is Error!'
        })
    }
}

const profile = async (req, res) => {
    try {
        const currentUser = req.user;

        return res.status(201).send({
            id: currentUser.id,
            username: currentUser.username
        })
    } catch {
        return res.status(404).send({
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
    const userId = req.params.id
    // if (isNaN(userId)) {
    //     return res.status(400).json({
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
        return res.status(404).json({
            message: 'Server is Error'
        })
    }
}

const update = async (req, res) => {
    try {
        const password = req.body.password;
        const encryptedPassword = bcrypt.hashSync(password, 10)
        
        let user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(401).send({
                message: 'User tidak ditemukan.'
            })
        }
        await user.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: encryptedPassword
        })
        return res.status(201).send({
            message: 'User berhasil diperbarui.',
            result: user
        })
    } catch {
        return res.status(404).send({
            message: 'User gagal diperbarui.'
        })
    }
}

const deleteById = async (req, res) => {
    try {
        let user = {};
        user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send({
                message: 'User tidak ditemukan.'
            })
        }

        await user.destroy()
        return res.status(201).send({
            message: 'User berhasil dihapus.'
        })
    } catch {
        return res.status(404).send({
            message: 'User gagal dihapus.'
        })
    }
}

module.exports = {
    register,
    login,
    profile,
    list,
    getById,
    update,
    deleteById
}