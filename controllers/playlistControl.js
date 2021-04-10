import PlaylistSchema from '../models/playlistDB.js';

//getPlaylist - GET
export const getPlaylist = async(req, res) => {
    try {
        const playlist = await PlaylistSchema.find()
            .populate('creator', '_id username profilePicture')
            // .sort({ createdAt: -1 });
        if (!playlist) throw Error('No playlist!');
        res.status(200).json(playlist);
    } catch (error) {
        res.status(400).json({ msg: error });
    }
}

// createPlaylist - POST
export const createPlaylist = (req, res) => {
    try {
        // const post = await PostSchema(req.body).save();
        const { title, songs } = req.body;
        req.user.password = undefined;
        const playlist = new PlaylistSchema({
            title,
            creator: req.user,
            songs
        })
        playlist.save()
            .then(result => {
                res.status(201).json(result);
            })
            .catch(err => {
                console.log(err);
            })
            // if (!post) throw Error('Something went wrong!');
            // res.status(201).json(post);
    } catch (error) {
        res.status(409).json({ msg: error });
    }
}

// Delete playlist - REMOVE
export const deletePlaylist = (req, res) => {
    PlaylistSchema.findOne({ _id: req.params.playlistId })
        .populate('creator', '_id')
        .exec((err, playlist) => {
            if (err || !playlist) {
                return res.status(422).json({ error: err })
            }
            if (playlist.creator._id.toString() === req.user._id.toString()) {
                playlist.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
}