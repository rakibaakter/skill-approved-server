const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("online marketplace server is on...");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
