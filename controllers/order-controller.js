const { User } = require('../models');
const { Order } = require('../models');

const add = async (req, res) => {
    try {
        const userId = await User.findOne({ where: { id: req.body.userId } })
        if (!userId) {
            return res.json({ message: 'User tidak ditemukan' })
        }

        let result;
        result = await Order.create({
            dateOrder: req.body.dateOrder,
            userId: req.body.userId,
            status: req.body.status
        })
        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({
            message: 'Order gagal ditambahkan.',
            err: err
        })
    }
}

const list = async (req, res) => {
    try {
        let result = await Order.findAll()

        return res.status(200).json(result)
    } catch {
        return res.status(500).json({
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
            return res.status(500).json({
                message: 'Order tidak ditemukan.'
            })
        }
        return res.status(200).json(order)
    } catch {
        return res.status(500).json({
            message: 'Server is error.'
        })
    }
}

const update = async (req, res) => {
    try {
        const userId = await User.findOne({ where: { id: req.body.userId } })
        if (!userId) {
            return res.json({ message: 'User tidak ditemukan' })
        }

        let order = await Order.findByPk(req.params.id)

        if (!order) {
            return res.status(500).json({
                message: 'Order tidak ditemukan.'
            })
        }
        await order.update({
            dateOrder: req.body.dateOrder,
            userId: req.body.userId,
            status: req.body.status
        })
        return res.status(200).json({
            message: 'Order berhasil diperbarui.',
            result: order
        })
    } catch {
        return res.status(500).json({
            message: 'Server is error.'
        })
    }
}

const deleteById = async (req, res) => {
    try {
        let order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(500).json({
                message: 'Order tidak ditemukan.'
            })
        }

        await order.destroy()
        return res.status(200).json({
            message: 'Order berhasil dihapus.'
        })
    } catch {
        return res.status(500).json({
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