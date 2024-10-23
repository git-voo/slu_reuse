import { jest } from '@jest/globals';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'testsecret';

describe('authMiddleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            header: jest.fn(),
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if no token is provided', () => {
        req.header.mockReturnValue(undefined);

        authMiddleware(req, res, next);

        expect(req.header).toHaveBeenCalledWith('Authorization');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: 'No token, authorization denied' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
        req.header.mockReturnValue('Bearer invalidtoken');

        // Mock jwt.verify to throw an error
        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error('Invalid token');
        });

        authMiddleware(req, res, next);

        expect(req.header).toHaveBeenCalledWith('Authorization');
        expect(jwt.verify).toHaveBeenCalledWith('invalidtoken', 'testsecret');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Token is not valid' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is expired', () => {
        req.header.mockReturnValue('Bearer expiredtoken');

        // Mock jwt.verify to throw TokenExpiredError
        const expiredError = new jwt.TokenExpiredError('jwt expired', new Date());
        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            throw expiredError;
        });

        authMiddleware(req, res, next);

        expect(req.header).toHaveBeenCalledWith('Authorization');
        expect(jwt.verify).toHaveBeenCalledWith('expiredtoken', 'testsecret');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Token is not valid' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should set req.user and call next if token is valid', () => {
        const mockPayload = { user: { id: 'user123' } };
        const validToken = jwt.sign(mockPayload, 'testsecret', { expiresIn: '1h' });

        req.header.mockReturnValue(`Bearer ${validToken}`);

        // Mock jwt.verify to return decoded payload
        jest.spyOn(jwt, 'verify').mockReturnValue(mockPayload);

        authMiddleware(req, res, next);

        expect(req.header).toHaveBeenCalledWith('Authorization');
        expect(jwt.verify).toHaveBeenCalledWith(validToken, 'testsecret');
        expect(req.user).toEqual(mockPayload.user);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle tokens with different schemes gracefully', () => {
        // Example with lowercase 'bearer'
        const mockPayload = { user: { id: 'user123' } };
        const validToken = jwt.sign(mockPayload, 'testsecret', { expiresIn: '1h' });

        req.header.mockReturnValue(`bearer ${validToken}`);

        // Mock jwt.verify to return decoded payload
        jest.spyOn(jwt, 'verify').mockReturnValue(mockPayload);

        authMiddleware(req, res, next);

        // Depending on implementation, the middleware might treat 'bearer' as invalid
        // Adjust expectations accordingly
        // Here, assuming it still works
        expect(req.header).toHaveBeenCalledWith('Authorization');
        expect(jwt.verify).toHaveBeenCalledWith(validToken, 'testsecret');
        expect(req.user).toEqual(mockPayload.user);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle extra spaces in the Authorization header', () => {
        const mockPayload = { user: { id: 'user123' } };
        const validToken = jwt.sign(mockPayload, 'testsecret', { expiresIn: '1h' });

        // Authorization header with multiple spaces
        req.header.mockReturnValue(`Bearer    ${validToken}`);

        // Mock jwt.verify to return decoded payload
        jest.spyOn(jwt, 'verify').mockReturnValue(mockPayload);

        authMiddleware(req, res, next);

        // Token extraction should still work correctly
        expect(req.header).toHaveBeenCalledWith('Authorization');
        expect(jwt.verify).toHaveBeenCalledWith(validToken, 'testsecret');
        expect(req.user).toEqual(mockPayload.user);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
