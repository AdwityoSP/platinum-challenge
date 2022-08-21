const { Transaction } = require('../models');
const { User } = require('../models');
const { Item } = require('../models');
const { Order } = require('../models');

const add = async (req, res) => {
    try {
        const userId = await User.findOne({ where: { id: req.body.userId } })
        if (!userId) {
            return res.json({ message: 'User tidak ditemukan' })
        }

        const orderId = await Order.findOne({ where: { id: req.body.orderId } })
        if (!orderId) {
            return res.json({ message: 'Order tidak ditemukan' })
        }

        const itemId = await Item.findOne({ where: { id: req.body.itemId } })
        if (!itemId) {
            return res.json({ message: 'Item tidak ditemukan' })
        }

        let result;
        result = await Transaction.create({
            userId: req.body.userId,
            orderId: req.body.orderId,
            itemId: req.body.itemId
        })
        return res.status(200).json({
            message: 'Transaksi berhasil ditambahkan.',
            result: result
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Transaksi gagal ditambahkan.',
            err: err
        })
    }
}

const list = async (req, res) => {
    try {
        let result;
        result = await Transaction.findAll()

        return res.status(200).json(result)
    } catch {
        return res.status(500).json({
            message: 'Server is error.'
        })
    }
}

const getById = async (req, res) => {
    try {
        let transaction;
        transaction = await Transaction.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'users'
                },
                {
                    model: Order,
                    as: 'orders'
                },
                {
                    model: Item,
                    as: 'items'
                }
            ]
        })

        if (!transaction) {
            return res.status(500).json({
                message: 'Transaksi tidak ditemukan.'
            })
        }
        return res.status(200).json(transaction)
    } catch {
        return res.status(500).json({
            message: 'Server is error.'
        })
    }
}

const update = async (req, res) => {
    try {
        let transaction = await Transaction.findByPk(req.params.id)
        if (!transaction) {
            return res.status(500).json({
                message: 'Transaksi tidak ditemukan.'
            })
        }

        await transaction.update({
            userId: req.body.userId,
            orderId: req.body.orderId,
            itemId: req.body.itemId
        })
        return res.status(200).json({
            message: 'Transaksi berhasil diperbarui.',
            result: transaction
        })
    } catch {
        return res.status(500).json({
            message: 'Server is error.'
        })
    }
}

const deleteById = async (req, res) => {
    try {
        let transaction = await Transaction.findByPk(req.params.id)
        if (!transaction) {
            return res.status(500).send({
                message: 'Transaksi tidak ditemukan.'
            })
        }

        await transaction.destroy()
        return res.status(200).send({
            message: 'Transaksi berhasil dihapus.'
        })
    } catch {
        return res.status(500).send({
            message: 'Server is error.'
        })
    }
}

module.exports = {
    add,
    list,
    getById,
    update,
    deleteById
}