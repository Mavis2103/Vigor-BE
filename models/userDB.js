import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 30,
		trim: true,
		match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password: {
		type: String,
		required: true,
		minlength: 3,
		trim: true
	},
	username: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 30,
		trim: true,
		match: /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/,
		unique: true
	},
	bio: {
		type: String,
		default: '',
		trim: true,
		maxlength: 250
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	profilePicture: {
		type: String,
		default: ''
	},
	// postLikes: 
	// commentLikes:
	// commentReply
})
export default mongoose.model('User', UserSchema);