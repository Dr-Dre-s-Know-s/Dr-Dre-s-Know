const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../Models/User.model");
const { authSchema } = require("../helpers/validation_schema");
const { signAccessToken, verifyAccessToken } = require("../helpers/jwthelper");
const { verify } = require("jsonwebtoken");
const Profile = require("../Models/Profile.model");
const mongoose = require("mongoose");

//To get all the users details from database
router.get("/users", async (req, res) => {
  const user = await User.find();
  res.json(user);
});

//Route to login
router.post("/login", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) {
      next(createError.NotFound("User not register"));
    }
    const userId = user.id;
    //Check that the password in valid or not
    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch) next(createError.Unauthorized("username/password not valid"));

    const accessToken = await signAccessToken(user.id);
    res.send({ accessToken, userId });
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest("Invalid username/password"));
    next(error);
  }
});

//Route to register new user
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      next(createError.BadRequest("Fill The Signup form"));
    const result = await authSchema.validateAsync(req.body);

    const doesExist = await User.findOne({ email: result.email });
    if (doesExist)
      next(createError.Conflict(`${result.email} is already being registered`));

    const user = new User(result);
    await new Profile({
      username: result.username,
      userId: user._id,
    }).save();

    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    res.status(200).send("registered");
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

//update userProfile
router.put("/updateuser/:id", verifyAccessToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await Profile.findOne({ userId: id }, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) throw createError.NotFound("User not found");
    res.status(200).send(updatedUser); // Send updated user data as response
  } catch (error) {
    next(createError.InternalServerError("Error updating User Profile"));
  }
});

router.get("/user/:id", verifyAccessToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userdata = await Profile.findOne({ userId: id });
    if (!userdata) {
      next(createError.NotFound("User not found"));
    }
    res.status(200).json(userdata);
  } catch (error) {
    next(createError.InternalServerError("Error in finding user data"));
  }
});

router.delete("/logout", async (req, res, next) => {
  res.send("logout route");
});

module.exports = router;
