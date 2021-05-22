import mongoose from "mongoose";

const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const PostSchema = new Schema({
  title: String,
  hashtag: [{ type: String }],
  creator: {
    type: ObjectId,
    ref: "User",
  },
  selectedFile: String,
  selectedVidFile: String,
  selectedAudFile: String,
  likeCount: {
    type: Number,
    default: 0,
  },
  likers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      text: String,
      creator: {
        type: ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  commentCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Posts", PostSchema);
