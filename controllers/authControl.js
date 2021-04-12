import UserSchema from '../models/userDB.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import JWT_SECRET from '../../config/keys.js';

// Signup - POST
export const signUp = async(req, res) => {
    try {
        const { name, username, email, password, profilePicture } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(422).json({ error: "Hãy nhập đầy đủ các ô" });
        }
        UserSchema.findOne({ username: username })
            .then((savedUser) => {
                if (savedUser) {
                    return res.status(422).json({ error: "Tên đăng nhập đã tồn tại" });
                }
                bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        const user = new UserSchema({
                            name,
                            username,
                            email,
                            password: hashedPassword,
                            profilePicture
                        })
                        user.save()
                            .then(user => {
                                res.status(201).json(user)
                            })
                            .catch(error => {
                                res.status(409).json({ msg: error })
                            })
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
            .catch(error => {
                console.log(error);
            })
    } catch (error) {
        res.status(409).json({ msg: error });
    }
}

// Login - POST
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ error: "Hãy nhập đầy đủ các ô" });
        }
        UserSchema.findOne({ email: email })
            .populate('following', '_id username profilePicture')
            .populate('followers', '_id username profilePicture')
            .then((savedUser) => {
                if (!savedUser) {
                    return res.status(422).json({ error: "Email hoặc mật khẩu không đúng" });
                }
                bcrypt.compare(password, savedUser.password)
                    .then(doMatch => {
                        if (doMatch) {
                            const token = jwt.sign({
                                _id: savedUser._id
                            }, 'hfeonfefwfwhfphwjwjfhgoihguiwrg')
                            const { _id, name, username, email, profilePicture, followers, following } = savedUser
                            res.status(200).json({
                                token,
                                user: {
                                    _id,
                                    name,
                                    username,
                                    email,
                                    profilePicture,
                                    followers,
                                    following
                                }
                            })
                        } else {
                            return res.status(422).json({ error: "Email hoặc mật khẩu không đúng" })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
            .catch(error => {
                console.log(error);
            })
    } catch (error) {
        res.status(409).json({ msg: error });
    }
}