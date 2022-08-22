const transactionController = require('../../controllers/transaction-controller');
const { Transaction } = require('../../models');
const { User } = require('../../models');
const { Order } = require('../../models');
const { Item } = require('../../models');

jest.mock('../../models', () => {
    return {
        Transaction: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findByPk: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
        },
        User: {
            findOne: jest.fn(),
        },
        Order: {
            findOne: jest.fn(),
        },
        Item: {
            findOne: jest.fn(),
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
    test('Jika user tidak ada, return msg: `User tidak ditemukan`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findOne.mockResolvedValueOnce(undefined)
        await transactionController.add(req, res)

        expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan' })
    })

    test('Jika order tidak ada, return msg: `Order tidak ditemukan`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Order.findOne.mockResolvedValueOnce(undefined)
        await transactionController.add(req, res)

        expect(res.json).toHaveBeenCalledWith({ message: 'Order tidak ditemukan' })
    })

    test('Jika item tidak ada, return msg: `Item tidak ditemukan`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Item.findOne.mockResolvedValueOnce(undefined)
        await transactionController.add(req, res)

        expect(res.json).toHaveBeenCalledWith({ message: 'Item tidak ditemukan' })
    })
})

describe('list', () => {
    test('Transaction berhasil di fecth', async () => {
        const req = mockRequest()
        const res = mockResponse()

        let transactions = []

        Transaction.findAll.mockResolvedValueOnce(transactions)
        await transactionController.list(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(transactions)
    })

    test('Jika terdapat kesalahan, return error', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Transaction.findAll.mockImplementationOnce(() => {
            throw new Error();
        })
        await transactionController.list(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is error.' })
    })
})

describe('getById', () => {
    test('Jika transaksi tidak ditemukan, return message: `Transaksi tidak ditemukan.`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Transaction.findByPk.mockResolvedValueOnce(undefined)
        await transactionController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Transaksi tidak ditemukan.' })
    })

    test('Jika transaksi berhasil dicari, return data transaksi', async () => {
        const req = mockRequest()
        const res = mockResponse()
        req.params.id = 1

        let transaction = []

        Transaction.findByPk.mockResolvedValueOnce(transaction)
        await transactionController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(transaction)
    })

    test('Jika terdapat kesalahan, return error', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Transaction.findByPk.mockImplementationOnce(() => {
            throw new Error('Error');
        })
        await transactionController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is error.' })
    })
})

describe('deleteById', () => {
    test('Jika transaksi tidak ditemukan, return message: `Transaksi tidak ditemukan.`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Transaction.findByPk.mockResolvedValueOnce(undefined)
        await transactionController.deleteById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Transaksi tidak ditemukan.' })
    })

    test('Jika transaksi ditemukan, return message: `transaksi berhasil dihapus.`', async () => {
        const req = mockRequest()
        const res = mockResponse()
        req.params.id = 1

        let transaction = []
        
        Transaction.destroy.mockResolvedValueOnce(transaction)
        await transactionController.deleteById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ message: 'Transaksi berhasil dihapus.' })
    })

    test('Jika terdapat kesalahan, return message: `Server is Error`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Transaction.findByPk.mockImplementationOnce(() => {
            throw new Error();
        })
        await transactionController.deleteById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is error.' })
    })
})