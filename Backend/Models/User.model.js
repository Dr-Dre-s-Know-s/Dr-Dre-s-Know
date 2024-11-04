const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt"); //used as middleware to store password in hashfile
const { required } = require("@hapi/joi");

//Schema for user
const UserSchema = new Schema({
  username: {
    type: String,
    required: false,
    lowercase: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: { type: String, default: "" },
  profileImage: { type: String }, // URL to profile image
  rapPortfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: "Battle" }],
});

//Middleware
//.pre() will call before saving the password to the database
UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

//verify that user enter the correct password or not
UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("user", UserSchema); //mongoose will convert it to pural

module.exports = User;
