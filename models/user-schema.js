const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
    },
    full_name: {
      type: String,
    },
    email: {
      type: String,
    },
    email_verified: {
      type: Boolean,
      default:false
    },
    password: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    industry: {
      type: [String],
    },
    job_title: {
      type: String,
    },
    sub_industry: {
      type: [String],

    },
    business_owner: {
      type: Boolean,
    },
    looking_for: {
      type: [String],
    },
    images: {
      type: String,
      default:null
    },
    profile_img: {
      type: String,
      default:null
    },
    about_me: {
      type: String,
    },
    bio: {
      type: String,
    },
    profile_status:{
      type:Number,
      default:null
    },
    email_otp:{
      type:Number
      
    }
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", userSchema);
module.exports = user;
