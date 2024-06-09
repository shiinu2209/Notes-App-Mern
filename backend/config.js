const mongoose = require("mongoose");

const connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.Connection_string);
    console.log("Connected to MongoDB Atlas", connection.connection.host);
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas", error);
  }
};

module.exports = connect;
