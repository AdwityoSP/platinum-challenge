const { Item } = require('../models');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
})

const uploadCloudinary = async (filePath) => {
    let result;
    try {
        result = await cloudinary.uploader.upload(filePath, {
            use_filename: true
        });

        fs.unlinkSync(filePath);
        return result.url;
    } catch (err) {
        fs.unlinkSync(filePath);

        return null;
    }
}

const add = async (req, res) => {
    const url = await uploadCloudinary(req.file.path);

    try {
        if (url) {
            let result = await Item.create({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                qty: req.body.qty,
                image: url
            })
            return res.status(200).json(result)
        }
        return res.status(500).json({
            message: 'Item gagal ditambahkan.'
        })
    } catch (err) {
        return res.status(500).json(err);
    }
}

const list = async (req, res) => {
    try {
        let result = await Item.findAll()

        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json(err)
    }
}

const getById = async (req, res) => {
    try {
        let item = await Item.findByPk(req.params.id)

        if (!item) {
            return res.status(500).json({
                message: 'Item tidak ditemukan.'
            })
        }

        return res.status(200).json(item)
    } catch (err) {
        return res.status(500).json(err)
    }
}

const update = async (req, res) => {
    const url = await uploadCloudinary(req.file.path);

    try {
        let item = await Item.findByPk(req.params.id)
        if (!item) {
            return res.status(500).json({
                message: 'Item tidak ditemukan.'
            })
        }

        if (url) {
            let result = await item.update({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                qty: req.body.qty,
                image: url
            })
            return res.status(200).json(result)
        }

        return res.status(500).json({
            message: 'Item gagal diperbarui.'
        })
    } catch (err) {
        return res.status(500).json(err)
    }
}

const deleteById = async (req, res) => {
    try {
        let item = await Item.findByPk(req.params.id)
        if (!item) {
            return res.status(500).send({
                message: 'Item tidak ditemukan.'
            })
        }

        await item.destroy()
        return res.status(200).send({
            message: 'Item berhasil dihapus.'
        })
    } catch (err) {
        return res.status(500).send(err)
    }
}

module.exports = {
    add,
    list,
    getById,
    update,
    deleteById
}