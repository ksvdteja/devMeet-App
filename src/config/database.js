const mongoose = require("mongoose");

const connectDb = async () => {
    await mongoose.connect(
        "mongodb+srv://divyateja773:Ksvd2206@devmeet.omdvn.mongodb.net/devMeet"
    );
};

module.exports = connectDb;



