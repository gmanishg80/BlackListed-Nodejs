const mongoose = require("mongoose");

const notificationPreferenceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    new_request: {
      type: Boolean,
    },
    new_messages: {
      type: Boolean,
    },
    post_interactions: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const notificationPreference = mongoose.model("notificationPreference",notificationPreferenceSchema);
module.exports = notificationPreference;
