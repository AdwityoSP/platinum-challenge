const express = require('express');
const router = express.Router();
const restrict = require('../middlewares/restrict');
const restrictAdmin = require('../middlewares/restrictAdmin');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

const allowedExtension = ['image/png', 'image/jpg', 'image/jpeg']
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (allowedExtension.includes(file.mimetype)) {
            return callback(null, true)
        } else {
            callback(null, false);
            return callback(new Error('Only .png, .jpg, and .jpeg format allowed!'))
        }
    }
})

const userController = require('../controllers/').user;
const itemController = require('../controllers').item;
const orderController = require('../controllers').order;
const transactionController = require('../controllers').transaction;
const profileController = require('../controllers').profile;

/* Admin Router */
router.get('/api/user/authorization', restrict, userController.authorization);
router.get('/api/user/showAll', restrictAdmin, userController.list);
router.put('/api/user/update/:id', restrictAdmin, userController.update);
router.delete('/api/user/deleteById/:id', restrict, userController.deleteById);

/* User router */
router.post('/api/user/register', userController.register);
router.get('/api/user/verify/:token', userController.verification);
router.post('/api/user/login', userController.login);
router.get('/api/user/getById/:id', restrict, userController.getById);
router.post('/api/user/profile/add', restrict, upload.single('avatar'), profileController.add);
router.get('/api/user/profile/show', restrict, profileController.list);

/* Item Router */
router.post('/api/item/create', restrictAdmin, upload.single('image'), itemController.add);
router.get('/api/item/showAll', restrict, itemController.list);
router.get('/api/item/getById/:id', restrict, itemController.getById);
router.put('/api/item/update/:id', restrictAdmin, upload.single('image'), itemController.update);
router.delete('/api/item/deleteById/:id', restrictAdmin, itemController.deleteById);

/* Order Router */
router.post('/api/order/create', restrict, orderController.add);
router.get('/api/order/showAll', restrictAdmin, orderController.list);
router.get('/api/order/getById/:id', restrict, orderController.getById);
router.put('/api/order/update/:id', restrictAdmin, orderController.update);
router.delete('/api/order/deleteById/:id', restrict, orderController.deleteById);

/* Transaction Router */
router.post('/api/transaction/create', restrict, transactionController.add);
router.get('/api/transaction/showAll', restrictAdmin, transactionController.list);
router.get('/api/transaction/getById/:id', restrict, transactionController.getById);
router.delete('/api/transaction/deleteById/:id', restrictAdmin, transactionController.deleteById);

module.exports = router;