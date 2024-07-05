const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    comment_text: {
      type: String,
    },
    likes_count: {
      type: Number,
    }
  },
  {
    timestamps: true,
  }
);

const comment = mongoose.model("comment", commentSchema);
module.exports = comment;
