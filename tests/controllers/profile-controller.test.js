const profileController = require('../../controllers/profile-controller');
const { Profile } = require('../../models');

jest.mock('../../models', () => {
    return {
        Profile: {
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
    test('Profile berhasil di fecth', async () => {
        const req = mockRequest()
        const res = mockResponse()

        let profiles = []

        Profile.findAll.mockResolvedValueOnce(profiles)
        await profileController.list(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(profiles)
    })

    test('Jika terdapat kesalahan, return error', async () => {
        const req = mockRequest()
        const res = mockResponse()

        Profile.findAll.mockImplementationOnce(() => {
            throw new Error();
        })
        await profileController.list(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ message: 'Server is error.' })
    })
})