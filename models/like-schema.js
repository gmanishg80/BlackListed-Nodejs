const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
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
    type_of_like: {
      type: String,
      enum: ["fist", "dollar", "diamond"],
    }
  },
  {
    timestamps: true,
  }
);

const like = mongoose.model("like", likeSchema);
module.exports = like;
