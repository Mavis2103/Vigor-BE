import express from 'express';
import { login, signUp } from '../controllers/authControl.js';
import { createPlaylist, deletePlaylist, getPlaylist } from '../controllers/playlistControl.js';
import { comment, createPost, deleteComment, deletePost, getLikers, getMyPost, getPost, getPostFollow, likePost, unLikePost } from '../controllers/postControl.js';
import { followOthers, getUserPost, searchUser, unFollowOthers, updateAvatar } from '../controllers/userControl.js';
import { requireLogin } from '../middleware/requireLogin.js';

const router = express.Router();

router.route('/').get(requireLogin, getPost) //get all posts
    .post(requireLogin, createPost) //create post
    .put(requireLogin, comment); //comment

// Get my posts
router.get('/profile/myPosts', requireLogin, getMyPost);
// Get other users posts
router.get('/profile/:username/posts', requireLogin, getUserPost);
// Get my following users posts
router.get('/followingUser', requireLogin, getPostFollow);
// Follow other users
router.put('/follow', requireLogin, followOthers);
// router.put('/profile/myPosts', requireLogin, )
// Like post
router.patch('/like', requireLogin, likePost);
// Get likers
router.get('/likers', requireLogin, getLikers);
// Unlike post
router.patch('/unlike', requireLogin, unLikePost);
// Delete posts
router.delete('/:postId', requireLogin, deletePost);
// Delete comment
router.delete('/deleteComment/:postId/:commentId', requireLogin, deleteComment);
// Unfollow other users
router.put('/unfollow', requireLogin, unFollowOthers);
// Update profile picture
router.put('/updateAvatar', requireLogin, updateAvatar);
// Search user
router.post('/searchUser', searchUser);
// Get all playlists
router.get('/getPlaylist', requireLogin, getPlaylist);
// Create playlist
router.post('/createPlaylist', requireLogin, createPlaylist);
// Delete playlist
router.delete('/deletePlaylist/:playlistId', requireLogin, deletePlaylist);
// Auth route
router.post('/register', signUp);
router.post('/login', login);



//Hashtag (create collection for hashtag)
//Type (create collection for Type)
//Playlist (add posts to playlist)
//
export default router;