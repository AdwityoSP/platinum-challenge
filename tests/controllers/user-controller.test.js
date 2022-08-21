const userController = require('../../controllers').user
const { User } = require('../../models')

jest.mock('../../models', () => {
    return {
        User: {
            findAll: jest.fn(),
            create: jest.fn(),
            findByPk: jest.fn(),
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
    test('User berhasil di fetch', async () => {
        const req = mockRequest()
        const res = mockResponse()

        let users = [{
            firstName: 'Admin',
            lastName: '1',
            username: 'admin1',
            email: 'admin1@email.com',
            password: '12345678'
        }]

        User.findAll.mockResolvedValueOnce(users)
        await userController.list(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(users)
    })

    test('Jika terdapat kesalahan, return error', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findAll.mockImplementationOnce(() => {
            throw new Error();
        })
        await userController.list(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is Error' })
    })
})

describe('getById', () => {
    // test('Jika user bukan angka, return message: `userId harus angka`', async () => {
    //     const req = mockRequest()
    //     const res = mockResponse()

    //     User.findByPk.mockResolvedValueOnce()
    //     await userController.getById(req, res)

    //     expect(res.status).toHaveBeenCalledWith(500)
    //     expect(res.json).toHaveBeenCalledWith({ message: 'userId harus angka' })
    // })

    test('Jika user tidak ditemukan, return message: `User not found!`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findByPk.mockResolvedValueOnce(null)
        await userController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' })
    })

    test('Jika user berhasil dicari, return data user', async () => {
        const req = mockRequest()
        const res = mockResponse()
        req.params.id = 1

        let user = [{
            firstName: 'Admin',
            lastName: '1',
            username: 'admin1',
            email: 'admin1@email.com',
            password: '12345678'
        }]

        User.findByPk.mockResolvedValueOnce(user)
        await userController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(user)
    })

    test('Jika terdapat kesalahan, return error', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findByPk.mockImplementationOnce(() => {
            throw new Error();
        })
        await userController.getById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is Error' })
    })
})

describe('update', () => {
    test('Jika user tidak ditemukan, return message: `User tidak ditemukan.`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findByPk.mockResolvedValueOnce()
        await userController.update(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan' })
    })

    test('Jika user berhasil diupdate, return message: `User berhasil diperbarui.`', async () => {
        const req = mockRequest()
        const res = mockResponse()
        req.params.id = 1

        let user = [{
            firstName: 'Admin',
            lastName: '1',
            username: 'admin1',
            email: 'admin1@email.com',
            password: '12345678'
        }]

        User.findByPk.mockResolvedValueOnce(user)
        await userController.update(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ message: 'User berhasil diperbarui.', result: user })
    })

    test('Jika terdapat kesalahan, return message: `User gagal diperbarui.`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findByPk.mockImplementationOnce(() => {
            throw new Error();
        })
        await userController.update(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'User gagal diperbarui.' })
    })
})