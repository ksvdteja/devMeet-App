const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://www.google.com/imgres?q=dummy%20photo%20image&imgurl=https%3A%2F%2Fpinnacle.works%2Fwp-content%2Fuploads%2F2022%2F06%2Fdummy-image.jpg&imgrefurl=https%3A%2F%2Fpinnacle.works%2Fdummy-image%2F&docid=DNP0Mre_yiaEeM&tbnid=wNwYhuVmPXUBSM&vet=12ahUKEwj_nL3Dg5mLAxVxk68BHWslG4cQM3oECBYQAA..i&w=452&h=449&hcb=2&ved=2ahUKEwj_nL3Dg5mLAxVxk68BHWslG4cQM3oECBYQAA"
    },
    about: {
        type: String,
        default: "This is a default about of a user"
    },
    skills: {
        type: [String],
    }
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;