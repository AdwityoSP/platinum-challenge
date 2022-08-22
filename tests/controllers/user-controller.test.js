const userController = require('../../controllers/user-controller');
const { User } = require('../../models')

jest.mock('../../models', () => {
    return {
        User: {
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

describe('register', () => {
    test('Jika regist email sama, return res.json msg: `Email or username has been already taken`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findOne.mockResolvedValueOnce({})
        await userController.register(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Email or username has been already taken' })
    })

    test('Jika regist username sama, return res.json msg: `Email or username has been already taken`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findOne.mockResolvedValueOnce({})
        await userController.register(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Email or username has been already taken' })
    })

    // test('Jika pass < 8, return res.json msg: `Password At Least 8 Characters`', async () => {
    //     const req = mockRequest()
    //     const res = mockResponse()

    //     await userController.register(req, res)

    //     expect(res.json).toHaveBeenCalledWith({ message: 'Password At Least 8 Characters' })
    // })

    test('Jika memenuhi syarat, return res.json msg: `Link verifikasi sudah dikirim melalui email`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        const data = {
            firstName: 'admin',
            lastName: '1',
            username: 'admin',
            email: 'admin@gmail.com',
            password: 'password',
            role: 'admin',
            token: 'token',
            isVerified: false,
            isExpired: false,
        }

        User.create.mockResolvedValueOnce(data)
        await userController.register(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ message: 'Link verifikasi sudah dikirim melalui email' })
    })

    test('Jika terdapat kesalahan, return error', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.create.mockImplementationOnce(() => {
            throw new Error();
        })
        await userController.register(req, res)

        expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' })
    })
})

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
    //     req.params.id = 'A'

    //     let user = [{
    //         firstName: 'Admin',
    //         lastName: '1',
    //         username: 'admin1',
    //         email: 'admin1@email.com',
    //         password: '12345678'
    //     }]

    //     User.findByPk.mockResolvedValueOnce(user)
    //     await userController.getById(req, res)

    //     expect(res.json).toHaveBeenCalledWith({ message: 'userId harus angka' })
    // })

    test('Jika user tidak ditemukan, return message: `User not found!`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findByPk.mockResolvedValueOnce(undefined)
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
            throw new Error('Error');
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

        User.findByPk.mockResolvedValueOnce(undefined)
        await userController.update(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
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
            password: '12345678',
            role: 'admin',
            isVerified: false
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

describe('deleteById', () => {
    test('Jika user tidak ditemukan, return message: `User tidak ditemukan.`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findByPk.mockResolvedValueOnce({})
        await userController.deleteById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan.' })
    })

    test('Jika user ditemukan, return message: `User berhasil dihapus.`', async () => {
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
        
        User.destroy.mockResolvedValueOnce(user)
        await userController.deleteById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ message: 'User berhasil dihapus.' })
    })

    test('Jika terdapat kesalahan, return message: `User gagal dihapus.`', async () => {
        const req = mockRequest()
        const res = mockResponse()

        User.findByPk.mockImplementationOnce(() => {
            throw new Error();
        })
        await userController.deleteById(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'User gagal dihapus.' })
    })
})