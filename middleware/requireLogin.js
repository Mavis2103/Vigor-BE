import jwt from 'jsonwebtoken';
import UserSchema from '../models/userDB.js';

export const requireLogin = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "Bạn phải đăng nhập" })
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, 'hfeonfefwfwhfphwjwjfhgoihguiwrg', (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "Bạn phải đăng nhập" })
        }
        const { _id } = payload;
        UserSchema.findById(_id)
            .then(userData => {
                req.user = userData;
                next();
            })
    })
}