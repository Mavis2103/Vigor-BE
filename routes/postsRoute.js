import express from 'express';
import { createPost, getPost } from '../controllers/postControl.js';

const router = express.Router();

router.get('/', getPost);
// router.get('/:id');
router.post('/', createPost);

export default router;