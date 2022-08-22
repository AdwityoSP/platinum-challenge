const orderController = require('../../controllers/order-controller');
const { Order } = require('../../models')
const { User } = require('../../models')

jest.mock('../../models', () => {
    return {
        Order: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findByPk: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
        },
        User: {
            findOne: jest.fn()
        },
    }
});

const mockRequest = (body = {}, params = {}, query = {}) => {
    return {
        body: body,
        params: params,
        query: query
    }
}

const mockResponse = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);

    return res;
}

describe('add', () => {
    test('Jika user tidak ada, return res.json msg: `User tidak ditemukan`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findOne.mockResolvedValueOnce(undefined)
        await orderController.add(req, res)

        expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan' })
    })

    test('Jika berhasil, return res.status(200).json(result)', async () => {
        const req = mockRequest()
        const res = mockResponse()

        let result = [{
            dateOrder: '24-08-22',
            userId: '1',
            status: 'Lunas'
        }]

        Order.create.mockResolvedValueOnce(result)
        await orderController.add(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(result)
    })

    test('Jika terdapat kesalahan, return msg: ` `, error', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Order.create.mockImplementationOnce(() => {
            throw new Error();
        })
        await orderController.add(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is error.' })
    })
})

describe('list', () => {
    test('Order berhasil di fecth', async () => {
        const req = mockRequest()
        const res = mockResponse()

        let orders = [{
            dateOrder: '24-08-22',
            userId: '1',
            status: 'Lunas'
        }]

        Order.findAll.mockResolvedValueOnce(orders)
        await orderController.list(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(orders)
    })

    test('Jika terdapat kesalahan, return error', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Order.findAll.mockImplementationOnce(() => {
            throw new Error();
        })
        await orderController.list(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is error.' })
    })
})

describe('getById', () => {
    test('Jika order tidak ditemukan, return message: `Order tidak ditemukan.`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Order.findByPk.mockResolvedValueOnce(undefined)
        await orderController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Order tidak ditemukan.' })
    })

    test('Jika order berhasil dicari, return data order', async () => {
        const req = mockRequest()
        const res = mockResponse()
        req.params.id = 1

        let order = [{
            dateOrder: '24-08-22',
            userId: '1',
            status: 'Lunas'
        }]

        Order.findByPk.mockResolvedValueOnce(order)
        await orderController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(order)
    })

    test('Jika terdapat kesalahan, return error', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Order.findByPk.mockImplementationOnce(() => {
            throw new Error('Error');
        })
        await orderController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is error.' })
    })
})

describe('update', () => {
    test('Jika user tidak ada, return res.json msg: `User tidak ditemukan`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findOne.mockResolvedValueOnce(undefined)
        await orderController.update(req, res)

        expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan' })
    })

    test('Jika order tidak ada, return res.status(500).json({ msg: `Order tidak ditemukan.` })', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Order.findByPk.mockResolvedValueOnce(undefined)
        await orderController.update(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Order tidak ditemukan' })
    })

    test('Jika terdapat kesalahan, return error', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Order.update.mockImplementationOnce(() => {
            throw new Error('Error');
        })
        await orderController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is Error.' })
    })
})

describe('deleteById', () => {
    test('Jika order tidak ditemukan, return message: `Order tidak ditemukan.`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Order.findByPk.mockResolvedValueOnce(undefined)
        await orderController.deleteById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Order tidak ditemukan.' })
    })

    test('Jika order ditemukan, return message: `Order berhasil dihapus.`', async () => {
        const req = mockRequest()
        const res = mockResponse()
        req.params.id = 1

        let order = [{
            name: 'Iphone',
            description: 'Good',
            price: 20000,
            qty: 10,
            image: 'url'
        }]

        Order.destroy.mockResolvedValueOnce(order)
        await orderController.deleteById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ message: 'Order berhasil dihapus.' })
    })

    test('Jika terdapat kesalahan, return message: `Server is Error`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Order.destroy.mockImplementationOnce(() => {
            throw new Error();
        })
        await orderController.deleteById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is error.' })
    })
})