const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "age",
    "gender",
    "about",
  ];

  const isAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
