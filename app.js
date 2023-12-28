const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

const productsRoute = require("./api/routes/products");
const ordersRoute = require("./api/routes/orders");
const userRoute = require("./api/routes/user");

mongoose.connect(
  "mongodb+srv://8341stkabirdin:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-shop.kqcjisl.mongodb.net/?retryWrites=true&w=majority"
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT",
      "POST",
      "PATCH",
      "DELETE",
      "GET"
    );
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/user", userRoute);

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
