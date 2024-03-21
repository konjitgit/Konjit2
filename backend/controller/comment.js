const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const connectDatabase = require("../db/Database");
const Comment = require("../models/comment");
const commentRouter = express.Router();
// Add comment route
commentRouter.post(
  "/add-comment",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log(req.body +"hehes");
      const { lastName, firstName, email, comment } = req.body;
      const commentData = { firstName,lastName, email, comment };
      const comments = await Comment.create(commentData);
      res.status(200).json(comments);
    } catch (error) {
      console.error("Error adding comment:", error);
      return next(new ErrorHandler(error, 400));
    }
  })
);

commentRouter.get(
  "/admin-all-comments",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const comments = await Comment.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        comments,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports=commentRouter
