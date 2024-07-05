const mongoose = require("mongoose");

const subCommentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
      required: true,
    },
    likes_count: {
      type: Number,
    },
    sub_comments_text: {
      type: Number,
    }
  },
  {
    timestamps: true,
  }
);

const subComment = mongoose.model("subComment", subCommentSchema);
module.exports = subComment;
