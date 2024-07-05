const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    post_text: {
      type: String,
    },
    media: [],
    fists_count: {
      type: Number,
    },
    diamonds_count: {
      type: Number,
    },
    dollars_count: {
      type: Number,
    },
    comments_count: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const post = mongoose.model("post", postSchema);
module.exports = post;
