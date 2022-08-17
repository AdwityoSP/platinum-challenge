const Transaction = require('../models').Transaction;
const User = require('../models').User;
const Item = require('../models').Item;
const Order = require('../models').Order;

const add = async (req, res) => {
    try {
        let result;
        result = await Transaction.create({
            userId: req.body.userId,
            orderId: req.body.orderId,
            itemId: req.body.itemId
        })
        return res.status(201).send({
            message: 'Transaksi berhasil ditambahkan.',
            result: result
        })
    } catch {
        return res.status(404).send({
            message: 'Transaksi gagal ditambahkan.'
        })
    }
}

const list = async (req, res) => {
    try {
        let result;
        result = await Transaction.findAll()

        return res.status(201).send(result)
    } catch {
        return res.status(400).send({
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
            return res.status(404).send({
                message: 'Transaksi tidak ditemukan.'
            })
        }
        return res.status(200).send(transaction)
    } catch {
        return res.status(404).send({
            message: 'Server is error.'
        })
    }
}

const update = async (req, res) => {
    try {
        let transaction = await Transaction.findByPk(req.params.id)
        if (!transaction) {
            return res.status(404).send({
                message: 'Transaksi tidak ditemukan.'
            })
        }

        await transaction.update({
            userId: req.body.userId,
            orderId: req.body.orderId,
            itemId: req.body.itemId
        })
        return res.status(201).send({
            message: 'Transaksi berhasil diperbarui.',
            result: transaction
        })
    } catch {
        return res.status(404).send({
            message: 'Server is error.'
        })
    }
}

const deleteById = async (req, res) => {
    try {
        let transaction = await Transaction.findByPk(req.params.id)
        if (!transaction) {
            return res.status(404).send({
                message: 'Transaksi tidak ditemukan.'
            })
        }

        await transaction.destroy()
        return res.status(201).send({
            message: 'Transaksi berhasil dihapus.'
        })
    } catch {
        return res.status(404).send({
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