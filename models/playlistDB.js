import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const PlaylistSchema = new Schema({
    title: String,
    creator: {
        type: ObjectId,
        ref: 'User'
    },
    songs: [{
        type: ObjectId,
        ref: 'Posts'
    }]
});

export default mongoose.model('Playlist', PlaylistSchema);