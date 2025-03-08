require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => console.log("DB Connected"));

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
