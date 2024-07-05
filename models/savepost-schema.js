const mongoose = require("mongoose");

const savePostSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true,
  }
);

const savepost = mongoose.model("savepost", savePostSchema);
module.exports = savepost;
