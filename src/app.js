const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());


//signup
app.post("/signup", async (req, res) => {
  const userObj = req.body;

  //creating a new instance of the user model
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error creating the user:" + err.message);
  }
});

//get user by email
app.get("/user", (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = User.findOne({emailId: userEmail});
        if(!user) {
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
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({_id: userId}, data);
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
