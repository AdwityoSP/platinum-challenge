const User = require('../models').User;
const Order = require('../models').Order;

const add = async (req, res) => {
    try {
        let result;
        result = await Order.create({
            dateOrder: req.body.dateOrder,
            userId: req.body.userId,
            status: req.body.status
        })
        return res.status(200).send(result)
    } catch {
        return res.status(404).send({
            message: 'Order gagal ditambahkan.'
        })
    }
}

const list = async (req, res) => {
    try {
        let result = await Order.findAll()

        return res.status(200).send(result)
    } catch {
        return res.status(404).send({
            message: 'Server is error.'
        })
    }
}

const getById = async (req, res) => {
    try {
        let order;
        order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'users'
                }
            ]
        })

        if (!order) {
            return res.status(401).send({
                message: 'Order tidak ditemukan.'
            })
        }
        return res.status(200).send(order)
    } catch {
        return res.status(404).send({
            message: 'Server is error.'
        })
    }
}

const update = async (req, res) => {
    try {
        let order = await Order.findByPk(req.params.id)

        if (!order) {
            return res.status(401).send({
                message: 'Order tidak ditemukan.'
            })
        }
        await order.update({
            dateOrder: req.body.dateOrder,
            userId: req.body.userId,
            status: req.body.status
        })
        return res.status(200).send({
            message: 'Order berhasil diperbarui.',
            result: order
        })
    } catch {
        return res.status(404).send({
            message: 'Server is error.'
        })
    }
}

const deleteById = async (req, res) => {
    try {
        let order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(401).send({
                message: 'Order tidak ditemukan.'
            })
        }
        
        await order.destroy()
        return res.status(201).send({
            message: 'Order berhasil dihapus.'
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