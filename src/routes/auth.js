const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    //Encrypt the password
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      about,
      gender,
      photoUrl,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      about,
      gender,
      photoUrl,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    
    const token = await savedUser.getJWT();
    console.log(token);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({ message: "User added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("Error creating the user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Email is not valid");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //Create JWT Token
      const token = await user.getJWT();

      //Add the token to the cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logged out successfully");
});

module.exports = authRouter;
