require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/notes");
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
}
connectToMongoDB();

app.use("/users", require("./routes/user"));
app.use("/notes", require("./routes/note"));
app.use("/feedback", require("./routes/feedback"));
app.use("/comments", require("./routes/comment"));
app.use("/likes", require("./routes/like"));


const imageRouter = require("./routes/image"); 
app.use("/image", imageRouter);

app.use("/uploads", express.static("uploads"));

app.listen(5123, () => console.log("Server running at http://localhost:5123"));
