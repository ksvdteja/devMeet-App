const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const app = express();
app.use(express.json());

//signup
app.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    //Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error creating the user:" + err.message);
  }
});

//login
app.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;
        if(!validator.isEmail(emailId)) {
            throw new Error("Email is not valid");
        }

        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = bcrypt.compare(password, user.password);

        if(isPasswordValid) {
            res.send("Login successful");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (err) {
        res.send(400).send("ERROR: " + err.message);
    }
})

//get user by email
app.get("/user", (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await User.findByIdAndDelete({_id: userId});
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Feed API -GET/ feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error getting the users data:" + err.message);
  }
});

//update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills more than 10 not allowed.");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

connectDb()
  .then(() => {
    console.log("Database connected successfully..");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000 successfully...");
    });
  })
  .catch((err) => {
    console.error("Database connection failed!!");
  });
