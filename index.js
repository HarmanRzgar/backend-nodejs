const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product.js");
const app = express();
const productRoute = require("../routes/product.js");
const userRoute = require("../routes/user.js");
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("../middleware/auth.js");
const libraryRoutes = require("../routes/library.js");
const bookRoutes = require("../routes/book.js");
const adminRoutes = require("../routes/admin.js");
const MONGODB = process.env.MONGO_URL 
require("dotenv").config();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
const PORT = process.env.PORT || 6001;
//routes
app.use("/api/products", productRoute);
app.use("/api/auth", userRoute);

app.use("/api", libraryRoutes);
app.use("/api", bookRoutes);

app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));
app.get("/", (req, res) => {
  res.send("Hello World and galaxies");
});

mongoose
  .connect(MONGODB)
  .then(() => {
    console.log("connected to DB!");
    app.listen(PORT, () => {
      console.log(`server is running on the port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("connection failed!");
  });
