require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL + "/notes");
    console.log("MongoDB is connected");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
}
connectToMongoDB();

// ✅ API routes
app.use("/api/users", require("./routes/user"));
app.use("/api/notes", require("./routes/note"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/comments", require("./routes/comment"));
app.use("/api/likes", require("./routes/like"));
app.use("/api/image", require("./routes/image"));

// ✅ Serve uploaded files (images/videos)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Start the server
const PORT = process.env.PORT || 5123;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
