const express = require("express");
const app = express();

const {
  getCategories,
  getReviews,
  getReviewsById,
  getCommentsByReviewId,
  postComment,
} = require("./controller");

const {
  endPointNotFound,
  customError,
  postgresError,
  internalServerError,
} = require("./error-handlers");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewsById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postComment);

app.all("/*", endPointNotFound); // if no endpoints are matched

app.use(customError);

app.use(postgresError);

app.use(internalServerError);

module.exports = app;
