import PostSchema from '../models/postDB.js';

//getPost - GET
export const getPost = async(req, res) => {
    try {
        const posts = await PostSchema.find();
        if (!posts) throw Error('No posts!');
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

// Create a new post, createPost - POST
export const createPost = async(req, res) => {
    try {
        const post = await PostSchema(req.body).save();
        if (!post) throw Error('Something went wrong!');
        res.status(201).json(post);
    } catch (error) {
        res.status(409).json({ msg: error });
    }
}