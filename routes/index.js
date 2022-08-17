const express = require('express')
const router = express.Router()
const restrict = require('../middlewares/restrict')
const multer = require('multer')

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

/* User Router */
router.post('/api/user/register', userController.register);
router.post('/api/user/login', userController.login);
router.get('/api/user/authorization', restrict, userController.profile);
router.get('/api/user/showAll', userController.list);
router.get('/api/user/getById/:id', userController.getById);
router.put('/api/user/update/:id', userController.update);
router.delete('/api/user/deleteById/:id', userController.deleteById);

router.post('/api/user/profile/add', restrict, upload.single('avatar'), profileController.add);

/* Item Router */
router.post('/api/item/create', upload.single('image'), itemController.add);
router.get('/api/item/showAll', itemController.list);
router.get('/api/item/getById/:id', itemController.getById);
router.put('/api/item/update/:id', upload.single('image'), itemController.update);
router.delete('/api/item/deleteById/:id', itemController.deleteById);

/* Order Router */
router.post('/api/order/create', orderController.add);
router.get('/api/order/showAll', orderController.list);
router.get('/api/order/getById/:id', orderController.getById);
router.put('/api/order/update/:id', orderController.update);
router.delete('/api/order/deleteById/:id', orderController.deleteById);

/* Transaction Router */
router.post('/api/transaction/create', transactionController.add);
router.get('/api/transaction/showAll', transactionController.list);
router.get('/api/transaction/getById/:id', transactionController.getById);
router.delete('/api/transaction/deleteById/:id', transactionController.deleteById);

module.exports = router;