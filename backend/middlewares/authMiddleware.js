import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization')?.trim(); // Trim any leading/trailing spaces
    const token = authHeader?.split(/\s+/)[1]; // Split by any amount of spaces

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
