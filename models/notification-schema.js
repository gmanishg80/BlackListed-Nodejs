const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    from_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    to_user_id: {
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
    notifications_count: {
      type: Number,
    },
    notification_text: {
      type: String,
    },
    read_status: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const notification = mongoose.model("notification", notificationSchema);
module.exports = notification;
