const mongoose = require("mongoose");
const mongodbUri = process.env.MONGODB_URI; // mongoDB URI

mongoose
  .connect(mongodbUri, { dbName: process.env.DB_NAME })
  .catch((err) => console.log(err.message));

//check for the status of connections
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to db");
});
mongoose.connection.on("error", (err) => {
  console.log(err.message);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected");
});

//close connection when user press ctrl+c
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
