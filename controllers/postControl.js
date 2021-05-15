// import Post from '../../frontend/src/features/Posts/index.jsx';
import PostSchema from "../models/postDB.js";

//getPost - GET
export const getPost = async (req, res) => {
  try {
    const posts = await PostSchema.find()
      .populate("creator", "_id username profilePicture")
      .populate("comments.creator", "_id username profilePicture")
      .populate("likers", "_id username profilePicture")
      .sort({ createdAt: -1 });
    if (!posts) throw Error("No posts!");
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

//getPostFollow - GET
export const getPostFollow = async (req, res) => {
  try {
    // if creator in following
    const followPosts = await PostSchema.find({
      creator: {
        $in: req.user.following,
      },
    })
      .populate("creator", "_id username profilePicture")
      .populate("comments.creator", "_id username profilePicture")
      .populate("likers", "_id username profilePicture")
      .sort({ createdAt: -1 });
    if (!followPosts) throw Error("No followPosts!");
    res.status(200).json(followPosts);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

// getMyPost - GET (Get posts created by a specific person)
export const getMyPost = async (req, res) => {
  try {
    const myPosts = await PostSchema.find({ creator: req.user._id })
      .populate("creator", "_id username followers following")
      .populate("comments.creator", "_id username profilePicture")
      .populate("likers", "_id username profilePicture")
      .populate("following", "_id username profilePicture")
      .populate("followers", "_id username profilePicture")
      .sort({ createdAt: -1 });
    if (!myPosts) throw Error("No posts!");
    res.status(200).json(myPosts);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

// Create a new post, createPost - POST
export const createPost = (req, res) => {
  let hashtag = [];
  try {
    // const post = await PostSchema(req.body).save();
    const { title, selectedFile, selectedVidFile, selectedAudFile, createdAt } =
      req.body;
    req.user.password = undefined;
    hashtag = [...title.match(/\B(\#[a-zA-Z0-9]+\b)(?!;)/g)];
    const post = new PostSchema({
      title,
      hashtag,
      creator: req.user,
      selectedFile,
      selectedVidFile,
      selectedAudFile,
      createdAt,
    });
    post
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.status(409).json({ msg: error });
  }
};

// Like post - PUT
export const likePost = (req, res) => {
  PostSchema.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likers: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("likers", "_id username profilePicture")
    .populate("creator", "_id username profilePicture")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
};

// Get likers
export const getLikers = async (req, res) => {
  try {
    const liker = await PostSchema.find({ likers: req.user._id })
      .populate("likers", "_id username profilePicture")
      .populate("creator", "_id username profilePicture");
    if (!liker) throw Error("No liker!");
    res.status(200).json(liker);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

// Unlike post - PUT
export const unLikePost = (req, res) => {
  PostSchema.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likers: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("likers", "_id username profilePicture")
    .populate("creator", "_id username profilePicture")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
};

// Comment - PUT
export const comment = (req, res) => {
  const cmt = {
    text: req.body.text,
    creator: req.user._id,
  };
  PostSchema.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: cmt },
    },
    {
      new: true,
    }
  )
    .populate("comments.creator", "_id username profilePicture")
    .populate("creator", "_id username profilePicture")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
};

// Delete post - REMOVE
export const deletePost = (req, res) => {
  PostSchema.findOne({ _id: req.params.postId })
    .populate("creator", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.creator._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
};

// Delete comment - REMOVE
export const deleteComment = (req, res) => {
  // PostSchema.findOne({ _id: req.params.postId })
  //     .populate('comments.creator', '_id username profilePicture')
  //     .populate('creator', '_id username')
  //     .exec((err, post) => {
  //         if (err || !post) {
  //             return res.status(422).json({ error: err })
  //         }
  //         if (post.comments.map(cmt => cmt.creator._id.toString()) === req.user._id.toString()) {
  //             post.remove()
  //                 .then(result => {
  //                     res.json(result)
  //                 }).catch(err => {
  //                     console.log(err)
  //                 })
  //         }
  //     })

  const comment = { _id: req.params.commentId };
  PostSchema.findByIdAndUpdate(
    req.params.postId,
    {
      $pull: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.creator", "_id username profilePicture")
    .populate("creator", "_id username")
    .exec((err, postComment) => {
      if (err || !postComment) {
        return res.status(422).json({ error: err });
      } else {
        const result = postComment;
        res.json(result);
      }
    });
};
export const ListHashtag = (req, res) => {
  let listHashtag = [];
  PostSchema.find().exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      result.forEach((post) => {
        listHashtag = listHashtag.concat(post.hashtag);
      });
      res.json([...new Set(listHashtag)]);
    }
  });
};
export const PostWithHashtag = (req, res) => {
  let hashtag = req.query.hashtag;
  PostSchema.find().exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result.filter((post) => post.hashtag.includes(`${hashtag}`)));
    }
  });
};
