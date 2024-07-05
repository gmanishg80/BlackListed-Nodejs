const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
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
    follow_status:{
        type:Boolean,
        default:false
    },
    connect_status:{
        type:Boolean,
        default:false
    }
 
  },
  {
    timestamps: true,
  }
);

const connection = mongoose.model("connection", connectionSchema);
module.exports = connection;
