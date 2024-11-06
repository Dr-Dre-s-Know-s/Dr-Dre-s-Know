const { types } = require("@hapi/joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    lowecase: true,
  },
  bio: {
    type: String,
    default: "",
  },
  rapPortfolio: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Battle",
    },
  ],
  profileImage: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Profile = mongoose.model("profile", profileSchema);

module.exports = Profile;
