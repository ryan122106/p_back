require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL + "/notes");
    console.log("MongoDB is connected");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
}
connectToMongoDB();

app.use("/api/users", require("./routes/user"));
app.use("/api/notes", require("./routes/note"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/comments", require("./routes/comment"));
app.use("/api/likes", require("./routes/like"));


const imageRouter = require("./routes/image"); 
app.use("/api/image", imageRouter);

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.listen(5123, () => console.log("Server running at http://localhost:5123"));
