const { Profile } = require('../models');
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
    const currentUserId = req.user.id;
    const url = await uploadCloudinary(req.file.path);

    await Profile.findOne({
        where: { userId: currentUserId }
    })

    try {
        if (url) {
            let result = await Profile.create({
                userId: currentUserId,
                avatar: url
            })
            
            return res.status(200).json(result)
        }
        return res.status(500).json({
            message: 'Profile gagal ditambahkan.'
        })
    } catch (err) {
        return res.status(500).json(err)
    }
}

const list = async (req, res) => {
    try {
        let result = await Profile.findAll()

        return res.status(200).json(result)
    } catch {
        return res.status(500).json({
            message: 'Server is error.'
        })
    }
}

module.exports = {
    add,
    list
}