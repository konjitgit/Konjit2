const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const Product = require("../models/product");

app.use(
  cors({
    origin: "https://konjit2-pous.vercel.app",
    // "https://tester-j7yp.vercel.app"
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", async (req, res) => {
  try {
    await connectDatabase();
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error.message);
    console.error(error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
});

const productsRouter = require("./controller/product");
const shopRouter = require("./controller/shop");
const userRouter = require("./controller/user");
const OrdersRouter = require("./controller/order");
const conversationRouter = require("./controller/conversation");
const messageRouter = require("./controller/message");

app.use("/api/products", productsRouter);
app.use("/api/shop", shopRouter);
app.use("/api/user", userRouter);
app.use("/api/order", OrdersRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./config/.env",
  });
}

module.exports = app;
