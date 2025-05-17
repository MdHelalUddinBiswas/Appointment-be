const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the MeetNing Appointment AI API" });
});

// Home route
app.get("/", (req, res) => {
  res.send("MeetNing Appointment AI API is running");
});

app.listen(port, () => {
  console.log(`MeetNing Appointment AI API running on port ${port}`);
});
