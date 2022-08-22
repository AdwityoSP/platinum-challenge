const itemController = require('../../controllers/item-controller');
const { Item } = require('../../models')

jest.mock('../../models', () => {
    return {
        Item: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findByPk: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
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

describe('list', () => {
    test('Item berhasil di fecth', async () => {
        const req = mockRequest()
        const res = mockResponse()

        let items = [{
            name: 'Iphone',
            description: 'Good',
            price: 20000,
            qty: 10,
            image: 'url'
        }]

        Item.findAll.mockResolvedValueOnce(items)
        await itemController.list(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(items)
    })

    test('Jika terdapat kesalahan, return error', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Item.findAll.mockImplementationOnce(() => {
            throw new Error();
        })
        await itemController.list(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is Error' })
    })
})

describe('getById', () => {
    test('Jika item tidak ditemukan, return message: `Item tidak ditemukan.`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Item.findByPk.mockResolvedValueOnce(undefined)
        await itemController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Item tidak ditemukan.' })
    })

    test('Jika item berhasil dicari, return data item', async () => {
        const req = mockRequest()
        const res = mockResponse()
        req.params.id = 1

        let item = [{
            name: 'Iphone',
            description: 'Good',
            price: 20000,
            qty: 10,
            image: 'url'
        }]

        Item.findByPk.mockResolvedValueOnce(item)
        await itemController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(item)
    })

    test('Jika terdapat kesalahan, return error', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Item.findByPk.mockImplementationOnce(() => {
            throw new Error('Error');
        })
        await itemController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is Error' })
    })
})


describe('deleteById', () => {
    test('Jika item tidak ditemukan, return message: `Item tidak ditemukan.`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Item.findByPk.mockResolvedValueOnce(undefined)
        await itemController.deleteById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Item tidak ditemukan.' })
    })

    test('Jika item ditemukan, return message: `Item berhasil dihapus.`', async () => {
        const req = mockRequest()
        const res = mockResponse()
        req.params.id = 1

        let item = [{
            name: 'Iphone',
            description: 'Good',
            price: 20000,
            qty: 10,
            image: 'url'
        }]
        
        Item.destroy.mockResolvedValueOnce(item)
        await itemController.deleteById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ message: 'Item berhasil dihapus.' })
    })

    test('Jika terdapat kesalahan, return message: `Server is Error`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Item.findByPk.mockImplementationOnce(() => {
            throw new Error();
        })
        await itemController.deleteById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is Error' })
    })
})