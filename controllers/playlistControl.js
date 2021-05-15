import PlaylistSchema from "../models/playlistDB.js";
import PostSchema from "../models/postDB.js";

//getPlaylist - GET
export const getPlaylist = async (req, res) => {
  try {
    const playlist = await PlaylistSchema.find().populate(
      "creator",
      "_id username profilePicture"
    );
    // .sort({ createdAt: -1 });
    if (!playlist) throw Error("No playlist!");
    res.status(200).json(playlist);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

// createPlaylist - POST
export const createPlaylist = (req, res) => {
  try {
    // const post = await PostSchema(req.body).save();
    const { title, songs } = req.body;
    req.user.password = undefined;
    const playlist = new PlaylistSchema({
      title,
      creator: req.user,
      songs,
    });
    playlist
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        console.log(err);
      });
    // if (!post) throw Error('Something went wrong!');
    // res.status(201).json(post);
  } catch (error) {
    res.status(409).json({ msg: error });
  }
};

// Delete playlist - REMOVE
export const deletePlaylist = (req, res) => {
  PlaylistSchema.findOne({ _id: req.params.playlistId })
    .populate("creator", "_id")
    .exec((err, playlist) => {
      if (err || !playlist) {
        return res.status(422).json({ error: err });
      }
      if (playlist.creator._id.toString() === req.user._id.toString()) {
        playlist
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

export const addPostToPlaylist = async (req, res) => {
  const { id_post, id_playlist } = req.body;
  try {
    let playlist = await PlaylistSchema.findOneAndUpdate(
      { _id: id_playlist },
      { $push: { songs: id_post } },
      { new: true }
    );
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
export const viewPostFromPlaylist = async (req, res) => {
  const { id_playlist } = req.body;
  try {
    let playlist = await PlaylistSchema.find({ _id: id_playlist });
    let posts = await PostSchema.find({ _id: playlist[0].songs });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
export const removePostToPlaylist = async (req, res) => {
  const { id_post, id_playlist } = req.body;
  try {
    let playlist = await PlaylistSchema.findOneAndUpdate(
      { _id: id_playlist },
      { $pull: { songs: id_post } },
      { new: true, multi: true }
    );
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
