import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: String,
	creator: String,
	selectedFile: String,
	likeCount: {
		type: Number,
		default: 0,
	},
	likers: [String],
	comments: {
		type: [{
			commenterId: String,
			text: String,
			timestamp: Number
		}],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	}
});

export default mongoose.model('Posts', PostSchema);